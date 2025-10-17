import axios from 'axios';
import { Curso, Voluntario, Aluno, Turma } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Serviços para Cursos
export const cursoService = {
  getAll: () => api.get<Curso[]>('/cursos'),
  getById: (id: number) => api.get<Curso>(`/cursos/${id}`),
  create: (data: Omit<Curso, 'id'>) => api.post<Curso>('/cursos', data),
  update: (id: number, data: Omit<Curso, 'id'>) => api.put<Curso>(`/cursos/${id}`, data),
  delete: (id: number) => api.delete(`/cursos/${id}`),
};

// Serviços para Voluntários
export const voluntarioService = {
  getAll: () => api.get<Voluntario[]>('/voluntarios'),
  getById: (id: number) => api.get<Voluntario>(`/voluntarios/${id}`),
  create: (data: Omit<Voluntario, 'id'>) => api.post<Voluntario>('/voluntarios', data),
  update: (id: number, data: Omit<Voluntario, 'id'>) => api.put<Voluntario>(`/voluntarios/${id}`, data),
  delete: (id: number) => api.delete(`/voluntarios/${id}`),
};

// Serviços para Alunos
export const alunoService = {
  getAll: () => api.get<Aluno[]>('/alunos'),
  getById: (id: number) => api.get<Aluno>(`/alunos/${id}`),
  create: (data: Omit<Aluno, 'id'>) => api.post<Aluno>('/alunos', data),
  update: (id: number, data: Omit<Aluno, 'id'>) => api.put<Aluno>(`/alunos/${id}`, data),
  delete: (id: number) => api.delete(`/alunos/${id}`),
  getByCurso: (cursoId: number) => api.get<Aluno[]>(`/cursos/${cursoId}/alunos`),
};

// Serviços para Turmas
export const turmaService = {
  getAll: () => api.get<Turma[]>('/turmas'),
  getById: (id: number) => api.get<Turma>(`/turmas/${id}`),
  create: (data: Omit<Turma, 'id'>) => api.post<Turma>('/turmas', data),
  update: (id: number, data: Omit<Turma, 'id'>) => api.put<Turma>(`/turmas/${id}`, data),
  delete: (id: number) => api.delete(`/turmas/${id}`),
};

export default api;

