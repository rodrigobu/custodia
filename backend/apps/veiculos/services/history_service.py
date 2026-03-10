from apps.veiculos.models import EventType, VeiculoHistory


COST_FIELDS = {"valor_servico", "custo_operacao", "valor_recebido", "valor"}
PHOTO_FIELDS = {"imagem_url", "imagem_url_2", "imagem_url_3"}
DATA_FIELDS = {
    "placa", "marca", "modelo", "ano", "acessoria", "data",
    "data_apreensao", "cidade", "local", "observacoes",
    "quem_executou", "ano_reg", "semana_iso",
}

FIELD_LABELS = {
    "placa": "Placa",
    "marca": "Marca",
    "modelo": "Modelo",
    "ano": "Ano",
    "acessoria": "Assessoria",
    "status": "Status",
    "data": "Data Registro",
    "data_apreensao": "Data Apreensão",
    "cidade": "Cidade",
    "local": "Local",
    "valor_servico": "Valor Serviço",
    "custo_operacao": "Custo Operação",
    "valor_recebido": "Valor Recebido",
    "valor": "Valor",
    "observacoes": "Observações",
    "quem_executou": "Quem Executou",
    "ano_reg": "Ano (Reg)",
    "semana_iso": "Semana ISO",
    "imagem_url": "Foto 1",
    "imagem_url_2": "Foto 2",
    "imagem_url_3": "Foto 3",
}

STATUS_LABELS = {
    "apreendido": "Apreendido",
    "liberado": "Liberado",
    "em_processo": "Em Processo",
}


def record_vehicle_created(veiculo):
    VeiculoHistory.objects.create(
        veiculo=veiculo,
        event_type=EventType.VEHICLE_CREATED,
        description=f"Veículo {veiculo.placa} cadastrado",
        user=veiculo.quem_executou or "",
    )


def record_vehicle_changes(veiculo, update_data):
    old_values = {}
    for field in update_data:
        if hasattr(veiculo, field):
            old_values[field] = getattr(veiculo, field)

    user = update_data.get("quem_executou") or veiculo.quem_executou or ""

    for field, new_val in update_data.items():
        old_val = old_values.get(field)
        if old_val is None and new_val is None:
            continue
        if str(old_val) == str(new_val):
            continue

        label = FIELD_LABELS.get(field, field)
        old_display = str(old_val) if old_val not in (None, "") else ""
        new_display = str(new_val) if new_val not in (None, "") else ""

        if field == "status":
            old_display = STATUS_LABELS.get(str(old_val), old_display)
            new_display = STATUS_LABELS.get(str(new_val), new_display)
            VeiculoHistory.objects.create(
                veiculo=veiculo,
                event_type=EventType.STATUS_CHANGED,
                description=f"Status alterado de {old_display} para {new_display}",
                old_value=old_display,
                new_value=new_display,
                user=user,
            )
        elif field in COST_FIELDS:
            VeiculoHistory.objects.create(
                veiculo=veiculo,
                event_type=EventType.COST_CHANGED,
                description=f"{label} alterado de R$ {old_display} para R$ {new_display}",
                old_value=old_display,
                new_value=new_display,
                user=user,
            )
        elif field in PHOTO_FIELDS:
            if new_val and not old_val:
                event_type = EventType.PHOTO_ADDED
                description = f"{label} adicionada"
            elif not new_val and old_val:
                event_type = EventType.PHOTO_REMOVED
                description = f"{label} removida"
            else:
                event_type = EventType.PHOTO_ADDED
                description = f"{label} atualizada"
            VeiculoHistory.objects.create(
                veiculo=veiculo,
                event_type=event_type,
                description=description,
                old_value=old_display,
                new_value=new_display,
                user=user,
            )
        elif field in DATA_FIELDS:
            VeiculoHistory.objects.create(
                veiculo=veiculo,
                event_type=EventType.DATA_CHANGED,
                description=f"{label} alterado de '{old_display}' para '{new_display}'",
                old_value=old_display,
                new_value=new_display,
                user=user,
            )


def get_vehicle_history(veiculo_id, limit=50):
    return VeiculoHistory.objects.filter(
        veiculo_id=veiculo_id
    ).order_by("-created_at")[:limit]
