import json

from django.db import migrations, models


def convert_imagem_url_to_imagens(apps, schema_editor):
    Veiculo = apps.get_model("veiculos", "Veiculo")
    for veiculo in Veiculo.objects.all():
        url = veiculo.imagem_url or ""
        veiculo.imagens = [url] if url else []
        veiculo.save(update_fields=["imagens"])


def convert_imagens_to_imagem_url(apps, schema_editor):
    Veiculo = apps.get_model("veiculos", "Veiculo")
    for veiculo in Veiculo.objects.all():
        imagens = veiculo.imagens or []
        veiculo.imagem_url = imagens[0] if imagens else ""
        veiculo.save(update_fields=["imagem_url"])


class Migration(migrations.Migration):

    dependencies = [
        ("veiculos", "0002_add_imagem_url"),
    ]

    operations = [
        migrations.AddField(
            model_name="veiculo",
            name="imagens",
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.RunPython(
            convert_imagem_url_to_imagens,
            convert_imagens_to_imagem_url,
        ),
        migrations.RemoveField(
            model_name="veiculo",
            name="imagem_url",
        ),
    ]
