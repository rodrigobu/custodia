import { useCallback, useEffect, useState } from "react";
import type { Veiculo, VeiculoCreate, VeiculoUpdate, VeiculoFilters } from "../types/veiculo";
import { veiculoService } from "../services/veiculoService";

interface UseVeiculosReturn {
  veiculos: Veiculo[];
  loading: boolean;
  error: string | null;
  filters: VeiculoFilters;
  setFilters: (filters: VeiculoFilters) => void;
  createVeiculo: (data: VeiculoCreate) => Promise<void>;
  updateVeiculo: (id: number, data: VeiculoUpdate) => Promise<void>;
  deleteVeiculo: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useVeiculos(): UseVeiculosReturn {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<VeiculoFilters>({});

  const fetchVeiculos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await veiculoService.list(filters);
      setVeiculos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar veículos");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVeiculos();
  }, [fetchVeiculos]);

  const createVeiculo = async (data: VeiculoCreate) => {
    await veiculoService.create(data);
    await fetchVeiculos();
  };

  const updateVeiculo = async (id: number, data: VeiculoUpdate) => {
    await veiculoService.update(id, data);
    await fetchVeiculos();
  };

  const deleteVeiculo = async (id: number) => {
    await veiculoService.delete(id);
    await fetchVeiculos();
  };

  return {
    veiculos,
    loading,
    error,
    filters,
    setFilters,
    createVeiculo,
    updateVeiculo,
    deleteVeiculo,
    refresh: fetchVeiculos,
  };
}
