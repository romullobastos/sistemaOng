import React, { useState, useEffect } from 'react';
import { Aluno } from '../types';
import { alunoService } from '../services/api';
import AlunoForm from '../components/AlunoForm';
import DataTable from '../components/DataTable';

const AlunosPage: React.FC = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | undefined>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    try {
      setLoading(true);
      const response = await alunoService.getAll();
      setAlunos(response.data);
      setError(null);
    } catch (err: any) {
      setError('Erro ao carregar alunos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (aluno: Aluno) => {
    setEditingAluno(aluno);
    setShowForm(true);
  };

  const handleDelete = async (aluno: Aluno) => {
    if (!aluno.id) return;
    
    if (window.confirm(`Tem certeza que deseja excluir o aluno "${aluno.nome}"?`)) {
      try {
        await alunoService.delete(aluno.id);
        await carregarAlunos();
      } catch (err: any) {
        setError('Erro ao excluir aluno');
        console.error(err);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingAluno(undefined);
    carregarAlunos();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingAluno(undefined);
  };

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'telefone', label: 'Telefone' },
    { 
      key: 'data_nascimento', 
      label: 'Data Nascimento',
      render: (value: string) => value ? new Date(value).toLocaleDateString('pt-BR') : '-'
    },
    { 
      key: 'curso_nome', 
      label: 'Curso',
      render: (value: string) => value || 'Não vinculado'
    },
  ];

  if (showForm) {
    return (
      <AlunoForm
        aluno={editingAluno}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciar Alunos</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          + Novo Aluno
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Carregando alunos...</div>
      ) : (
        <DataTable
          columns={columns}
          data={alunos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="Nenhum aluno cadastrado. Clique em 'Novo Aluno' para começar."
        />
      )}
    </div>
  );
};

export default AlunosPage;

