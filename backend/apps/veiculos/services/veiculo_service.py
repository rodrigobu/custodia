from decimal import Decimal
from typing import Any

from apps.veiculos.models import StatusChoices
from apps.veiculos.repositories.base import BaseVeiculoRepository
from apps.veiculos.services.history_service import (
    record_vehicle_changes,
    record_vehicle_created,
)


VALID_STATUSES = {choice.value for choice in StatusChoices}


class VeiculoService:
    def __init__(self, repository: BaseVeiculoRepository):
        self._repository = repository

    def list_veiculos(self, filters: dict[str, Any] | None = None):
        return self._repository.get_all(filters)

    def get_veiculo(self, veiculo_id: int):
        veiculo = self._repository.get_by_id(veiculo_id)
        if not veiculo:
            raise ValueError("Veículo não encontrado")
        return veiculo

    def create_veiculo(self, data: dict[str, Any]):
        self._validate_placa(data["placa"])
        self._validate_status(data.get("status", "apreendido"))
        self._validate_valor(data["valor"])

        existing = self._repository.get_by_placa(data["placa"])
        if existing:
            raise ValueError("Já existe um veículo com esta placa")

        veiculo = self._repository.create(data)
        record_vehicle_created(veiculo)
        return veiculo

    def update_veiculo(self, veiculo_id: int, data: dict[str, Any]):
        clean_data = {k: v for k, v in data.items() if v is not None}
        if not clean_data:
            raise ValueError("Nenhum dado para atualizar")

        if "status" in clean_data:
            self._validate_status(clean_data["status"])

        if "valor" in clean_data:
            self._validate_valor(clean_data["valor"])

        if "placa" in clean_data:
            self._validate_placa(clean_data["placa"])
            existing = self._repository.get_by_placa(clean_data["placa"])
            if existing and existing.id != veiculo_id:
                raise ValueError("Já existe um veículo com esta placa")

        current_veiculo = self._repository.get_by_id(veiculo_id)
        if not current_veiculo:
            raise ValueError("Veículo não encontrado")

        record_vehicle_changes(current_veiculo, clean_data)

        veiculo = self._repository.update(veiculo_id, clean_data)
        if not veiculo:
            raise ValueError("Veículo não encontrado")
        return veiculo

    def delete_veiculo(self, veiculo_id: int):
        deleted = self._repository.delete(veiculo_id)
        if not deleted:
            raise ValueError("Veículo não encontrado")

    def get_total(self) -> Decimal:
        return self._repository.calculate_total()

    def _validate_placa(self, placa: str):
        if not placa or len(placa.strip()) < 7:
            raise ValueError("Placa inválida. Deve ter pelo menos 7 caracteres")

    def _validate_status(self, status: str):
        if status not in VALID_STATUSES:
            raise ValueError(f"Status inválido. Opções: {', '.join(VALID_STATUSES)}")

    def _validate_valor(self, valor: Decimal):
        if valor < 0:
            raise ValueError("Valor não pode ser negativo")
