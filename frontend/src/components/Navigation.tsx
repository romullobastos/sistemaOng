import React, { useState } from 'react';
import './Navigation.css';

interface NavigationProps {
  onNavigate: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { key: 'alunos', label: 'Cadastro de Alunos' },
    { key: 'cursos', label: 'Cadastro de Cursos' },
    { key: 'voluntarios', label: 'Cadastro de Voluntários' },
  ];

  const handleItemClick = (itemKey: string) => {
    onNavigate(itemKey);
    setIsOpen(false);
  };

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h1>Sistema ONG</h1>
        <button 
          className="dropdown-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          ☰ Menu
        </button>
      </div>
      
      <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
        {menuItems.map((item) => (
          <button
            key={item.key}
            className="dropdown-item"
            onClick={() => handleItemClick(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;

