import pytest
from decimal import Decimal
from unittest.mock import MagicMock, patch

from apps.veiculos.services.veiculo_service import VeiculoService


class TestVeiculoService:
    def setup_method(self):
        self.mock_repo = MagicMock()
        self.service = VeiculoService(self.mock_repo)

    def test_list_veiculos(self):
        self.mock_repo.get_all.return_value = ["v1", "v2"]
        result = self.service.list_veiculos()
        self.mock_repo.get_all.assert_called_once_with(None)
        assert result == ["v1", "v2"]

    def test_list_veiculos_with_filters(self):
        filters = {"status": "apreendido"}
        self.service.list_veiculos(filters)
        self.mock_repo.get_all.assert_called_once_with(filters)

    def test_get_veiculo_found(self):
        self.mock_repo.get_by_id.return_value = "veiculo"
        result = self.service.get_veiculo(1)
        assert result == "veiculo"

    def test_get_veiculo_not_found(self):
        self.mock_repo.get_by_id.return_value = None
        with pytest.raises(ValueError, match="não encontrado"):
            self.service.get_veiculo(1)

    @patch("apps.veiculos.services.veiculo_service.record_vehicle_created")
    def test_create_veiculo_success(self, mock_record):
        self.mock_repo.get_by_placa.return_value = None
        data = {
            "placa": "ABC1234",
            "veiculo": "Fiat Uno",
            "data": "2024-01-01",
            "local": "São Paulo",
            "acessoria": "Assessoria X",
            "status": "apreendido",
            "valor": Decimal("10000.00"),
        }
        self.service.create_veiculo(data)
        self.mock_repo.create.assert_called_once_with(data)
        mock_record.assert_called_once()

    def test_create_veiculo_duplicate_placa(self):
        self.mock_repo.get_by_placa.return_value = MagicMock()
        data = {
            "placa": "ABC1234",
            "valor": Decimal("10000.00"),
            "status": "apreendido",
        }
        with pytest.raises(ValueError, match="Já existe"):
            self.service.create_veiculo(data)

    def test_create_veiculo_invalid_placa(self):
        data = {"placa": "AB", "valor": Decimal("10000.00")}
        with pytest.raises(ValueError, match="Placa inválida"):
            self.service.create_veiculo(data)

    def test_create_veiculo_invalid_status(self):
        data = {
            "placa": "ABC1234",
            "valor": Decimal("10000.00"),
            "status": "invalido",
        }
        with pytest.raises(ValueError, match="Status inválido"):
            self.service.create_veiculo(data)

    def test_create_veiculo_negative_valor(self):
        data = {
            "placa": "ABC1234",
            "valor": Decimal("-100.00"),
            "status": "apreendido",
        }
        with pytest.raises(ValueError, match="negativo"):
            self.service.create_veiculo(data)

    @patch("apps.veiculos.services.veiculo_service.record_vehicle_changes")
    def test_update_veiculo_success(self, mock_record):
        self.mock_repo.update.return_value = MagicMock()
        data = {"status": "liberado"}
        self.service.update_veiculo(1, data)
        self.mock_repo.update.assert_called_once()
        mock_record.assert_called_once()

    @patch("apps.veiculos.services.veiculo_service.record_vehicle_changes")
    def test_update_veiculo_not_found(self, mock_record):
        self.mock_repo.get_by_id.return_value = MagicMock()
        self.mock_repo.update.return_value = None
        with pytest.raises(ValueError, match="não encontrado"):
            self.service.update_veiculo(1, {"status": "liberado"})

    def test_update_veiculo_empty_data(self):
        with pytest.raises(ValueError, match="Nenhum dado"):
            self.service.update_veiculo(1, {})

    def test_delete_veiculo_success(self):
        self.mock_repo.delete.return_value = True
        self.service.delete_veiculo(1)
        self.mock_repo.delete.assert_called_once_with(1)

    def test_delete_veiculo_not_found(self):
        self.mock_repo.delete.return_value = False
        with pytest.raises(ValueError, match="não encontrado"):
            self.service.delete_veiculo(1)

    def test_get_total(self):
        self.mock_repo.calculate_total.return_value = Decimal("50000.00")
        result = self.service.get_total()
        assert result == Decimal("50000.00")
