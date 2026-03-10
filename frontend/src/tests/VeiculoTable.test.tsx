import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { VeiculoTable } from "../components/VeiculoTable";
import type { Veiculo } from "../types/veiculo";

const baseVeiculo: Omit<Veiculo, "id" | "placa" | "veiculo" | "marca" | "modelo" | "data" | "local" | "acessoria" | "status" | "valor"> = {
  ano: null,
  data_apreensao: null,
  cidade: "",
  valor_servico: "0",
  custo_operacao: "0",
  valor_recebido: "0",
  observacoes: "",
  ano_reg: null,
  semana_iso: null,
  quem_executou: "",
  total: "0",
  imagem_url: "",
  imagem_url_2: "",
  imagem_url_3: "",
  created_at: "",
  updated_at: "",
};

const mockVeiculos: Veiculo[] = [
  {
    ...baseVeiculo,
    id: 1,
    placa: "ABC1234",
    marca: "Fiat",
    modelo: "Uno",
    veiculo: "Fiat Uno",
    data: "2024-01-15",
    local: "São Paulo",
    cidade: "São Paulo",
    acessoria: "Assessoria X",
    status: "apreendido",
    valor: "15000.00",
    valor_servico: "15000.00",
    total: "15000.00",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    ...baseVeiculo,
    id: 2,
    placa: "XYZ5678",
    marca: "Honda",
    modelo: "Civic",
    veiculo: "Honda Civic",
    data: "2024-02-20",
    local: "Rio de Janeiro",
    cidade: "Rio de Janeiro",
    acessoria: "Assessoria Y",
    status: "liberado",
    valor: "30000.00",
    valor_servico: "30000.00",
    total: "45000.00",
    created_at: "2024-02-20T10:00:00Z",
    updated_at: "2024-02-20T10:00:00Z",
  },
];

describe("VeiculoTable", () => {
  it("shows loading state", () => {
    render(<VeiculoTable veiculos={[]} loading={true} onEdit={vi.fn()} onDelete={vi.fn()} />);
    // Loading skeleton rows are rendered instead of text
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<VeiculoTable veiculos={[]} loading={false} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Nenhum veículo encontrado")).toBeInTheDocument();
  });

  it("renders veiculos in table", () => {
    render(<VeiculoTable veiculos={mockVeiculos} loading={false} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("ABC1234")).toBeInTheDocument();
    expect(screen.getByText("XYZ5678")).toBeInTheDocument();
  });

  it("shows status badges", () => {
    render(<VeiculoTable veiculos={mockVeiculos} loading={false} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Apreendido")).toBeInTheDocument();
    expect(screen.getByText("Liberado")).toBeInTheDocument();
  });

  it("calls onEdit when row is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<VeiculoTable veiculos={mockVeiculos} loading={false} onEdit={onEdit} onDelete={vi.fn()} />);

    const rows = screen.getAllByRole("row");
    await user.click(rows[1]);
    expect(onEdit).toHaveBeenCalledWith(mockVeiculos[0]);
  });

  it("calls onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<VeiculoTable veiculos={mockVeiculos} loading={false} onEdit={vi.fn()} onDelete={onDelete} />);

    const deleteButtons = screen.getAllByTitle("Excluir");
    await user.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
