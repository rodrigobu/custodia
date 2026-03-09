import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { VeiculoForm } from "../components/VeiculoForm";

describe("VeiculoForm", () => {
  it("renders the form with all fields", () => {
    render(<VeiculoForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText("Placa")).toBeInTheDocument();
    expect(screen.getByLabelText("Veículo")).toBeInTheDocument();
    expect(screen.getByLabelText("Data")).toBeInTheDocument();
    expect(screen.getByLabelText("Local")).toBeInTheDocument();
    expect(screen.getByLabelText("Assessoria")).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
    expect(screen.getByLabelText("Valor (R$)")).toBeInTheDocument();
  });

  it("shows 'Cadastrar' button for new entry", () => {
    render(<VeiculoForm onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Cadastrar" })).toBeInTheDocument();
  });

  it("shows 'Atualizar' button when editing", () => {
    const existing = {
      id: 1,
      placa: "ABC1234",
      veiculo: "Fiat Uno",
      data: "2024-01-01",
      local: "SP",
      acessoria: "Assessoria X",
      status: "apreendido" as const,
      valor: "10000.00",
      total: "10000.00",
      imagem_url: "",
      created_at: "",
      updated_at: "",
    };
    render(<VeiculoForm onSubmit={vi.fn()} initialData={existing} />);
    expect(screen.getByRole("button", { name: "Atualizar" })).toBeInTheDocument();
  });

  it("calls onSubmit with form data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<VeiculoForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Placa"), "XYZ1234");
    await user.type(screen.getByLabelText("Veículo"), "Honda Civic");
    await user.type(screen.getByLabelText("Local"), "São Paulo");
    await user.type(screen.getByLabelText("Assessoria"), "Assessoria A");
    await user.type(screen.getByLabelText("Valor (R$)"), "25000");

    await user.click(screen.getByRole("button", { name: "Cadastrar" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("shows error on submit failure", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(new Error("Placa duplicada"));
    render(<VeiculoForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Placa"), "XYZ1234");
    await user.type(screen.getByLabelText("Veículo"), "Test");
    await user.type(screen.getByLabelText("Local"), "SP");
    await user.type(screen.getByLabelText("Assessoria"), "A");
    await user.type(screen.getByLabelText("Valor (R$)"), "1000");

    await user.click(screen.getByRole("button", { name: "Cadastrar" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Placa duplicada");
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<VeiculoForm onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
