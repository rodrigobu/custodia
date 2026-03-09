from datetime import date
from decimal import Decimal

from ninja import Schema


class VeiculoCreateSchema(Schema):
    placa: str
    veiculo: str
    data: date
    local: str
    acessoria: str
    status: str = "apreendido"
    valor: Decimal


class VeiculoUpdateSchema(Schema):
    placa: str | None = None
    veiculo: str | None = None
    data: date | None = None
    local: str | None = None
    acessoria: str | None = None
    status: str | None = None
    valor: Decimal | None = None


class VeiculoResponseSchema(Schema):
    id: int
    placa: str
    veiculo: str
    data: date
    local: str
    acessoria: str
    status: str
    valor: Decimal
    total: Decimal
    created_at: str
    updated_at: str

    @staticmethod
    def resolve_created_at(obj):
        return obj.created_at.isoformat()

    @staticmethod
    def resolve_updated_at(obj):
        return obj.updated_at.isoformat()


class ErrorSchema(Schema):
    detail: str
