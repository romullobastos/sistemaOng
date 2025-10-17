import React, { useEffect, useState } from 'react';
import { Turma, Curso, Voluntario, Aluno } from '../types';
import { turmaService, cursoService, voluntarioService, alunoService } from '../services/api';
import '../components/Form.css';

const TurmasPage: React.FC = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTurma, setEditingTurma] = useState<Turma | undefined>();
  const [alunoFiltro, setAlunoFiltro] = useState('');

  const [formData, setFormData] = useState<Omit<Turma, 'id'>>({
    nome: '',
    curso_id: 0,
    voluntario_id: undefined,
    data_inicio: '',
    data_fim: '',
    alunos_ids: [],
  });

  useEffect(() => {
    carregarTudo();
  }, []);

  useEffect(() => {
    if (editingTurma) {
      setFormData({
        nome: editingTurma.nome,
        curso_id: editingTurma.curso_id,
        voluntario_id: editingTurma.voluntario_id,
        data_inicio: editingTurma.data_inicio || '',
        data_fim: editingTurma.data_fim || '',
        alunos_ids: editingTurma.alunos_ids || [],
      });
    } else {
      setFormData({ nome: '', curso_id: 0, voluntario_id: undefined, data_inicio: '', data_fim: '', alunos_ids: [] });
    }
  }, [editingTurma]);

  const carregarTudo = async () => {
    try {
      setLoading(true);
      const [turmasRes, cursosRes, voluntariosRes, alunosRes] = await Promise.all([
        turmaService.getAll(),
        cursoService.getAll(),
        voluntarioService.getAll(),
        alunoService.getAll(),
      ]);
      setTurmas(turmasRes.data);
      setCursos(cursosRes.data);
      setVoluntarios(voluntariosRes.data);
      setAlunos(alunosRes.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.nome || !formData.curso_id) {
        setError('Nome e curso são obrigatórios');
        return;
      }
      if (editingTurma?.id) {
        await turmaService.update(editingTurma.id, formData);
      } else {
        await turmaService.create(formData);
      }
      setShowForm(false);
      setEditingTurma(undefined);
      await carregarTudo();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Erro ao salvar turma');
    }
  };

  const handleDelete = async (turma: Turma) => {
    if (!turma.id) return;
    if (!window.confirm(`Deseja excluir a turma "${turma.nome}"?`)) return;
    try {
      await turmaService.delete(turma.id);
      await carregarTudo();
    } catch (err) {
      console.error(err);
      setError('Erro ao excluir turma');
    }
  };

  const toggleAluno = (alunoId: number) => {
    setFormData(prev => {
      const set = new Set(prev.alunos_ids || []);
      if (set.has(alunoId)) set.delete(alunoId); else set.add(alunoId);
      return { ...prev, alunos_ids: Array.from(set) };
    });
  };

  if (showForm) {
    return (
      <div className="form-container">
        <h2 className="form-header">{editingTurma ? 'Editar Turma' : 'Nova Turma'}</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="nome">Nome *</label>
            <input id="nome" name="nome" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} required />
            <span className="input-help">Dê um nome claro para a turma (ex.: "Turma A - Manhã").</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Curso *</label>
              <select value={formData.curso_id} onChange={e => setFormData({ ...formData, curso_id: parseInt(e.target.value) })} required>
                <option value={0}>Selecione um curso</option>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
              <span className="input-help">Cada turma pertence a um único curso.</span>
            </div>
            <div className="form-group">
              <label>Voluntário (apenas um)</label>
              <select value={formData.voluntario_id || ''} onChange={e => setFormData({ ...formData, voluntario_id: e.target.value ? parseInt(e.target.value) : undefined })}>
                <option value="">Sem voluntário</option>
                {voluntarios.map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}
              </select>
              <span className="input-help">Opcional. Apenas um voluntário por turma.</span>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Início</label>
              <input type="date" value={formData.data_inicio || ''} onChange={e => setFormData({ ...formData, data_inicio: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Fim</label>
              <input type="date" value={formData.data_fim || ''} onChange={e => setFormData({ ...formData, data_fim: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label>Selecionar Alunos (múltiplos)</label>
            <input
              type="text"
              placeholder="Buscar por nome ou email"
              value={alunoFiltro}
              onChange={e => setAlunoFiltro(e.target.value)}
              className="search-input"
            />
            <div className="select-list">
              {alunos
                .filter(a => {
                  const q = alunoFiltro.trim().toLowerCase();
                  if (!q) return true;
                  const nome = (a.nome || '').toLowerCase();
                  const email = (a.email || '').toLowerCase();
                  return nome.includes(q) || email.includes(q);
                })
                .map(a => (
                <label key={a.id} className="select-list-item">
                  <input
                    type="checkbox"
                    checked={!!formData.alunos_ids?.includes(a.id!)}
                    onChange={() => toggleAluno(a.id!)}
                  />
                  <span>{a.nome} {a.email ? `- ${a.email}` : ''}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditingTurma(undefined); }}>
              <i className="bi bi-x-lg" style={{ marginRight: 8 }}></i>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              <i className="bi bi-save" style={{ marginRight: 8 }}></i>
              {editingTurma ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciar Turmas</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ Nova Turma</button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Carregando turmas...</div>
      ) : (
        <div className="data-table-container">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Curso</th>
                  <th>Voluntário</th>
                  <th>Alunos</th>
                  <th className="actions-column">Ações</th>
                </tr>
              </thead>
              <tbody>
                {turmas.map(t => (
                  <tr key={t.id}>
                    <td>{t.nome}</td>
                    <td>{t.curso_nome || t.curso_id}</td>
                    <td>{t.voluntario_nome || (t.voluntario_id ? t.voluntario_id : '—')}</td>
                    <td>{t.alunos_ids?.length || 0}</td>
                    <td className="actions-column">
                      <div className="action-buttons">
                        <button
                          onClick={() => { setEditingTurma(t); setShowForm(true); }}
                          className="btn-edit"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(t)}
                          className="btn-delete"
                          title="Excluir"
                          style={{ marginLeft: 8 }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurmasPage;


