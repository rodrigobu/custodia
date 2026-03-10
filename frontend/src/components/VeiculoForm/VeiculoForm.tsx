import { useState, useEffect } from "react";
import type { VeiculoCreate, Veiculo, VeiculoHistoryEntry } from "../../types/veiculo";
import { veiculoService } from "../../services/veiculoService";
import { ImageUpload } from "../ImageUpload";

interface VeiculoFormProps {
  onSubmit: (data: VeiculoCreate) => Promise<void>;
  initialData?: Veiculo | null;
  onCancel?: () => void;
}

const emptyForm: VeiculoCreate = {
  placa: "",
  marca: "",
  modelo: "",
  ano: null,
  acessoria: "",
  status: "apreendido",
  data: new Date().toISOString().split("T")[0],
  data_apreensao: "",
  cidade: "",
  valor_servico: "",
  custo_operacao: "",
  valor_recebido: "",
  observacoes: "",
  ano_reg: null,
  semana_iso: null,
  quem_executou: "",
  imagem_url: "",
  imagem_url_2: "",
  imagem_url_3: "",
};

const STATUS_OPTIONS = [
  { value: "apreendido", label: "Apreendido" },
  { value: "liberado", label: "Liberado" },
  { value: "em_processo", label: "Em Processo" },
] as const;

const STATUS_COLORS: Record<string, string> = {
  apreendido: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-500/20",
  liberado: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-500/20",
  em_processo: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-500/20",
};

const STATUS_DOT: Record<string, string> = {
  apreendido: "bg-red-500",
  liberado: "bg-emerald-500",
  em_processo: "bg-amber-500",
};

const inputClasses =
  "block w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-[#374151] dark:bg-[#111827] dark:text-gray-100 dark:placeholder:text-gray-500 dark:hover:border-gray-500 dark:focus:border-primary-400 dark:focus:ring-primary-400/20";

const labelClasses = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

export function VeiculoForm({
  onSubmit,
  initialData,
  onCancel,
}: VeiculoFormProps) {
  const [form, setForm] = useState<VeiculoCreate>(
    initialData
      ? {
          placa: initialData.placa,
          marca: initialData.marca || "",
          modelo: initialData.modelo || "",
          ano: initialData.ano,
          acessoria: initialData.acessoria,
          status: initialData.status,
          data: initialData.data,
          data_apreensao: initialData.data_apreensao || "",
          cidade: initialData.cidade || initialData.local || "",
          valor_servico: initialData.valor_servico || initialData.valor || "",
          custo_operacao: initialData.custo_operacao || "",
          valor_recebido: initialData.valor_recebido || "",
          observacoes: initialData.observacoes || "",
          ano_reg: initialData.ano_reg,
          semana_iso: initialData.semana_iso,
          quem_executou: initialData.quem_executou || "",
          imagem_url: initialData.imagem_url || "",
          imagem_url_2: initialData.imagem_url_2 || "",
          imagem_url_3: initialData.imagem_url_3 || "",
        }
      : emptyForm
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<VeiculoHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (initialData?.id) {
      setHistoryLoading(true);
      veiculoService
        .getHistory(initialData.id)
        .then(setHistory)
        .catch(() => setHistory([]))
        .finally(() => setHistoryLoading(false));
    }
  }, [initialData?.id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "number" ? (value === "" ? null : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload: VeiculoCreate = {
        ...form,
        veiculo: `${form.marca} ${form.modelo}`.trim(),
        local: form.cidade,
        valor: form.valor_servico || "0",
      };
      await onSubmit(payload);
      if (!initialData) setForm(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {initialData ? "Editar Registro" : "Novo Registro"}
          </h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {initialData
              ? "Atualize as informações do veículo e custos"
              : "Preencha os dados do veículo e informações de custos"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-[#0f172a]"
          >
            {submitting ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Salvando...
              </>
            ) : initialData ? (
              "Atualizar"
            ) : (
              "Cadastrar"
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400"
          role="alert"
        >
          <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Section 1: Veiculo */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-gray-700/50 dark:bg-[#1f2937]">
        <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-700/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
              <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h1.5a1.5 1.5 0 011.5 1.5v1.5m-3-3V3.375A1.125 1.125 0 014.5 2.25h15A1.125 1.125 0 0120.625 3.375V14.25m-17.25 0h17.25" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Veículo</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Identificação do veículo
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="placa" className={labelClasses}>Placa</label>
              <input
                id="placa"
                name="placa"
                value={form.placa}
                onChange={handleChange}
                placeholder="ABC1D23"
                required
                className={`${inputClasses} uppercase`}
                maxLength={10}
              />
            </div>
            <div>
              <label htmlFor="marca" className={labelClasses}>Marca / Montadora</label>
              <input
                id="marca"
                name="marca"
                value={form.marca}
                onChange={handleChange}
                placeholder="Toyota, VW, Fiat..."
                className={inputClasses}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="modelo" className={labelClasses}>Modelo</label>
              <input
                id="modelo"
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                placeholder="Corolla, Gol, Uno..."
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="ano" className={labelClasses}>Ano</label>
              <input
                id="ano"
                name="ano"
                type="number"
                value={form.ano ?? ""}
                onChange={handleChange}
                placeholder="2024"
                min="1900"
                max="2099"
                className={inputClasses}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Custos / Gastos */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-gray-700/50 dark:bg-[#1f2937]">
        <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-700/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
              <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Custos / Gastos</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Dados operacionais e financeiros do processo
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {/* Row 1: Assessoria | Status | Cidade */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="acessoria" className={labelClasses}>Assessoria</label>
              <input
                id="acessoria"
                name="acessoria"
                value={form.acessoria}
                onChange={handleChange}
                placeholder="Responsável"
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="status" className={labelClasses}>Status</label>
              <div className="relative">
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={inputClasses + " appearance-none pr-10"}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
              <div className="mt-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[form.status]}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[form.status]}`} />
                  {STATUS_OPTIONS.find((o) => o.value === form.status)?.label}
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="cidade" className={labelClasses}>Cidade</label>
              <input
                id="cidade"
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
                placeholder="Local da apreensão"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Row 2: Data Registro | Data Apreensão | Quem Executou */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="data" className={labelClasses}>Data Registro</label>
              <input
                id="data"
                name="data"
                type="date"
                value={form.data}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="data_apreensao" className={labelClasses}>Data Apreensão</label>
              <input
                id="data_apreensao"
                name="data_apreensao"
                type="date"
                value={form.data_apreensao}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="quem_executou" className={labelClasses}>Quem Executou</label>
              <input
                id="quem_executou"
                name="quem_executou"
                value={form.quem_executou}
                onChange={handleChange}
                placeholder="Nome do responsável"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Row 3: Valor Serviço | Custo Operação | Valor Recebido */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="valor_servico" className={labelClasses}>Valor Serviço (R$)</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500">R$</span>
                <input
                  id="valor_servico"
                  name="valor_servico"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.valor_servico}
                  onChange={handleChange}
                  placeholder="0,00"
                  className={`${inputClasses} pl-10 text-right`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="custo_operacao" className={labelClasses}>Custo Operação (R$)</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500">R$</span>
                <input
                  id="custo_operacao"
                  name="custo_operacao"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.custo_operacao}
                  onChange={handleChange}
                  placeholder="0,00"
                  className={`${inputClasses} pl-10 text-right`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="valor_recebido" className={labelClasses}>Valor Recebido (R$)</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500">R$</span>
                <input
                  id="valor_recebido"
                  name="valor_recebido"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.valor_recebido}
                  onChange={handleChange}
                  placeholder="0,00"
                  className={`${inputClasses} pl-10 text-right`}
                />
              </div>
            </div>
          </div>

          {/* Row 4: Ano (Reg) | Semana ISO (Reg) */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="ano_reg" className={labelClasses}>Ano (Reg)</label>
              <input
                id="ano_reg"
                name="ano_reg"
                type="number"
                value={form.ano_reg ?? ""}
                onChange={handleChange}
                placeholder="2024"
                min="2000"
                max="2099"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="semana_iso" className={labelClasses}>Semana ISO (Reg)</label>
              <input
                id="semana_iso"
                name="semana_iso"
                type="number"
                value={form.semana_iso ?? ""}
                onChange={handleChange}
                placeholder="1-53"
                min="1"
                max="53"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Row 5: Observações (full width) */}
          <div>
            <label htmlFor="observacoes" className={labelClasses}>Observações</label>
            <textarea
              id="observacoes"
              name="observacoes"
              value={form.observacoes}
              onChange={handleChange}
              placeholder="Informações adicionais sobre o processo..."
              rows={3}
              className={`${inputClasses} resize-y`}
            />
          </div>
        </div>
      </div>

      {/* Section 3: Fotos do Veiculo */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-gray-700/50 dark:bg-[#1f2937]">
        <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-700/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
              <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Fotos do Veículo</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Até 3 fotos do veículo (opcional)
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Foto 1</p>
              <ImageUpload
                value={form.imagem_url || ""}
                onChange={(url) => setForm((prev) => ({ ...prev, imagem_url: url }))}
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Foto 2</p>
              <ImageUpload
                value={form.imagem_url_2 || ""}
                onChange={(url) => setForm((prev) => ({ ...prev, imagem_url_2: url }))}
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Foto 3</p>
              <ImageUpload
                value={form.imagem_url_3 || ""}
                onChange={(url) => setForm((prev) => ({ ...prev, imagem_url_3: url }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Registros / Historico */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-gray-700/50 dark:bg-[#1f2937]">
        <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-700/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
              <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Registros / Histórico</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Histórico de alterações e registros do veículo
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {historyLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Carregando histórico...
            </p>
          ) : history.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nenhum registro de histórico disponível.
            </p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-700/50 dark:bg-gray-800/50"
                >
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                    entry.event_type === "VEHICLE_CREATED"
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
                      : entry.event_type === "STATUS_CHANGED"
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"
                        : entry.event_type === "COST_CHANGED"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                          : entry.event_type === "PHOTO_ADDED" || entry.event_type === "PHOTO_REMOVED"
                            ? "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}>
                    {entry.event_type === "VEHICLE_CREATED" ? "+" :
                     entry.event_type === "STATUS_CHANGED" ? "S" :
                     entry.event_type === "COST_CHANGED" ? "$" :
                     entry.event_type === "PHOTO_ADDED" || entry.event_type === "PHOTO_REMOVED" ? "F" : "D"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {entry.description}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        {new Date(entry.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {entry.user && <span>por {entry.user}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
