import pytest

from django.test import Client

from apps.veiculos.tests.factories import VeiculoFactory


@pytest.mark.django_db
class TestVeiculoAPI:
    def setup_method(self):
        self.client = Client()

    def test_list_veiculos(self):
        VeiculoFactory.create_batch(3)
        response = self.client.get("/api/veiculos")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3

    def test_list_veiculos_filter_by_status(self):
        VeiculoFactory(status="apreendido")
        VeiculoFactory(status="liberado")
        response = self.client.get("/api/veiculos?status=apreendido")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["status"] == "apreendido"

    def test_get_veiculo(self):
        veiculo = VeiculoFactory()
        response = self.client.get(f"/api/veiculos/{veiculo.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["placa"] == veiculo.placa

    def test_get_veiculo_not_found(self):
        response = self.client.get("/api/veiculos/99999")
        assert response.status_code == 404

    def test_create_veiculo(self):
        payload = {
            "placa": "NEW1234",
            "veiculo": "Honda Civic",
            "data": "2024-06-01",
            "local": "Rio de Janeiro",
            "acessoria": "Assessoria Y",
            "status": "apreendido",
            "valor": "30000.00",
        }
        response = self.client.post(
            "/api/veiculos",
            data=payload,
            content_type="application/json",
        )
        assert response.status_code == 201
        data = response.json()
        assert data["placa"] == "NEW1234"

    def test_create_veiculo_duplicate_placa(self):
        VeiculoFactory(placa="DUP1234")
        payload = {
            "placa": "DUP1234",
            "veiculo": "Fiat Palio",
            "data": "2024-06-01",
            "local": "Curitiba",
            "acessoria": "Assessoria Z",
            "valor": "20000.00",
        }
        response = self.client.post(
            "/api/veiculos",
            data=payload,
            content_type="application/json",
        )
        assert response.status_code == 400

    def test_update_veiculo(self):
        veiculo = VeiculoFactory()
        payload = {"status": "liberado"}
        response = self.client.put(
            f"/api/veiculos/{veiculo.id}",
            data=payload,
            content_type="application/json",
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "liberado"

    def test_update_veiculo_not_found(self):
        payload = {"status": "liberado"}
        response = self.client.put(
            "/api/veiculos/99999",
            data=payload,
            content_type="application/json",
        )
        assert response.status_code == 404

    def test_delete_veiculo(self):
        veiculo = VeiculoFactory()
        response = self.client.delete(f"/api/veiculos/{veiculo.id}")
        assert response.status_code == 204

    def test_delete_veiculo_not_found(self):
        response = self.client.delete("/api/veiculos/99999")
        assert response.status_code == 404

    def test_filter_by_placa(self):
        VeiculoFactory(placa="FLT1234")
        VeiculoFactory(placa="OTH5678")
        response = self.client.get("/api/veiculos?placa=FLT")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1

    def test_create_veiculo_missing_fields(self):
        payload = {"placa": "TST1234"}
        response = self.client.post(
            "/api/veiculos",
            data=payload,
            content_type="application/json",
        )
        assert response.status_code == 422

    def test_create_veiculo_invalid_placa_short(self):
        payload = {
            "placa": "AB",
            "veiculo": "Test",
            "data": "2024-01-01",
            "local": "SP",
            "acessoria": "A",
            "valor": "1000.00",
        }
        response = self.client.post(
            "/api/veiculos",
            data=payload,
            content_type="application/json",
        )
        assert response.status_code == 400

    def test_full_crud_flow(self):
        # Create
        payload = {
            "placa": "FLW1234",
            "veiculo": "VW Gol",
            "data": "2024-03-15",
            "local": "Belo Horizonte",
            "acessoria": "Assessoria BH",
            "status": "apreendido",
            "valor": "18000.00",
        }
        resp = self.client.post("/api/veiculos", data=payload, content_type="application/json")
        assert resp.status_code == 201
        veiculo_id = resp.json()["id"]

        # Read
        resp = self.client.get(f"/api/veiculos/{veiculo_id}")
        assert resp.status_code == 200
        assert resp.json()["placa"] == "FLW1234"

        # Update
        resp = self.client.put(
            f"/api/veiculos/{veiculo_id}",
            data={"status": "liberado"},
            content_type="application/json",
        )
        assert resp.status_code == 200
        assert resp.json()["status"] == "liberado"

        # Delete
        resp = self.client.delete(f"/api/veiculos/{veiculo_id}")
        assert resp.status_code == 204

        # Verify deleted
        resp = self.client.get(f"/api/veiculos/{veiculo_id}")
        assert resp.status_code == 404

    def test_special_characters_in_search(self):
        VeiculoFactory(placa="SQL1234", local="São Paulo")
        response = self.client.get("/api/veiculos?placa='; DROP TABLE--")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 0

    def test_list_empty(self):
        response = self.client.get("/api/veiculos")
        assert response.status_code == 200
        assert response.json() == []
