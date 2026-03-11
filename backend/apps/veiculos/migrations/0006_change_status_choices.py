from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("veiculos", "0005_add_vehicle_history"),
    ]

    operations = [
        migrations.AlterField(
            model_name="veiculo",
            name="status",
            field=models.CharField(
                choices=[
                    ("apreendido", "Apreendido"),
                    ("em_busca", "Em busca"),
                    ("localizado", "Localizado"),
                ],
                default="apreendido",
                max_length=20,
            ),
        ),
    ]
