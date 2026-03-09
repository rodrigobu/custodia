from django.db import models


class StatusChoices(models.TextChoices):
    APREENDIDO = "apreendido", "Apreendido"
    LIBERADO = "liberado", "Liberado"
    EM_PROCESSO = "em_processo", "Em Processo"


class Veiculo(models.Model):
    placa = models.CharField(max_length=10, unique=True)
    veiculo = models.CharField(max_length=200)
    data = models.DateField()
    local = models.CharField(max_length=300)
    acessoria = models.CharField(max_length=200)
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.APREENDIDO,
    )
    valor = models.DecimalField(max_digits=12, decimal_places=2)
    total = models.DecimalField(max_digits=12, decimal_places=2, editable=False, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-data"]
        verbose_name = "Veículo"
        verbose_name_plural = "Veículos"

    def __str__(self):
        return f"{self.placa} - {self.veiculo}"
