import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { VeiculoTable } from "../components/VeiculoTable";
import type { Veiculo } from "../types/veiculo";

const mockVeiculos: Veiculo[] = [
  {
    id: 1,
    placa: "ABC1234",
    veiculo: "Fiat Uno",
    data: "2024-01-15",
    local: "São Paulo",
    acessoria: "Assessoria X",
    status: "apreendido",
    valor: "15000.00",
    total: "15000.00",
    imagem_url: "",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    placa: "XYZ5678",
    veiculo: "Honda Civic",
    data: "2024-02-20",
    local: "Rio de Janeiro",
    acessoria: "Assessoria Y",
    status: "liberado",
    valor: "30000.00",
    total: "45000.00",
    imagem_url: "",
    created_at: "2024-02-20T10:00:00Z",
    updated_at: "2024-02-20T10:00:00Z",
  },
];

describe("VeiculoTable", () => {
  it("shows loading state", () => {
    render(<VeiculoTable veiculos={[]} loading={true} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<VeiculoTable veiculos={[]} loading={false} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Nenhum veículo encontrado.")).toBeInTheDocument();
  });

  it("renders veiculos in table", () => {
    render(<VeiculoTable veiculos={mockVeiculos} loading={false} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("ABC1234")).toBeInTheDocument();
    expect(screen.getByText("XYZ5678")).toBeInTheDocument();
    expect(screen.getByText("Fiat Uno")).toBeInTheDocument();
    expect(screen.getByText("Honda Civic")).toBeInTheDocument();
  });

  it("shows status badges", () => {
    render(<VeiculoTable veiculos={mockVeiculos} loading={false} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Apreendido")).toBeInTheDocument();
    expect(screen.getByText("Liberado")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<VeiculoTable veiculos={mockVeiculos} loading={false} onEdit={onEdit} onDelete={vi.fn()} />);

    const editButtons = screen.getAllByText("Editar");
    await user.click(editButtons[0]);
    expect(onEdit).toHaveBeenCalledWith(mockVeiculos[0]);
  });

  it("calls onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<VeiculoTable veiculos={mockVeiculos} loading={false} onEdit={vi.fn()} onDelete={onDelete} />);

    const deleteButtons = screen.getAllByText("Excluir");
    await user.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
