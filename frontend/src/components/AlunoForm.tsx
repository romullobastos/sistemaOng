import React, { useState, useEffect } from 'react';
import { Aluno, Curso } from '../types';
import { alunoService, cursoService } from '../services/api';
import './Form.css';

interface AlunoFormProps {
  aluno?: Aluno;
  onSuccess: () => void;
  onCancel: () => void;
}

const AlunoForm: React.FC<AlunoFormProps> = ({ aluno, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Aluno, 'id'>>({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    data_nascimento: '',
    curso_id: undefined,
  });
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarCursos();
    if (aluno) {
      setFormData({
        nome: aluno.nome || '',
        email: aluno.email || '',
        telefone: aluno.telefone || '',
        endereco: aluno.endereco || '',
        data_nascimento: aluno.data_nascimento || '',
        curso_id: aluno.curso_id,
      });
    }
  }, [aluno]);

  const carregarCursos = async () => {
    try {
      const response = await cursoService.getAll();
      setCursos(response.data);
    } catch (err) {
      console.error('Erro ao carregar cursos:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (aluno?.id) {
        await alunoService.update(aluno.id, formData);
      } else {
        await alunoService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar aluno');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'curso_id' ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  return (
    <div className="form-container">
      <h2>{aluno ? 'Editar Aluno' : 'Novo Aluno'}</h2>
      
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
            <label htmlFor="data_nascimento">Data de Nascimento</label>
            <input
              type="date"
              id="data_nascimento"
              name="data_nascimento"
              value={formData.data_nascimento}
              onChange={handleChange}
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
          <label htmlFor="curso_id">Curso</label>
          <select
            id="curso_id"
            name="curso_id"
            value={formData.curso_id || ''}
            onChange={handleChange}
          >
            <option value="">Selecione um curso (opcional)</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nome}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Salvando...' : (aluno ? 'Atualizar' : 'Salvar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AlunoForm;

