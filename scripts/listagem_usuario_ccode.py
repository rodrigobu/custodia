import boto3
import json
import csv
from collections import defaultdict
from boto3.dynamodb.conditions import Key
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading
import time

dynamodb = boto3.resource('dynamodb', region_name='sa-east-1')

TABLE_USER_ROLES = 'ateleia_user_roles'
TABLE_CUSTOMER   = 'ateleia_customer'

# Ajuste conforme sua conta (max recomendado sem aumento de limite AWS)
MAX_WORKERS = 50

lock = threading.Lock()


# ─────────────────────────────────────────────
# 1. Scan paralelo em ateleia_user_roles
#    Usa Segments para paralelizar o scan
# ─────────────────────────────────────────────
def scan_segment(segment, total_segments):
    table    = dynamodb.Table(TABLE_USER_ROLES)
    results  = defaultdict(list)
    kwargs   = {
        'ProjectionExpression': 'email, account_roles',
        'Segment':              segment,
        'TotalSegments':        total_segments,
    }

    while True:
        response = table.scan(**kwargs)
        for item in response.get('Items', []):
            email         = item.get('email', '')
            account_roles = item.get('account_roles') or []

            for entry in account_roles:
                cloud_id = entry.get('cloud_id')
                if cloud_id:
                    results[cloud_id].append({
                        'email':  email,
                        'status': entry.get('status', 'N/A'),
                        'roles':  entry.get('roles') or [],
                    })

        last_key = response.get('LastEvaluatedKey')
        if not last_key:
            break
        kwargs['ExclusiveStartKey'] = last_key

    return results


def scan_user_roles():
    total_segments = MAX_WORKERS  # paraleliza o scan em N segmentos
    cloud_id_to_users = defaultdict(list)

    with ThreadPoolExecutor(max_workers=total_segments) as executor:
        futures = {
            executor.submit(scan_segment, seg, total_segments): seg
            for seg in range(total_segments)
        }
        for future in as_completed(futures):
            segment_result = future.result()
            for cloud_id, entries in segment_result.items():
                cloud_id_to_users[cloud_id].extend(entries)

    total_users = sum(len(v) for v in cloud_id_to_users.values())
    print(f'   Total: {total_users} vinculos usuario<->cloud_id lidos')
    print(f'   Total: {len(cloud_id_to_users)} cloud_ids unicos encontrados')
    return cloud_id_to_users


# ─────────────────────────────────────────────
# 2. Query paralela em ateleia_customer
#    N threads simultaneas
# ─────────────────────────────────────────────
def query_customer(cloud_id):
    table = dynamodb.Table(TABLE_CUSTOMER)
    try:
        resp = table.query(
            KeyConditionExpression=Key('cloud_id').eq(cloud_id),
            ProjectionExpression=(
                'cloud_id, t_code, corporate_name, '
                'fantasy_name, federal_id, email, details'
            )
        )
        return cloud_id, resp.get('Items', [])
    except Exception as e:
        print(f'   WARN: Erro cloud_id {cloud_id}: {e}')
        return cloud_id, []


def get_all_customers(cloud_ids: list):
    customers  = {}
    total      = len(cloud_ids)
    concluidos = 0

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(query_customer, cid): cid for cid in cloud_ids}
        for future in as_completed(futures):
            cloud_id, items = future.result()
            if items:
                customers[cloud_id] = items
            concluidos += 1
            if concluidos % 500 == 0 or concluidos == total:
                print(f'   Progresso: {concluidos}/{total} cloud_ids consultados...')

    print(f'   Total: {len(customers)} cloud_ids encontrados em ateleia_customer')
    return customers


# ─────────────────────────────────────────────
# 3. Monta o relatorio
# ─────────────────────────────────────────────
def parse_details(details_raw):
    if not details_raw:
        return 'N/A', 'N/A', 'N/A'
    try:
        d = json.loads(details_raw)
        return d.get('uf', 'N/A'), d.get('municipio', 'N/A'), d.get('situacao', 'N/A')
    except (json.JSONDecodeError, TypeError):
        return 'N/A', 'N/A', 'N/A'


def build_report(cloud_id_to_users, customers):
    rows      = []
    sem_match = 0

    for cloud_id, user_entries in cloud_id_to_users.items():
        customer_list = customers.get(cloud_id)

        # Agrupa os usuarios desse cloud_id
        user_emails  = ', '.join(set(e['email']  for e in user_entries))
        user_statuses = ', '.join(set(e['status'] for e in user_entries))

        if not customer_list:
            sem_match += 1
            rows.append({
                'cloud_id':         cloud_id,
                't_code':           'N/A',
                'corporate_name':   'N/A',
                'fantasy_name':     'N/A',
                'federal_id':       'N/A',
                'uf':               'N/A',
                'municipio':        'N/A',
                'situacao_receita': 'N/A',
                'customer_emails':  'N/A',
                'user_emails':      user_emails,
                'user_statuses':    user_statuses,
                'total_usuarios':   len(user_entries),
            })
            continue

        for customer in customer_list:
            uf, municipio, situacao = parse_details(customer.get('details'))
            customer_email_list = customer.get('email') or []
            rows.append({
                'cloud_id':         cloud_id,
                't_code':           customer.get('t_code', 'N/A'),
                'corporate_name':   customer.get('corporate_name', 'N/A'),
                'fantasy_name':     customer.get('fantasy_name', 'N/A'),
                'federal_id':       customer.get('federal_id', 'N/A'),
                'uf':               uf,
                'municipio':        municipio,
                'situacao_receita': situacao,
                'customer_emails':  ', '.join(customer_email_list),
                'user_emails':      user_emails,
                'user_statuses':    user_statuses,
                'total_usuarios':   len(user_entries),
            })

    if sem_match:
        print(f'   WARN: {sem_match} cloud_ids sem match em ateleia_customer')

    return rows


# ─────────────────────────────────────────────
# 4. Exporta CSV
# ─────────────────────────────────────────────
def export_csv(rows, filename='relatorio_cloud_usuarios.csv'):
    if not rows:
        print('WARN: Nenhum dado para exportar.')
        return

    with open(filename, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)

    print(f'\nArquivo exportado: {filename}')
    print(f'   Total de linhas:    {len(rows)}')


# ─────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────
if __name__ == '__main__':
    inicio = time.time()

    print('=' * 50)
    print('STEP 1 - Scan paralelo em ateleia_user_roles...')
    print('=' * 50)
    cloud_id_to_users = scan_user_roles()

    print()
    print('=' * 50)
    print('STEP 2 - Query paralela em ateleia_customer...')
    print('=' * 50)
    customers = get_all_customers(list(cloud_id_to_users.keys()))

    print()
    print('=' * 50)
    print('STEP 3 - Montando relatorio...')
    print('=' * 50)
    rows = build_report(cloud_id_to_users, customers)
    print(f'   Total: {len(rows)} linhas geradas')

    print()
    print('=' * 50)
    print('STEP 4 - Exportando CSV...')
    print('=' * 50)
    export_csv(rows)

    fim = time.time()
    print(f'\nTempo total: {fim - inicio:.1f}s')
