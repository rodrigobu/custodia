from django.db import models


class StatusChoices(models.TextChoices):
    APREENDIDO = "apreendido", "Apreendido"
    EM_BUSCA = "em_busca", "Em busca"
    LOCALIZADO = "localizado", "Localizado"


class EventType(models.TextChoices):
    VEHICLE_CREATED = "VEHICLE_CREATED", "Veículo criado"
    STATUS_CHANGED = "STATUS_CHANGED", "Status alterado"
    COST_CHANGED = "COST_CHANGED", "Custo alterado"
    DATA_CHANGED = "DATA_CHANGED", "Dados alterados"
    PHOTO_ADDED = "PHOTO_ADDED", "Foto adicionada"
    PHOTO_REMOVED = "PHOTO_REMOVED", "Foto removida"


class VeiculoHistory(models.Model):
    veiculo = models.ForeignKey(
        "Veiculo",
        on_delete=models.CASCADE,
        related_name="history",
    )
    event_type = models.CharField(max_length=30, choices=EventType.choices)
    description = models.CharField(max_length=500)
    old_value = models.CharField(max_length=500, blank=True, default="")
    new_value = models.CharField(max_length=500, blank=True, default="")
    user = models.CharField(max_length=200, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Histórico do Veículo"
        verbose_name_plural = "Históricos dos Veículos"

    def __str__(self):
        return f"{self.event_type} - {self.veiculo_id} - {self.created_at}"


class Veiculo(models.Model):
    # Vehicle info
    placa = models.CharField(max_length=10, unique=True)
    marca = models.CharField(max_length=100, blank=True, default="")
    modelo = models.CharField(max_length=200, blank=True, default="")
    ano = models.IntegerField(null=True, blank=True)
    # Legacy field kept for backward compatibility
    veiculo = models.CharField(max_length=200, blank=True, default="")

    # Costs / Operations
    acessoria = models.CharField(max_length=200)
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.APREENDIDO,
    )
    data = models.DateField()
    data_apreensao = models.DateField(null=True, blank=True)
    cidade = models.CharField(max_length=300, blank=True, default="")
    # Legacy field kept for backward compatibility
    local = models.CharField(max_length=300, blank=True, default="")
    valor_servico = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    custo_operacao = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    valor_recebido = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    observacoes = models.TextField(blank=True, default="")
    ano_reg = models.IntegerField(null=True, blank=True)
    semana_iso = models.IntegerField(null=True, blank=True)
    quem_executou = models.CharField(max_length=200, blank=True, default="")
    # Legacy fields kept for backward compatibility
    valor = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, editable=False, default=0)

    # Images
    imagem_url = models.URLField(max_length=500, blank=True, default="")
    imagem_url_2 = models.URLField(max_length=500, blank=True, default="")
    imagem_url_3 = models.URLField(max_length=500, blank=True, default="")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-data"]
        verbose_name = "Veículo"
        verbose_name_plural = "Veículos"

    def __str__(self):
        label = f"{self.marca} {self.modelo}".strip() or self.veiculo
        return f"{self.placa} - {label}"
