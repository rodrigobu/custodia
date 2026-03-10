from django.contrib.auth.hashers import make_password
from django.db import migrations


def create_admin(apps, schema_editor):
    User = apps.get_model("accounts", "CustomUser")
    if not User.objects.filter(email="admin@custodia.com").exists():
        User.objects.create(
            username="admin@custodia.com",
            email="admin@custodia.com",
            password=make_password("admin123"),
            first_name="Admin",
            last_name="Custodia",
            is_staff=True,
            is_superuser=True,
            is_active=True,
        )


def remove_admin(apps, schema_editor):
    User = apps.get_model("accounts", "CustomUser")
    User.objects.filter(email="admin@custodia.com").delete()


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_admin, remove_admin),
    ]
