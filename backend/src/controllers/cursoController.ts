import { Request, Response } from 'express';
import pool from '../config/database';
import { Curso } from '../types';

export const cursoController = {
  // Listar todos os cursos
  async getAll(req: Request, res: Response) {
    try {
      const result = await pool.query('SELECT * FROM cursos ORDER BY nome');
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Buscar curso por ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM cursos WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Curso não encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao buscar curso:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Criar novo curso
  async create(req: Request, res: Response) {
    try {
      const { nome, descricao, data_inicio, data_fim, carga_horaria }: Curso = req.body;
      
      if (!nome) {
        return res.status(400).json({ error: 'Nome do curso é obrigatório' });
      }

      const result = await pool.query(
        'INSERT INTO cursos (nome, descricao, data_inicio, data_fim, carga_horaria) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nome, descricao, data_inicio, data_fim, carga_horaria]
      );
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Atualizar curso
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, descricao, data_inicio, data_fim, carga_horaria }: Curso = req.body;
      
      const result = await pool.query(
        'UPDATE cursos SET nome = $1, descricao = $2, data_inicio = $3, data_fim = $4, carga_horaria = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
        [nome, descricao, data_inicio, data_fim, carga_horaria, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Curso não encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Deletar curso
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM cursos WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Curso não encontrado' });
      }
      
      res.json({ message: 'Curso deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar curso:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

