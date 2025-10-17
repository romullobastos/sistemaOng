import React, { useState, useEffect } from 'react';
import { Curso } from '../types';
import { cursoService } from '../services/api';
import './Form.css';

interface CursoFormProps {
  curso?: Curso;
  onSuccess: () => void;
  onCancel: () => void;
}

const CursoForm: React.FC<CursoFormProps> = ({ curso, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Curso, 'id'>>({
    nome: '',
    descricao: '',
    data_inicio: '',
    data_fim: '',
    carga_horaria: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (curso) {
      setFormData({
        nome: curso.nome || '',
        descricao: curso.descricao || '',
        data_inicio: curso.data_inicio || '',
        data_fim: curso.data_fim || '',
        carga_horaria: curso.carga_horaria || 0,
      });
    }
  }, [curso]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (curso?.id) {
        await cursoService.update(curso.id, formData);
      } else {
        await cursoService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar curso');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'carga_horaria' ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="form-container">
      <h2>{curso ? 'Editar Curso' : 'Novo Curso'}</h2>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="nome">Nome do Curso *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            placeholder="Digite o nome do curso"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Descreva o curso"
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="data_inicio">Data de Início</label>
            <input
              type="date"
              id="data_inicio"
              name="data_inicio"
              value={formData.data_inicio}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="data_fim">Data de Fim</label>
            <input
              type="date"
              id="data_fim"
              name="data_fim"
              value={formData.data_fim}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="carga_horaria">Carga Horária</label>
          <input
            type="number"
            id="carga_horaria"
            name="carga_horaria"
            value={formData.carga_horaria}
            onChange={handleChange}
            min="0"
            placeholder="Horas"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Salvando...' : (curso ? 'Atualizar' : 'Salvar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CursoForm;

