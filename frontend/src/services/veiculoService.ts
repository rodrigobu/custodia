import type { Veiculo, VeiculoCreate, VeiculoUpdate, VeiculoFilters, VeiculoHistoryEntry } from "../types/veiculo";
import { authService } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = authService.getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    const tokens = authService.getStoredTokens();
    if (tokens) {
      try {
        const newTokens = await authService.refreshToken(tokens.refresh);
        authService.storeTokens(newTokens);
      } catch {
        authService.clearTokens();
        window.location.reload();
      }
    }
    throw new Error("Sessao expirada. Faca login novamente.");
  }
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
    const response = await fetch(`${API_URL}/veiculos${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Veiculo[]>(response);
  },

  async getById(id: number): Promise<Veiculo> {
    const response = await fetch(`${API_URL}/veiculos/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Veiculo>(response);
  },

  async create(data: VeiculoCreate): Promise<Veiculo> {
    const response = await fetch(`${API_URL}/veiculos`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Veiculo>(response);
  },

  async update(id: number, data: VeiculoUpdate): Promise<Veiculo> {
    const response = await fetch(`${API_URL}/veiculos/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Veiculo>(response);
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/veiculos/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(response);
  },

  async getHistory(id: number): Promise<VeiculoHistoryEntry[]> {
    const response = await fetch(`${API_URL}/veiculos/${id}/history`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<VeiculoHistoryEntry[]>(response);
  },
};
