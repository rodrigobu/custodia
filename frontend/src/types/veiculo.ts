export type Status = "apreendido" | "liberado" | "em_processo";

export interface Veiculo {
  id: number;
  placa: string;
  veiculo: string;
  data: string;
  local: string;
  acessoria: string;
  status: Status;
  valor: string;
  total: string;
  imagem_url: string;
  created_at: string;
  updated_at: string;
}

export interface VeiculoCreate {
  placa: string;
  veiculo: string;
  data: string;
  local: string;
  acessoria: string;
  status: Status;
  valor: string;
  imagem_url?: string;
}

export interface VeiculoUpdate {
  placa?: string;
  veiculo?: string;
  data?: string;
  local?: string;
  acessoria?: string;
  status?: Status;
  valor?: string;
  imagem_url?: string;
}

export interface VeiculoFilters {
  placa?: string;
  status?: Status | "";
  acessoria?: string;
  local?: string;
}
