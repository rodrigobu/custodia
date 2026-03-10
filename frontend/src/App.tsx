import { useState, useEffect } from "react";
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

function useTheme() {
  const [dark, setDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
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
  const { dark, toggle: toggleTheme } = useTheme();

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
    <div className="min-h-screen bg-gray-50 transition-colors dark:bg-[#0f172a]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white transition-colors dark:border-gray-700/50 dark:bg-[#111827]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Custódia
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gestão de Busca e Apreensão
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              title={dark ? "Modo claro" : "Modo escuro"}
            >
              {dark ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                  />
                </svg>
              )}
            </button>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-[#111827]"
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
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {error && (
          <div
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400"
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
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-gray-700/50 dark:bg-[#1f2937]">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Registros
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {veiculos.length}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-gray-700/50 dark:bg-[#1f2937]">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Valor Serviço
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(totalServico)}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-gray-700/50 dark:bg-[#1f2937]">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Custo Operação
              </p>
              <p className="mt-1 text-2xl font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(totalCusto)}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-gray-700/50 dark:bg-[#1f2937]">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Valor Recebido
              </p>
              <p className="mt-1 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
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
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-gray-700/50 dark:bg-[#1f2937]">
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700/50">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Registros / Histórico
                </h2>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
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
