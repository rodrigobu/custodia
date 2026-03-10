import type { Veiculo } from "../../types/veiculo";

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

const STATUS_COLORS: Record<string, string> = {
  apreendido: "bg-red-50 text-red-700 border-red-200",
  liberado: "bg-emerald-50 text-emerald-700 border-emerald-200",
  em_processo: "bg-amber-50 text-amber-700 border-amber-200",
};

function formatCurrency(value: string | number): string {
  return Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR");
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 10 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-gray-200" />
        </td>
      ))}
    </tr>
  );
}

export function VeiculoTable({
  veiculos,
  loading,
  onEdit,
  onDelete,
}: VeiculoTableProps) {
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-gray-200 bg-gray-50/80">
              {[
                "Foto",
                "Placa",
                "Marca",
                "Modelo",
                "Ano",
                "Assessoria",
                "Status",
                "Data Registro",
                "Cidade",
                "Valor Serviço",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (veiculos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <svg
          className="mb-4 h-12 w-12 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h1.5a1.5 1.5 0 011.5 1.5v1.5m-3-3V3.375A1.125 1.125 0 014.5 2.25h15A1.125 1.125 0 0120.625 3.375V14.25m-17.25 0h17.25"
          />
        </svg>
        <p className="text-sm font-medium text-gray-900">
          Nenhum veículo encontrado
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Adicione um novo registro ou ajuste os filtros de busca.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="sticky top-0 z-10 border-t border-gray-200 bg-gray-50/95 backdrop-blur-sm">
            <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
              Foto
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
              Placa
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
              Marca
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
              Modelo
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
              Ano
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
              Assessoria
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
              Data Registro
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
              Data Apreensão
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
              Cidade
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium tracking-wide text-gray-500 uppercase">
              Valor Serviço
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium tracking-wide text-gray-500 uppercase">
              Custo Operação
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium tracking-wide text-gray-500 uppercase">
              Valor Recebido
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
              Ano (Reg)
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
              Semana ISO
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
              Quem Executou
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
              Observações
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium tracking-wide text-gray-500 uppercase">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {veiculos.map((v) => {
            const primeiraFoto = v.imagem_url || v.imagem_url_2 || v.imagem_url_3 || "";
            return (
              <tr
                key={v.id}
                className="cursor-pointer transition-colors hover:bg-gray-50/80"
                onClick={() => onEdit(v)}
              >
                <td className="px-4 py-3">
                  {primeiraFoto ? (
                    <img
                      src={primeiraFoto}
                      alt={`${v.marca || v.veiculo || "Veículo"}`}
                      className="h-10 w-10 rounded-md border border-gray-200 bg-gray-50 object-cover shadow-sm"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                        />
                      </svg>
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-sm font-medium text-gray-900 uppercase">
                  {v.placa}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                  {v.marca || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                  {v.modelo || v.veiculo || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                  {v.ano || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                  {v.acessoria}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[v.status] || "bg-gray-50 text-gray-700 border-gray-200"}`}
                  >
                    {STATUS_LABELS[v.status] || v.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                  {formatDate(v.data)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                  {formatDate(v.data_apreensao)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                  {v.cidade || v.local || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-gray-900">
                  {formatCurrency(v.valor_servico || v.valor || 0)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-gray-900">
                  {formatCurrency(v.custo_operacao || 0)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-emerald-700">
                  {formatCurrency(v.valor_recebido || 0)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                  {v.ano_reg || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                  {v.semana_iso || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                  {v.quem_executou || "—"}
                </td>
                <td className="max-w-[200px] truncate px-4 py-3 text-gray-500">
                  {v.observacoes || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(v);
                      }}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      title="Editar"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(v.id);
                      }}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      title="Excluir"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
