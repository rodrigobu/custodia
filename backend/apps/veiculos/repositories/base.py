from abc import ABC, abstractmethod
from decimal import Decimal
from typing import Any


class BaseVeiculoRepository(ABC):
    @abstractmethod
    def get_all(self, filters: dict[str, Any] | None = None) -> list:
        pass

    @abstractmethod
    def get_by_id(self, veiculo_id: int):
        pass

    @abstractmethod
    def get_by_placa(self, placa: str):
        pass

    @abstractmethod
    def create(self, data: dict[str, Any]):
        pass

    @abstractmethod
    def update(self, veiculo_id: int, data: dict[str, Any]):
        pass

    @abstractmethod
    def delete(self, veiculo_id: int) -> bool:
        pass

    @abstractmethod
    def calculate_total(self) -> Decimal:
        pass
