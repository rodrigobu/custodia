import { useState } from "react";
import { useVeiculos } from "./hooks/useVeiculos";
import { VeiculoForm } from "./components/VeiculoForm";
import { VeiculoTable } from "./components/VeiculoTable";
import { VeiculoFilter } from "./components/VeiculoFilter";
import type { Veiculo, VeiculoCreate } from "./types/veiculo";
import "./App.css";

export default function App() {
  const { veiculos, loading, error, filters, setFilters, createVeiculo, updateVeiculo, deleteVeiculo } =
    useVeiculos();
  const [editing, setEditing] = useState<Veiculo | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (data: VeiculoCreate) => {
    if (editing) {
      await updateVeiculo(editing.id, data);
      setEditing(null);
    } else {
      await createVeiculo(data);
    }
    setShowForm(false);
  };

  const handleEdit = (veiculo: Veiculo) => {
    setEditing(veiculo);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este veículo?")) {
      await deleteVeiculo(id);
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Custódia - Busca e Apreensão</h1>
        {!showForm && (
          <button className="btn-new" onClick={() => setShowForm(true)}>
            Novo Veículo
          </button>
        )}
      </header>

      <main className="app-main">
        {error && <div className="app-error" role="alert">{error}</div>}

        {showForm && (
          <VeiculoForm
            onSubmit={handleSubmit}
            initialData={editing}
            onCancel={handleCancel}
          />
        )}

        <VeiculoFilter filters={filters} onFilterChange={setFilters} />
        <VeiculoTable
          veiculos={veiculos}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}
