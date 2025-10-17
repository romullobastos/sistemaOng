import { Request, Response } from 'express';
import pool from '../config/database';
import { Aluno } from '../types';

export const alunoController = {
  // Listar todos os alunos
  async getAll(req: Request, res: Response) {
    try {
      const result = await pool.query(`
        SELECT a.*, c.nome as curso_nome 
        FROM alunos a 
        LEFT JOIN cursos c ON a.curso_id = c.id 
        ORDER BY a.nome
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Buscar aluno por ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT a.*, c.nome as curso_nome 
        FROM alunos a 
        LEFT JOIN cursos c ON a.curso_id = c.id 
        WHERE a.id = $1
      `, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao buscar aluno:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Criar novo aluno
  async create(req: Request, res: Response) {
    try {
      const { nome, email, telefone, endereco, data_nascimento, curso_id }: Aluno = req.body;
      
      if (!nome || !email) {
        return res.status(400).json({ error: 'Nome e email são obrigatórios' });
      }

      // Verificar se o curso existe (se fornecido)
      if (curso_id) {
        const cursoResult = await pool.query('SELECT id FROM cursos WHERE id = $1', [curso_id]);
        if (cursoResult.rows.length === 0) {
          return res.status(400).json({ error: 'Curso não encontrado' });
        }
      }

      const result = await pool.query(
        'INSERT INTO alunos (nome, email, telefone, endereco, data_nascimento, curso_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [nome, email, telefone, endereco, data_nascimento, curso_id]
      );
      
      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      console.error('Erro ao criar aluno:', error);
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Atualizar aluno
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, email, telefone, endereco, data_nascimento, curso_id }: Aluno = req.body;
      
      // Verificar se o curso existe (se fornecido)
      if (curso_id) {
        const cursoResult = await pool.query('SELECT id FROM cursos WHERE id = $1', [curso_id]);
        if (cursoResult.rows.length === 0) {
          return res.status(400).json({ error: 'Curso não encontrado' });
        }
      }

      const result = await pool.query(
        'UPDATE alunos SET nome = $1, email = $2, telefone = $3, endereco = $4, data_nascimento = $5, curso_id = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
        [nome, email, telefone, endereco, data_nascimento, curso_id, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (error: any) {
      console.error('Erro ao atualizar aluno:', error);
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Deletar aluno
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM alunos WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      
      res.json({ message: 'Aluno deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Buscar alunos por curso
  async getByCurso(req: Request, res: Response) {
    try {
      const { cursoId } = req.params;
      const result = await pool.query(`
        SELECT a.*, c.nome as curso_nome 
        FROM alunos a 
        LEFT JOIN cursos c ON a.curso_id = c.id 
        WHERE a.curso_id = $1 
        ORDER BY a.nome
      `, [cursoId]);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar alunos por curso:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};
