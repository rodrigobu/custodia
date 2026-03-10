import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { VeiculoFilter } from "../components/VeiculoFilter";

describe("VeiculoFilter", () => {
  it("renders all filter fields", () => {
    render(<VeiculoFilter filters={{}} onFilterChange={vi.fn()} />);
    expect(screen.getByPlaceholderText("Buscar por placa...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Assessoria...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Cidade...")).toBeInTheDocument();
    expect(screen.getByText("Todos os status")).toBeInTheDocument();
  });

  it("calls onFilterChange when placa filter changes", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(<VeiculoFilter filters={{}} onFilterChange={onFilterChange} />);

    await user.type(screen.getByPlaceholderText("Buscar por placa..."), "A");
    expect(onFilterChange).toHaveBeenCalledWith({ placa: "A" });
  });

  it("calls onFilterChange when status filter changes", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(<VeiculoFilter filters={{}} onFilterChange={onFilterChange} />);

    await user.selectOptions(screen.getByDisplayValue("Todos os status"), "apreendido");
    expect(onFilterChange).toHaveBeenCalledWith({ status: "apreendido" });
  });

  it("clears all filters when clear button is clicked", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(
      <VeiculoFilter
        filters={{ placa: "ABC", status: "apreendido" }}
        onFilterChange={onFilterChange}
      />
    );

    await user.click(screen.getByText("Limpar"));
    expect(onFilterChange).toHaveBeenCalledWith({});
  });

  it("displays current filter values", () => {
    render(
      <VeiculoFilter
        filters={{ placa: "XYZ", acessoria: "Test" }}
        onFilterChange={vi.fn()}
      />
    );
    expect(screen.getByPlaceholderText("Buscar por placa...")).toHaveValue("XYZ");
    expect(screen.getByPlaceholderText("Assessoria...")).toHaveValue("Test");
  });
});
