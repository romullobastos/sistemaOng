import { Request, Response } from 'express';
import pool from '../config/database';
import { Voluntario } from '../types';

export const voluntarioController = {
  // Listar todos os voluntários
  async getAll(req: Request, res: Response) {
    try {
      const result = await pool.query('SELECT * FROM voluntarios ORDER BY nome');
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar voluntários:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Buscar voluntário por ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM voluntarios WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Voluntário não encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao buscar voluntário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Criar novo voluntário
  async create(req: Request, res: Response) {
    try {
      const { nome, email, telefone, endereco, habilidades, disponibilidade }: Voluntario = req.body;
      
      if (!nome || !email) {
        return res.status(400).json({ error: 'Nome e email são obrigatórios' });
      }

      const result = await pool.query(
        'INSERT INTO voluntarios (nome, email, telefone, endereco, habilidades, disponibilidade) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [nome, email, telefone, endereco, habilidades, disponibilidade]
      );
      
      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      console.error('Erro ao criar voluntário:', error);
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Atualizar voluntário
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, email, telefone, endereco, habilidades, disponibilidade }: Voluntario = req.body;
      
      const result = await pool.query(
        'UPDATE voluntarios SET nome = $1, email = $2, telefone = $3, endereco = $4, habilidades = $5, disponibilidade = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
        [nome, email, telefone, endereco, habilidades, disponibilidade, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Voluntário não encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (error: any) {
      console.error('Erro ao atualizar voluntário:', error);
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Deletar voluntário
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM voluntarios WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Voluntário não encontrado' });
      }
      
      res.json({ message: 'Voluntário deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar voluntário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};
