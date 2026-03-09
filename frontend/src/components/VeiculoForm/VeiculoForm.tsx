import { useState } from "react";
import type { VeiculoCreate, Veiculo } from "../../types/veiculo";
import { ImageUpload } from "../ImageUpload";
import "./VeiculoForm.css";

interface VeiculoFormProps {
  onSubmit: (data: VeiculoCreate) => Promise<void>;
  initialData?: Veiculo | null;
  onCancel?: () => void;
}

const emptyForm: VeiculoCreate = {
  placa: "",
  veiculo: "",
  data: new Date().toISOString().split("T")[0],
  local: "",
  acessoria: "",
  status: "apreendido",
  valor: "",
  imagem_url: "",
  imagem_url_2: "",
  imagem_url_3: "",
};

export function VeiculoForm({ onSubmit, initialData, onCancel }: VeiculoFormProps) {
  const [form, setForm] = useState<VeiculoCreate>(
    initialData
      ? {
          placa: initialData.placa,
          veiculo: initialData.veiculo,
          data: initialData.data,
          local: initialData.local,
          acessoria: initialData.acessoria,
          status: initialData.status,
          valor: initialData.valor,
          imagem_url: initialData.imagem_url || "",
          imagem_url_2: initialData.imagem_url_2 || "",
          imagem_url_3: initialData.imagem_url_3 || "",
        }
      : emptyForm
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(form);
      if (!initialData) setForm(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="veiculo-form" onSubmit={handleSubmit}>
      <h2>{initialData ? "Editar Veículo" : "Cadastrar Veículo"}</h2>
      {error && <div className="form-error" role="alert">{error}</div>}

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="placa">Placa</label>
          <input
            id="placa"
            name="placa"
            value={form.placa}
            onChange={handleChange}
            placeholder="ABC1D23"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="veiculo">Veículo</label>
          <input
            id="veiculo"
            name="veiculo"
            value={form.veiculo}
            onChange={handleChange}
            placeholder="Marca/Modelo"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="data">Data</label>
          <input
            id="data"
            name="data"
            type="date"
            value={form.data}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="local">Local</label>
          <input
            id="local"
            name="local"
            value={form.local}
            onChange={handleChange}
            placeholder="Local da apreensão"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="acessoria">Assessoria</label>
          <input
            id="acessoria"
            name="acessoria"
            value={form.acessoria}
            onChange={handleChange}
            placeholder="Responsável"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={form.status} onChange={handleChange}>
            <option value="apreendido">Apreendido</option>
            <option value="liberado">Liberado</option>
            <option value="em_processo">Em Processo</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="valor">Valor (R$)</label>
          <input
            id="valor"
            name="valor"
            type="number"
            step="0.01"
            min="0"
            value={form.valor}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
        </div>
        <div className="form-group form-group-full">
          <label>Fotos do Veículo (opcional)</label>
          <div className="photos-grid">
            <div className="photo-slot">
              <span className="photo-label">Foto 1</span>
              <ImageUpload
                value={form.imagem_url || ""}
                onChange={(url) => setForm((prev) => ({ ...prev, imagem_url: url }))}
              />
            </div>
            <div className="photo-slot">
              <span className="photo-label">Foto 2</span>
              <ImageUpload
                value={form.imagem_url_2 || ""}
                onChange={(url) => setForm((prev) => ({ ...prev, imagem_url_2: url }))}
              />
            </div>
            <div className="photo-slot">
              <span className="photo-label">Foto 3</span>
              <ImageUpload
                value={form.imagem_url_3 || ""}
                onChange={(url) => setForm((prev) => ({ ...prev, imagem_url_3: url }))}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Salvando..." : initialData ? "Atualizar" : "Cadastrar"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
