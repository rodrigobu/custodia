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

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accentColor: "blue" | "green" | "red" | "emerald";
}

function StatCard({ label, value, icon, accentColor }: StatCardProps) {
  const accents = {
    blue: "border-l-primary-500 dark:border-l-primary-400",
    green: "border-l-emerald-500 dark:border-l-emerald-400",
    red: "border-l-red-500 dark:border-l-red-400",
    emerald: "border-l-emerald-500 dark:border-l-emerald-400",
  };

  const iconBg = {
    blue: "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    red: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  };

  const valueColor = {
    blue: "text-gray-900 dark:text-gray-100",
    green: "text-gray-900 dark:text-gray-100",
    red: "text-red-600 dark:text-red-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
  };

  return (
    <div
      className={`rounded-xl border border-gray-200 border-l-4 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-700/50 dark:bg-[#1f2937] ${accents[accentColor]}`}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
            {label}
          </p>
          <p className={`mt-2 text-2xl font-semibold tracking-tight ${valueColor[accentColor]}`}>
            {value}
          </p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg[accentColor]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
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
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-lg transition-colors dark:border-gray-700/50 dark:bg-[#111827]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Custódia
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Gestão de Busca e Apreensão
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              title={dark ? "Modo claro" : "Modo escuro"}
            >
              {dark ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-[#111827]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
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
            className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400"
            role="alert"
          >
            <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Summary Cards */}
        {!showForm && veiculos.length > 0 && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Registros"
              value={String(veiculos.length)}
              accentColor="blue"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>
              }
            />
            <StatCard
              label="Valor Serviço"
              value={formatCurrency(totalServico)}
              accentColor="green"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              label="Custo Operação"
              value={formatCurrency(totalCusto)}
              accentColor="red"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
                </svg>
              }
            />
            <StatCard
              label="Valor Recebido"
              value={formatCurrency(totalRecebido)}
              accentColor="emerald"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              }
            />
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
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-gray-700/50 dark:bg-[#1f2937]">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700/50">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Registros
                  </h2>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                    {veiculos.length} {veiculos.length === 1 ? "veículo registrado" : "veículos registrados"}
                  </p>
                </div>
              </div>
              <div className="border-b border-gray-100 px-6 py-3 dark:border-gray-700/30">
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
