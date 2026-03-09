import type { Veiculo, VeiculoCreate, VeiculoUpdate, VeiculoFilters } from "../types/veiculo";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Erro desconhecido" }));
    throw new Error(error.detail || `Erro ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

export const veiculoService = {
  async list(filters?: VeiculoFilters): Promise<Veiculo[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await fetch(`${API_URL}/veiculos${query}`);
    return handleResponse<Veiculo[]>(response);
  },

  async getById(id: number): Promise<Veiculo> {
    const response = await fetch(`${API_URL}/veiculos/${id}`);
    return handleResponse<Veiculo>(response);
  },

  async create(data: VeiculoCreate): Promise<Veiculo> {
    const response = await fetch(`${API_URL}/veiculos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Veiculo>(response);
  },

  async update(id: number, data: VeiculoUpdate): Promise<Veiculo> {
    const response = await fetch(`${API_URL}/veiculos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Veiculo>(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/veiculos/${id}`, {
      method: "DELETE",
    });
    return handleResponse<void>(response);
  },
};
