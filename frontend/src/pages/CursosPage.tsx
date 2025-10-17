import React, { useState, useEffect } from 'react';
import { Curso } from '../types';
import { cursoService } from '../services/api';
import CursoForm from '../components/CursoForm';
import DataTable from '../components/DataTable';

const CursosPage: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCurso, setEditingCurso] = useState<Curso | undefined>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarCursos();
  }, []);

  const carregarCursos = async () => {
    try {
      setLoading(true);
      const response = await cursoService.getAll();
      setCursos(response.data);
      setError(null);
    } catch (err: any) {
      setError('Erro ao carregar cursos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (curso: Curso) => {
    setEditingCurso(curso);
    setShowForm(true);
  };

  const handleDelete = async (curso: Curso) => {
    if (!curso.id) return;
    
    if (window.confirm(`Tem certeza que deseja excluir o curso "${curso.nome}"?`)) {
      try {
        await cursoService.delete(curso.id);
        await carregarCursos();
      } catch (err: any) {
        setError('Erro ao excluir curso');
        console.error(err);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCurso(undefined);
    carregarCursos();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCurso(undefined);
  };

  const columns = [
    { key: 'nome', label: 'Nome' },
    { 
      key: 'descricao', 
      label: 'Descrição',
      render: (value: string) => value ? (value.length > 50 ? `${value.substring(0, 50)}...` : value) : '-'
    },
    { 
      key: 'data_inicio', 
      label: 'Data Início',
      render: (value: string) => value ? new Date(value).toLocaleDateString('pt-BR') : '-'
    },
    { 
      key: 'data_fim', 
      label: 'Data Fim',
      render: (value: string) => value ? new Date(value).toLocaleDateString('pt-BR') : '-'
    },
    { 
      key: 'carga_horaria', 
      label: 'Carga Horária',
      render: (value: number) => value ? `${value}h` : '-'
    },
  ];

  if (showForm) {
    return (
      <CursoForm
        curso={editingCurso}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciar Cursos</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          + Novo Curso
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Carregando cursos...</div>
      ) : (
        <DataTable
          columns={columns}
          data={cursos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="Nenhum curso cadastrado. Clique em 'Novo Curso' para começar."
        />
      )}
    </div>
  );
};

export default CursosPage;

