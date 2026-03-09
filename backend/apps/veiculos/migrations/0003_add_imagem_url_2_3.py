from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("veiculos", "0002_add_imagem_url"),
    ]

    operations = [
        migrations.AddField(
            model_name="veiculo",
            name="imagem_url_2",
            field=models.URLField(blank=True, default="", max_length=500),
        ),
        migrations.AddField(
            model_name="veiculo",
            name="imagem_url_3",
            field=models.URLField(blank=True, default="", max_length=500),
        ),
    ]
