from decimal import Decimal
from typing import Any

from django.db.models import QuerySet, Sum

from apps.veiculos.models import Veiculo
from apps.veiculos.repositories.base import BaseVeiculoRepository


class VeiculoRepository(BaseVeiculoRepository):
    def get_all(self, filters: dict[str, Any] | None = None) -> QuerySet:
        qs = Veiculo.objects.all()
        if filters:
            if placa := filters.get("placa"):
                qs = qs.filter(placa__icontains=placa)
            if status := filters.get("status"):
                qs = qs.filter(status=status)
            if acessoria := filters.get("acessoria"):
                qs = qs.filter(acessoria__icontains=acessoria)
            if local := filters.get("local"):
                qs = qs.filter(local__icontains=local)
        return qs

    def get_by_id(self, veiculo_id: int) -> Veiculo | None:
        try:
            return Veiculo.objects.get(id=veiculo_id)
        except Veiculo.DoesNotExist:
            return None

    def get_by_placa(self, placa: str) -> Veiculo | None:
        try:
            return Veiculo.objects.get(placa=placa)
        except Veiculo.DoesNotExist:
            return None

    def create(self, data: dict[str, Any]) -> Veiculo:
        total = self._calculate_running_total(data["valor"])
        return Veiculo.objects.create(**data, total=total)

    def update(self, veiculo_id: int, data: dict[str, Any]) -> Veiculo | None:
        veiculo = self.get_by_id(veiculo_id)
        if not veiculo:
            return None
        for key, value in data.items():
            setattr(veiculo, key, value)
        if "valor" in data:
            veiculo.total = self._calculate_running_total(data["valor"])
        veiculo.save()
        return veiculo

    def delete(self, veiculo_id: int) -> bool:
        veiculo = self.get_by_id(veiculo_id)
        if not veiculo:
            return False
        veiculo.delete()
        return True

    def calculate_total(self) -> Decimal:
        result = Veiculo.objects.aggregate(total=Sum("valor"))
        return result["total"] or Decimal("0.00")

    def _calculate_running_total(self, current_valor: Decimal) -> Decimal:
        existing_total = self.calculate_total()
        return existing_total + current_valor
