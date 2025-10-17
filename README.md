# Sistema ONG - Gestão de Alunos, Cursos e Voluntários

Sistema completo desenvolvido em TypeScript, React e PostgreSQL para gerenciar alunos, cursos e voluntários de uma ONG.

## 🚀 Funcionalidades

- **Cadastro de Cursos**: Crie e gerencie cursos com informações como nome, descrição, datas e carga horária
- **Cadastro de Voluntários**: Gerencie voluntários com habilidades e disponibilidade
- **Cadastro de Alunos**: Cadastre alunos e vincule-os a cursos específicos
- **Interface Responsiva**: Design moderno e responsivo para desktop e mobile
- **Navegação Intuitiva**: Menu dropdown para fácil navegação entre seções

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** com **TypeScript**
- **Express.js** para API REST
- **PostgreSQL** como banco de dados
- **pg** (node-postgres) para conexão com banco
- **CORS** e **Helmet** para segurança

### Frontend
- **React 18** com **TypeScript**
- **Axios** para requisições HTTP
- **CSS3** para estilização responsiva

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- PostgreSQL (versão 12 ou superior)
- npm ou yarn

## 🚀 Como Executar

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd sistema-ong
```

### 2. Instale as dependências
```bash
npm run install-all
```

### 3. Configure o banco de dados PostgreSQL

Crie um banco de dados chamado `sistema_ong`:
```sql
CREATE DATABASE sistema_ong;
```

### 4. Configure as variáveis de ambiente

Copie o arquivo de exemplo e configure suas credenciais:
```bash
cd backend
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sistema_ong
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
PORT=3001
```

### 5. Execute o projeto

Para executar tanto o backend quanto o frontend simultaneamente:
```bash
npm run dev
```

Ou execute separadamente:

**Backend:**
```bash
npm run server
```

**Frontend:**
```bash
npm run client
```

### 6. Acesse a aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📁 Estrutura do Projeto

```
sistema-ong/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── initDatabase.ts
│   │   ├── controllers/
│   │   │   ├── alunoController.ts
│   │   │   ├── cursoController.ts
│   │   │   └── voluntarioController.ts
│   │   ├── routes/
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlunoForm.tsx
│   │   │   ├── CursoForm.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── VoluntarioForm.tsx
│   │   ├── pages/
│   │   │   ├── AlunosPage.tsx
│   │   │   ├── CursosPage.tsx
│   │   │   └── VoluntariosPage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   └── package.json
├── package.json
└── README.md
```

## 🗄️ Schema do Banco de Dados

### Tabela: cursos
- `id` (SERIAL PRIMARY KEY)
- `nome` (VARCHAR(255) NOT NULL)
- `descricao` (TEXT)
- `data_inicio` (DATE)
- `data_fim` (DATE)
- `carga_horaria` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabela: voluntarios
- `id` (SERIAL PRIMARY KEY)
- `nome` (VARCHAR(255) NOT NULL)
- `email` (VARCHAR(255) UNIQUE NOT NULL)
- `telefone` (VARCHAR(20))
- `endereco` (TEXT)
- `habilidades` (TEXT[])
- `disponibilidade` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabela: alunos
- `id` (SERIAL PRIMARY KEY)
- `nome` (VARCHAR(255) NOT NULL)
- `email` (VARCHAR(255) UNIQUE NOT NULL)
- `telefone` (VARCHAR(20))
- `endereco` (TEXT)
- `data_nascimento` (DATE)
- `curso_id` (INTEGER REFERENCES cursos(id))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🔧 API Endpoints

### Cursos
- `GET /api/cursos` - Listar todos os cursos
- `GET /api/cursos/:id` - Buscar curso por ID
- `POST /api/cursos` - Criar novo curso
- `PUT /api/cursos/:id` - Atualizar curso
- `DELETE /api/cursos/:id` - Deletar curso

### Voluntários
- `GET /api/voluntarios` - Listar todos os voluntários
- `GET /api/voluntarios/:id` - Buscar voluntário por ID
- `POST /api/voluntarios` - Criar novo voluntário
- `PUT /api/voluntarios/:id` - Atualizar voluntário
- `DELETE /api/voluntarios/:id` - Deletar voluntário

### Alunos
- `GET /api/alunos` - Listar todos os alunos
- `GET /api/alunos/:id` - Buscar aluno por ID
- `POST /api/alunos` - Criar novo aluno
- `PUT /api/alunos/:id` - Atualizar aluno
- `DELETE /api/alunos/:id` - Deletar aluno
- `GET /api/cursos/:cursoId/alunos` - Listar alunos de um curso

## 🎨 Funcionalidades da Interface

- **Menu Dropdown Responsivo**: Navegação fácil entre as seções
- **Formulários Intuitivos**: Validação em tempo real e feedback visual
- **Tabelas de Dados**: Exibição organizada com ações de editar e excluir
- **Design Responsivo**: Funciona perfeitamente em desktop e mobile
- **Tratamento de Erros**: Mensagens claras para o usuário
- **Confirmações**: Diálogos de confirmação para ações destrutivas

## 🔒 Segurança

- Validação de dados no backend e frontend
- Sanitização de inputs
- Headers de segurança com Helmet
- CORS configurado adequadamente
- Validação de tipos com TypeScript

## 📱 Responsividade

O sistema foi desenvolvido com foco na responsividade:
- Layout adaptativo para diferentes tamanhos de tela
- Menu mobile-friendly
- Formulários otimizados para touch
- Tabelas com scroll horizontal em telas pequenas

## 🚀 Deploy

Para fazer deploy em produção:

1. Configure as variáveis de ambiente de produção
2. Execute `npm run build` no frontend
3. Configure um servidor web (nginx, apache) para servir os arquivos estáticos
4. Configure um processo manager (PM2) para o backend
5. Configure SSL/HTTPS para segurança

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

