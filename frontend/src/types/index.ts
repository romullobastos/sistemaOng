export interface Curso {
  id?: number;
  nome: string;
  descricao?: string;
  data_inicio?: string;
  data_fim?: string;
  carga_horaria?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Voluntario {
  id?: number;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  habilidades?: string[];
  disponibilidade?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Aluno {
  id?: number;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  data_nascimento?: string;
  curso_id?: number;
  curso_nome?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Turma {
  id?: number;
  nome: string;
  curso_id: number;
  voluntario_id?: number;
  data_inicio?: string;
  data_fim?: string;
  alunos_ids?: number[];
  curso_nome?: string;
  voluntario_nome?: string;
}

