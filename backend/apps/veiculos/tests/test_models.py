import pytest
from decimal import Decimal
from django.db import IntegrityError

from apps.veiculos.models import Veiculo, StatusChoices
from apps.veiculos.tests.factories import VeiculoFactory


@pytest.mark.django_db
class TestVeiculoModel:
    def test_create_veiculo(self):
        veiculo = VeiculoFactory()
        assert veiculo.pk is not None
        assert veiculo.status == StatusChoices.APREENDIDO

    def test_str_representation(self):
        veiculo = VeiculoFactory(placa="ABC1234", veiculo="Fiat Uno")
        assert str(veiculo) == "ABC1234 - Fiat Uno"

    def test_placa_unique(self):
        VeiculoFactory(placa="XYZ9999")
        with pytest.raises(IntegrityError):
            VeiculoFactory(placa="XYZ9999")

    def test_status_choices(self):
        assert StatusChoices.APREENDIDO == "apreendido"
        assert StatusChoices.LIBERADO == "liberado"
        assert StatusChoices.EM_PROCESSO == "em_processo"

    def test_ordering(self):
        v1 = VeiculoFactory(data="2024-01-01")
        v2 = VeiculoFactory(data="2024-06-01")
        veiculos = list(Veiculo.objects.all())
        assert veiculos[0] == v2
        assert veiculos[1] == v1

    def test_default_status(self):
        veiculo = VeiculoFactory()
        assert veiculo.status == "apreendido"

    def test_valor_decimal(self):
        veiculo = VeiculoFactory(valor=Decimal("25000.50"))
        veiculo.refresh_from_db()
        assert veiculo.valor == Decimal("25000.50")

    def test_create_without_placa_fails(self):
        with pytest.raises(IntegrityError):
            Veiculo.objects.create(
                placa=None,
                veiculo="Test",
                data="2024-01-01",
                local="SP",
                acessoria="A",
                valor=Decimal("1000.00"),
                total=Decimal("0.00"),
            )

    def test_timestamps_auto_set(self):
        veiculo = VeiculoFactory()
        assert veiculo.created_at is not None
        assert veiculo.updated_at is not None
