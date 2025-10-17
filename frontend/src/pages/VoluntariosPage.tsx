import React, { useState, useEffect } from 'react';
import { Voluntario } from '../types';
import { voluntarioService } from '../services/api';
import VoluntarioForm from '../components/VoluntarioForm';
import DataTable from '../components/DataTable';

const VoluntariosPage: React.FC = () => {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVoluntario, setEditingVoluntario] = useState<Voluntario | undefined>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarVoluntarios();
  }, []);

  const carregarVoluntarios = async () => {
    try {
      setLoading(true);
      const response = await voluntarioService.getAll();
      setVoluntarios(response.data);
      setError(null);
    } catch (err: any) {
      setError('Erro ao carregar voluntários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (voluntario: Voluntario) => {
    setEditingVoluntario(voluntario);
    setShowForm(true);
  };

  const handleDelete = async (voluntario: Voluntario) => {
    if (!voluntario.id) return;
    
    if (window.confirm(`Tem certeza que deseja excluir o voluntário "${voluntario.nome}"?`)) {
      try {
        await voluntarioService.delete(voluntario.id);
        await carregarVoluntarios();
      } catch (err: any) {
        setError('Erro ao excluir voluntário');
        console.error(err);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingVoluntario(undefined);
    carregarVoluntarios();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingVoluntario(undefined);
  };

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'telefone', label: 'Telefone' },
    { 
      key: 'habilidades', 
      label: 'Habilidades',
      render: (value: string[]) => value && value.length > 0 ? value.join(', ') : '-'
    },
    { 
      key: 'disponibilidade', 
      label: 'Disponibilidade',
      render: (value: string) => value || '-'
    },
  ];

  if (showForm) {
    return (
      <VoluntarioForm
        voluntario={editingVoluntario}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerenciar Voluntários</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          + Novo Voluntário
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Carregando voluntários...</div>
      ) : (
        <DataTable
          columns={columns}
          data={voluntarios}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="Nenhum voluntário cadastrado. Clique em 'Novo Voluntário' para começar."
        />
      )}
    </div>
  );
};

export default VoluntariosPage;

