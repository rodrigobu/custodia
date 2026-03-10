from django.contrib import admin

from apps.veiculos.models import Veiculo, VeiculoHistory


@admin.register(Veiculo)
class VeiculoAdmin(admin.ModelAdmin):
    list_display = ("placa", "veiculo", "data", "local", "status", "valor", "total")
    list_filter = ("status", "acessoria")
    search_fields = ("placa", "veiculo", "local")


@admin.register(VeiculoHistory)
class VeiculoHistoryAdmin(admin.ModelAdmin):
    list_display = ("veiculo", "event_type", "description", "user", "created_at")
    list_filter = ("event_type",)
    search_fields = ("description", "user")
    readonly_fields = ("veiculo", "event_type", "description", "old_value", "new_value", "user", "created_at")
