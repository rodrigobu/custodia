export type Status = "apreendido" | "liberado" | "em_processo";

export interface Veiculo {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  ano: number | null;
  veiculo: string;
  acessoria: string;
  status: Status;
  data: string;
  data_apreensao: string | null;
  cidade: string;
  local: string;
  valor_servico: string;
  custo_operacao: string;
  valor_recebido: string;
  observacoes: string;
  ano_reg: number | null;
  semana_iso: number | null;
  quem_executou: string;
  valor: string;
  total: string;
  imagem_url: string;
  imagem_url_2: string;
  imagem_url_3: string;
  created_at: string;
  updated_at: string;
}

export interface VeiculoCreate {
  placa: string;
  marca: string;
  modelo: string;
  ano: number | null;
  veiculo?: string;
  acessoria: string;
  status: Status;
  data: string;
  data_apreensao: string;
  cidade: string;
  local?: string;
  valor_servico: string;
  custo_operacao: string;
  valor_recebido: string;
  observacoes: string;
  ano_reg: number | null;
  semana_iso: number | null;
  quem_executou: string;
  valor?: string;
  imagem_url?: string;
  imagem_url_2?: string;
  imagem_url_3?: string;
}

export interface VeiculoUpdate {
  placa?: string;
  marca?: string;
  modelo?: string;
  ano?: number | null;
  veiculo?: string;
  acessoria?: string;
  status?: Status;
  data?: string;
  data_apreensao?: string | null;
  cidade?: string;
  local?: string;
  valor_servico?: string;
  custo_operacao?: string;
  valor_recebido?: string;
  observacoes?: string;
  ano_reg?: number | null;
  semana_iso?: number | null;
  quem_executou?: string;
  valor?: string;
  imagem_url?: string;
  imagem_url_2?: string;
  imagem_url_3?: string;
}

export interface VeiculoFilters {
  placa?: string;
  status?: Status | "";
  acessoria?: string;
  local?: string;
}

export interface VeiculoHistoryEntry {
  id: number;
  event_type: string;
  description: string;
  old_value: string;
  new_value: string;
  user: string;
  created_at: string;
}
