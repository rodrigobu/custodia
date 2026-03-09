import type { VeiculoFilters } from "../../types/veiculo";
import "./VeiculoFilter.css";

interface VeiculoFilterProps {
  filters: VeiculoFilters;
  onFilterChange: (filters: VeiculoFilters) => void;
}

export function VeiculoFilter({ filters, onFilterChange }: VeiculoFilterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    onFilterChange({});
  };

  return (
    <div className="veiculo-filter">
      <h3>Filtros</h3>
      <div className="filter-grid">
        <input
          name="placa"
          placeholder="Buscar por placa..."
          value={filters.placa || ""}
          onChange={handleChange}
        />
        <select name="status" value={filters.status || ""} onChange={handleChange}>
          <option value="">Todos os status</option>
          <option value="apreendido">Apreendido</option>
          <option value="liberado">Liberado</option>
          <option value="em_processo">Em Processo</option>
        </select>
        <input
          name="acessoria"
          placeholder="Buscar por assessoria..."
          value={filters.acessoria || ""}
          onChange={handleChange}
        />
        <input
          name="local"
          placeholder="Buscar por local..."
          value={filters.local || ""}
          onChange={handleChange}
        />
        <button onClick={handleClear} className="btn-clear">Limpar</button>
      </div>
    </div>
  );
}
