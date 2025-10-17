import React, { useState } from 'react';
import AlunosPage from './pages/AlunosPage';
import CursosPage from './pages/CursosPage';
import VoluntariosPage from './pages/VoluntariosPage';
import TurmasPage from './pages/TurmasPage';
import './App.css';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('alunos');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'alunos':
        return <AlunosPage />;
      case 'cursos':
        return <CursosPage />;
      case 'voluntarios':
        return <VoluntariosPage />;
      case 'turmas':
        return <TurmasPage />;
      default:
        return <AlunosPage />;
    }
  };

  return (
    <div className="App">
      <header style={{ padding: '16px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: 12 }}>Sistema ONG</h1>
        <div style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => handleNavigate('alunos')}
            className="btn-primary"
            aria-pressed={currentPage === 'alunos'}
          >
            Alunos
          </button>
          <button
            onClick={() => handleNavigate('cursos')}
            className="btn-primary"
            aria-pressed={currentPage === 'cursos'}
          >
            Cursos
          </button>
          <button
            onClick={() => handleNavigate('voluntarios')}
            className="btn-primary"
            aria-pressed={currentPage === 'voluntarios'}
          >
            Voluntários
          </button>
          <button
            onClick={() => handleNavigate('turmas')}
            className="btn-primary"
            aria-pressed={currentPage === 'turmas'}
          >
            Turmas
          </button>
        </div>
      </header>
      <main className="main-content" style={{ padding: '16px' }}>
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default App;
