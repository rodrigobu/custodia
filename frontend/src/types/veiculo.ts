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
  imagens: string[];
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
  imagens?: string[];
}

export interface VeiculoUpdate {
  placa?: string;
  veiculo?: string;
  data?: string;
  local?: string;
  acessoria?: string;
  status?: Status;
  valor?: string;
  imagens?: string[];
}

export interface VeiculoFilters {
  placa?: string;
  status?: Status | "";
  acessoria?: string;
  local?: string;
}
