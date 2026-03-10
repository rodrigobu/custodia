import type { VeiculoFilters } from "../../types/veiculo";

interface VeiculoFilterProps {
  filters: VeiculoFilters;
  onFilterChange: (filters: VeiculoFilters) => void;
}

const inputClasses =
  "block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-[#374151] dark:bg-[#111827] dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-primary-400 dark:focus:ring-primary-400/20";

export function VeiculoFilter({ filters, onFilterChange }: VeiculoFilterProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    onFilterChange({});
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label
          htmlFor="filter-placa"
          className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
        >
          Placa
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            id="filter-placa"
            name="placa"
            placeholder="Buscar por placa..."
            value={filters.placa || ""}
            onChange={handleChange}
            className={`${inputClasses} pl-9`}
          />
        </div>
      </div>
      <div className="flex-1">
        <label
          htmlFor="filter-status"
          className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
        >
          Status
        </label>
        <div className="relative">
          <select
            id="filter-status"
            name="status"
            value={filters.status || ""}
            onChange={handleChange}
            className={`${inputClasses} appearance-none pr-10`}
          >
            <option value="">Todos os status</option>
            <option value="apreendido">Apreendido</option>
            <option value="liberado">Liberado</option>
            <option value="em_processo">Em Processo</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-4 w-4 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <label
          htmlFor="filter-acessoria"
          className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
        >
          Assessoria
        </label>
        <input
          id="filter-acessoria"
          name="acessoria"
          placeholder="Buscar por assessoria..."
          value={filters.acessoria || ""}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>
      <div className="flex-1">
        <label
          htmlFor="filter-local"
          className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
        >
          Local
        </label>
        <input
          id="filter-local"
          name="local"
          placeholder="Buscar por local..."
          value={filters.local || ""}
          onChange={handleChange}
          className={inputClasses}
        />
      </div>
      {hasFilters && (
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Limpar
        </button>
      )}
    </div>
  );
}
