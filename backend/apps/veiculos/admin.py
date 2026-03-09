from django.contrib import admin

from apps.veiculos.models import Veiculo


@admin.register(Veiculo)
class VeiculoAdmin(admin.ModelAdmin):
    list_display = ("placa", "veiculo", "data", "local", "status", "valor", "total")
    list_filter = ("status", "acessoria")
    search_fields = ("placa", "veiculo", "local")
