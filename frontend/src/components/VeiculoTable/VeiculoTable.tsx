import { Fragment, useState } from "react";
import type { Veiculo } from "../../types/veiculo";
import { SkeletonTableRow } from "../Loading";

interface VeiculoTableProps {
  veiculos: Veiculo[];
  loading: boolean;
  onEdit: (veiculo: Veiculo) => void;
  onDelete: (id: number) => void;
}

const STATUS_LABELS: Record<string, string> = {
  apreendido: "Apreendido",
  em_busca: "Em busca",
  localizado: "Localizado",
};

const STATUS_COLORS: Record<string, string> = {
  apreendido:
    "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-500/20",
  em_busca:
    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-500/20",
  localizado:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-500/20",
};

const STATUS_DOT: Record<string, string> = {
  apreendido: "bg-red-500",
  em_busca: "bg-amber-500",
  localizado: "bg-emerald-500",
};

function formatCurrency(value: string | number): string {
  return Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "\u2014";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR");
}

// SkeletonRow is now provided by the Loading component as SkeletonTableRow

const thClasses =
  "px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400 bg-gray-50/80 dark:bg-[#111827]/90";

interface DetailRowProps {
  veiculo: Veiculo;
  onClose: () => void;
}

function DetailRow({ veiculo: v, onClose }: DetailRowProps) {
  return (
    <tr className="bg-gray-50/50 dark:bg-gray-800/30">
      <td colSpan={8} className="px-4 py-4">
        <div className="flex items-start justify-between">
          <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm sm:grid-cols-3 lg:grid-cols-4">
            <div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Data Apreensão</span>
              <p className="mt-0.5 text-gray-900 dark:text-gray-100">{formatDate(v.data_apreensao)}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Custo Operação</span>
              <p className="mt-0.5 font-mono text-gray-900 dark:text-gray-100">{formatCurrency(v.custo_operacao || 0)}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Valor Recebido</span>
              <p className="mt-0.5 font-mono text-emerald-700 dark:text-emerald-400">{formatCurrency(v.valor_recebido || 0)}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Quem Executou</span>
              <p className="mt-0.5 text-gray-900 dark:text-gray-100">{v.quem_executou || "\u2014"}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Ano (Reg)</span>
              <p className="mt-0.5 text-gray-900 dark:text-gray-100">{v.ano_reg || "\u2014"}</p>
            </div>
            {v.observacoes && (
              <div className="col-span-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Observações</span>
                <p className="mt-0.5 text-gray-900 dark:text-gray-100">{v.observacoes}</p>
              </div>
            )}
            {(v.imagem_url_2 || v.imagem_url_3) && (
              <div className="col-span-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Fotos adicionais</span>
                <div className="mt-1 flex gap-2">
                  {[v.imagem_url_2, v.imagem_url_3].filter(Boolean).map((url, i) => (
                    <img
                      key={i}
                      src={url!}
                      alt="Veículo"
                      className="h-16 w-16 rounded-lg border border-gray-200 object-cover dark:border-gray-600"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

export function VeiculoTable({
  veiculos,
  loading,
  onEdit,
  onDelete,
}: VeiculoTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-t border-gray-100 dark:border-gray-700/30">
              {["Veículo", "Placa", "Assessoria", "Status", "Data", "Cidade", "Valor Serviço", ""].map((h) => (
                <th key={h} className={thClasses}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonTableRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (veiculos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <svg
            className="h-7 w-7 text-gray-400 dark:text-gray-500"
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
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Nenhum veículo encontrado
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Adicione um novo registro ou ajuste os filtros de busca.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-t border-gray-100 dark:border-gray-700/30">
              <th className={thClasses}>Veículo</th>
              <th className={thClasses}>Placa</th>
              <th className={thClasses}>Assessoria</th>
              <th className={thClasses}>Status</th>
              <th className={thClasses}>Data</th>
              <th className={thClasses}>Cidade</th>
              <th className={`${thClasses} text-right`}>Valor Serviço</th>
              <th className={`${thClasses} text-right`} style={{ minWidth: '120px' }}>Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">
            {veiculos.map((v) => {
              const primeiraFoto = v.imagem_url || v.imagem_url_2 || v.imagem_url_3 || "";
              const isExpanded = expandedId === v.id;

              return (
                <Fragment key={v.id}>
                  <tr
                    className={`group cursor-pointer transition-colors ${
                      isExpanded
                        ? "bg-gray-50/50 dark:bg-gray-800/30"
                        : "hover:bg-gray-50/80 dark:hover:bg-gray-800/30"
                    }`}
                    onClick={() => setExpandedId(isExpanded ? null : v.id)}
                  >
                    {/* Vehicle info: photo + brand/model combined */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {primeiraFoto ? (
                          <img
                            src={primeiraFoto}
                            alt={`${v.marca || v.veiculo || "Veículo"}`}
                            className="h-9 w-9 rounded-lg border border-gray-200 bg-gray-50 object-cover dark:border-gray-600 dark:bg-gray-800"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                            {[v.marca, v.modelo].filter(Boolean).join(" ") || v.veiculo || "\u2014"}
                          </p>
                          {v.ano && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{v.ano}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-sm font-medium text-gray-900 uppercase dark:text-gray-100">
                      {v.placa}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">
                      {v.acessoria}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[v.status] || "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/10 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-500/20"}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[v.status] || "bg-gray-400"}`} />
                        {STATUS_LABELS[v.status] || v.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500 dark:text-gray-400">
                      {formatDate(v.data)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">
                      {v.cidade || v.local || "\u2014"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-gray-900 dark:text-gray-100">
                      {formatCurrency(v.valor_servico || v.valor || 0)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right" style={{ minWidth: '120px' }}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(v);
                          }}
                          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:text-gray-400 dark:hover:bg-primary-900/30 dark:hover:text-primary-400"
                          title="Editar"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(v.id);
                          }}
                          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                          title="Excluir"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedId(isExpanded ? null : v.id);
                          }}
                          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                          title={isExpanded ? "Recolher" : "Expandir"}
                        >
                          <svg className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <DetailRow
                      key={`detail-${v.id}`}
                      veiculo={v}
                      onClose={() => setExpandedId(null)}
                    />
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Table footer */}
      <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3 dark:border-gray-700/30">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Mostrando {veiculos.length} {veiculos.length === 1 ? "registro" : "registros"}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Clique em uma linha para ver detalhes
        </p>
      </div>
    </>
  );
}
