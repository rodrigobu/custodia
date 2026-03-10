from datetime import date
from decimal import Decimal

from ninja import Schema


class VeiculoCreateSchema(Schema):
    placa: str
    marca: str = ""
    modelo: str = ""
    ano: int | None = None
    veiculo: str = ""
    acessoria: str
    status: str = "apreendido"
    data: date
    data_apreensao: date | None = None
    cidade: str = ""
    local: str = ""
    valor_servico: Decimal = Decimal("0")
    custo_operacao: Decimal = Decimal("0")
    valor_recebido: Decimal = Decimal("0")
    observacoes: str = ""
    ano_reg: int | None = None
    semana_iso: int | None = None
    quem_executou: str = ""
    valor: Decimal = Decimal("0")
    imagem_url: str = ""
    imagem_url_2: str = ""
    imagem_url_3: str = ""


class VeiculoUpdateSchema(Schema):
    placa: str | None = None
    marca: str | None = None
    modelo: str | None = None
    ano: int | None = None
    veiculo: str | None = None
    acessoria: str | None = None
    status: str | None = None
    data: date | None = None
    data_apreensao: date | None = None
    cidade: str | None = None
    local: str | None = None
    valor_servico: Decimal | None = None
    custo_operacao: Decimal | None = None
    valor_recebido: Decimal | None = None
    observacoes: str | None = None
    ano_reg: int | None = None
    semana_iso: int | None = None
    quem_executou: str | None = None
    valor: Decimal | None = None
    imagem_url: str | None = None
    imagem_url_2: str | None = None
    imagem_url_3: str | None = None


class VeiculoResponseSchema(Schema):
    id: int
    placa: str
    marca: str
    modelo: str
    ano: int | None
    veiculo: str
    acessoria: str
    status: str
    data: date
    data_apreensao: date | None
    cidade: str
    local: str
    valor_servico: Decimal
    custo_operacao: Decimal
    valor_recebido: Decimal
    observacoes: str
    ano_reg: int | None
    semana_iso: int | None
    quem_executou: str
    valor: Decimal
    total: Decimal
    imagem_url: str
    imagem_url_2: str
    imagem_url_3: str
    created_at: str
    updated_at: str

    @staticmethod
    def resolve_created_at(obj):
        return obj.created_at.isoformat()

    @staticmethod
    def resolve_updated_at(obj):
        return obj.updated_at.isoformat()


class VeiculoHistorySchema(Schema):
    id: int
    event_type: str
    description: str
    old_value: str
    new_value: str
    user: str
    created_at: str

    @staticmethod
    def resolve_created_at(obj):
        return obj.created_at.isoformat()


class ErrorSchema(Schema):
    detail: str
