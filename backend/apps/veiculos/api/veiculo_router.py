from ninja import NinjaAPI, Query

from apps.veiculos.repositories.veiculo_repo import VeiculoRepository
from apps.veiculos.schemas import (
    ErrorSchema,
    VeiculoCreateSchema,
    VeiculoResponseSchema,
    VeiculoUpdateSchema,
)
from apps.veiculos.services.veiculo_service import VeiculoService

api = NinjaAPI(title="Custódia API", version="1.0.0")


def _get_service() -> VeiculoService:
    return VeiculoService(VeiculoRepository())


@api.get("/veiculos", response=list[VeiculoResponseSchema])
def list_veiculos(
    request,
    placa: str | None = Query(None),
    status: str | None = Query(None),
    acessoria: str | None = Query(None),
    local: str | None = Query(None),
):
    filters = {}
    if placa:
        filters["placa"] = placa
    if status:
        filters["status"] = status
    if acessoria:
        filters["acessoria"] = acessoria
    if local:
        filters["local"] = local
    return _get_service().list_veiculos(filters or None)


@api.get("/veiculos/{veiculo_id}", response={200: VeiculoResponseSchema, 404: ErrorSchema})
def get_veiculo(request, veiculo_id: int):
    try:
        return 200, _get_service().get_veiculo(veiculo_id)
    except ValueError as e:
        return 404, {"detail": str(e)}


@api.post("/veiculos", response={201: VeiculoResponseSchema, 400: ErrorSchema})
def create_veiculo(request, payload: VeiculoCreateSchema):
    try:
        veiculo = _get_service().create_veiculo(payload.dict())
        return 201, veiculo
    except ValueError as e:
        return 400, {"detail": str(e)}


@api.put("/veiculos/{veiculo_id}", response={200: VeiculoResponseSchema, 400: ErrorSchema, 404: ErrorSchema})
def update_veiculo(request, veiculo_id: int, payload: VeiculoUpdateSchema):
    try:
        veiculo = _get_service().update_veiculo(veiculo_id, payload.dict())
        return 200, veiculo
    except ValueError as e:
        error_msg = str(e)
        status_code = 404 if "não encontrado" in error_msg else 400
        return status_code, {"detail": error_msg}


@api.delete("/veiculos/{veiculo_id}", response={204: None, 404: ErrorSchema})
def delete_veiculo(request, veiculo_id: int):
    try:
        _get_service().delete_veiculo(veiculo_id)
        return 204, None
    except ValueError as e:
        return 404, {"detail": str(e)}


@api.get("/veiculos/total", response={200: dict})
def get_total(request):
    total = _get_service().get_total()
    return {"total": str(total)}
