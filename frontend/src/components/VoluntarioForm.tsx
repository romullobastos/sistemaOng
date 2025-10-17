import React, { useState, useEffect } from 'react';
import { Voluntario } from '../types';
import { voluntarioService } from '../services/api';
import './Form.css';

interface VoluntarioFormProps {
  voluntario?: Voluntario;
  onSuccess: () => void;
  onCancel: () => void;
}

const VoluntarioForm: React.FC<VoluntarioFormProps> = ({ voluntario, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Voluntario, 'id'>>({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    habilidades: [],
    disponibilidade: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [novaHabilidade, setNovaHabilidade] = useState('');

  useEffect(() => {
    if (voluntario) {
      setFormData({
        nome: voluntario.nome || '',
        email: voluntario.email || '',
        telefone: voluntario.telefone || '',
        endereco: voluntario.endereco || '',
        habilidades: voluntario.habilidades || [],
        disponibilidade: voluntario.disponibilidade || '',
      });
    }
  }, [voluntario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (voluntario?.id) {
        await voluntarioService.update(voluntario.id, formData);
      } else {
        await voluntarioService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar voluntário');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const adicionarHabilidade = () => {
    if (novaHabilidade.trim() && !formData.habilidades?.includes(novaHabilidade.trim())) {
      setFormData(prev => ({
        ...prev,
        habilidades: [...(prev.habilidades || []), novaHabilidade.trim()],
      }));
      setNovaHabilidade('');
    }
  };

  const removerHabilidade = (habilidade: string) => {
    setFormData(prev => ({
      ...prev,
      habilidades: prev.habilidades?.filter(h => h !== habilidade) || [],
    }));
  };

  return (
    <div className="form-container">
      <h2>{voluntario ? 'Editar Voluntário' : 'Novo Voluntário'}</h2>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nome">Nome *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Digite o nome completo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="email@exemplo.com"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="telefone">Telefone</label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="form-group">
            <label htmlFor="disponibilidade">Disponibilidade</label>
            <input
              type="text"
              id="disponibilidade"
              name="disponibilidade"
              value={formData.disponibilidade}
              onChange={handleChange}
              placeholder="Ex: Segunda a sexta, manhã"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="endereco">Endereço</label>
          <textarea
            id="endereco"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            placeholder="Endereço completo"
            rows={2}
          />
        </div>

        <div className="form-group">
          <label>Habilidades</label>
          <div className="habilidades-container">
            <div className="habilidades-input">
              <input
                type="text"
                value={novaHabilidade}
                onChange={(e) => setNovaHabilidade(e.target.value)}
                placeholder="Digite uma habilidade"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarHabilidade())}
              />
              <button type="button" onClick={adicionarHabilidade} className="btn-small">
                Adicionar
              </button>
            </div>
            <div className="habilidades-list">
              {formData.habilidades?.map((habilidade, index) => (
                <span key={index} className="habilidade-tag">
                  {habilidade}
                  <button
                    type="button"
                    onClick={() => removerHabilidade(habilidade)}
                    className="remove-habilidade"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Salvando...' : (voluntario ? 'Atualizar' : 'Salvar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VoluntarioForm;

