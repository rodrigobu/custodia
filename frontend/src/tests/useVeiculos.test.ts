import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useVeiculos } from "../hooks/useVeiculos";
import { veiculoService } from "../services/veiculoService";
import type { Veiculo } from "../types/veiculo";

vi.mock("../services/veiculoService");

const mockVeiculo: Veiculo = {
  id: 1,
  placa: "ABC1234",
  veiculo: "Fiat Uno",
  data: "2024-01-01",
  local: "SP",
  acessoria: "A",
  status: "apreendido",
  valor: "10000.00",
  total: "10000.00",
  imagens: [],
  created_at: "",
  updated_at: "",
};

describe("useVeiculos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads veiculos on mount", async () => {
    vi.mocked(veiculoService.list).mockResolvedValue([mockVeiculo]);

    const { result } = renderHook(() => useVeiculos());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.veiculos).toEqual([mockVeiculo]);
    expect(result.current.error).toBeNull();
  });

  it("handles error on load", async () => {
    vi.mocked(veiculoService.list).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useVeiculos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.veiculos).toEqual([]);
  });

  it("creates veiculo and refreshes list", async () => {
    vi.mocked(veiculoService.list).mockResolvedValue([]);
    vi.mocked(veiculoService.create).mockResolvedValue(mockVeiculo);

    const { result } = renderHook(() => useVeiculos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    vi.mocked(veiculoService.list).mockResolvedValue([mockVeiculo]);

    await result.current.createVeiculo({
      placa: "ABC1234",
      veiculo: "Fiat Uno",
      data: "2024-01-01",
      local: "SP",
      acessoria: "A",
      status: "apreendido",
      valor: "10000.00",
    });

    await waitFor(() => {
      expect(result.current.veiculos).toEqual([mockVeiculo]);
    });
  });

  it("deletes veiculo and refreshes list", async () => {
    vi.mocked(veiculoService.list).mockResolvedValue([mockVeiculo]);
    vi.mocked(veiculoService.delete).mockResolvedValue(undefined);

    const { result } = renderHook(() => useVeiculos());

    await waitFor(() => {
      expect(result.current.veiculos).toHaveLength(1);
    });

    vi.mocked(veiculoService.list).mockResolvedValue([]);

    await result.current.deleteVeiculo(1);

    await waitFor(() => {
      expect(result.current.veiculos).toHaveLength(0);
    });
  });
});
