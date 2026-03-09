import type { Veiculo } from "../../types/veiculo";
import "./VeiculoTable.css";

interface VeiculoTableProps {
  veiculos: Veiculo[];
  loading: boolean;
  onEdit: (veiculo: Veiculo) => void;
  onDelete: (id: number) => void;
}

const STATUS_LABELS: Record<string, string> = {
  apreendido: "Apreendido",
  liberado: "Liberado",
  em_processo: "Em Processo",
};

export function VeiculoTable({ veiculos, loading, onEdit, onDelete }: VeiculoTableProps) {
  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (veiculos.length === 0) {
    return <div className="empty">Nenhum veículo encontrado.</div>;
  }

  return (
    <div className="table-container">
      <table className="veiculo-table">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Placa</th>
            <th>Veículo</th>
            <th>Data</th>
            <th>Local</th>
            <th>Assessoria</th>
            <th>Status</th>
            <th>Valor (R$)</th>
            <th>Total (R$)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {veiculos.map((v) => (
            <tr key={v.id}>
              <td>
                {v.imagens && v.imagens.length > 0 ? (
                  <img
                    src={v.imagens[0]}
                    alt={v.veiculo}
                    className="veiculo-thumbnail"
                  />
                ) : (
                  <span className="no-image">Sem foto</span>
                )}
              </td>
              <td>{v.placa}</td>
              <td>{v.veiculo}</td>
              <td>{new Date(v.data + "T00:00:00").toLocaleDateString("pt-BR")}</td>
              <td>{v.local}</td>
              <td>{v.acessoria}</td>
              <td>
                <span className={`status-badge status-${v.status}`}>
                  {STATUS_LABELS[v.status] || v.status}
                </span>
              </td>
              <td>{Number(v.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
              <td>{Number(v.total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
              <td>
                <div className="actions">
                  <button className="btn-edit" onClick={() => onEdit(v)}>Editar</button>
                  <button className="btn-delete" onClick={() => onDelete(v.id)}>Excluir</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
