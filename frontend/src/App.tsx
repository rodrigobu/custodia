import { useState } from "react";
import { useVeiculos } from "./hooks/useVeiculos";
import { VeiculoForm } from "./components/VeiculoForm";
import { VeiculoTable } from "./components/VeiculoTable";
import { VeiculoFilter } from "./components/VeiculoFilter";
import type { Veiculo, VeiculoCreate } from "./types/veiculo";

function formatCurrency(value: string | number): string {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function App() {
  const {
    veiculos,
    loading,
    error,
    filters,
    setFilters,
    createVeiculo,
    updateVeiculo,
    deleteVeiculo,
  } = useVeiculos();
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const totalServico = veiculos.reduce(
    (sum, v) => sum + Number(v.valor_servico || 0),
    0
  );
  const totalCusto = veiculos.reduce(
    (sum, v) => sum + Number(v.custo_operacao || 0),
    0
  );
  const totalRecebido = veiculos.reduce(
    (sum, v) => sum + Number(v.valor_recebido || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Custódia
            </h1>
            <p className="text-sm text-gray-500">
              Gestão de Busca e Apreensão
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Novo Registro
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {error && (
          <div
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            role="alert"
          >
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {!showForm && veiculos.length > 0 && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Total Registros
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {veiculos.length}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Valor Serviço
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {formatCurrency(totalServico)}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Custo Operação
              </p>
              <p className="mt-1 text-2xl font-semibold text-red-600">
                {formatCurrency(totalCusto)}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Valor Recebido
              </p>
              <p className="mt-1 text-2xl font-semibold text-emerald-600">
                {formatCurrency(totalRecebido)}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <VeiculoForm
            onSubmit={handleSubmit}
            initialData={editing}
            onCancel={handleCancel}
          />
        )}

        {/* Records Section */}
        {!showForm && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Registros / Histórico
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  Todos os veículos registrados no sistema
                </p>
              </div>
              <div className="p-6 pt-4">
                <VeiculoFilter filters={filters} onFilterChange={setFilters} />
              </div>
              <VeiculoTable
                veiculos={veiculos}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
