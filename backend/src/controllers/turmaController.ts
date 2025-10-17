import { Request, Response } from 'express';
import pool from '../config/database';
import { Turma } from '../types';

export const turmaController = {
  async getAll(req: Request, res: Response) {
    try {
      const result = await pool.query(`
        SELECT t.*, c.nome as curso_nome, v.nome as voluntario_nome,
               COALESCE(array_agg(ta.aluno_id) FILTER (WHERE ta.aluno_id IS NOT NULL), '{}') as alunos_ids
        FROM turmas t
        LEFT JOIN cursos c ON c.id = t.curso_id
        LEFT JOIN voluntarios v ON v.id = t.voluntario_id
        LEFT JOIN turma_alunos ta ON ta.turma_id = t.id
        GROUP BY t.id, c.nome, v.nome
        ORDER BY t.created_at DESC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao listar turmas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT t.*, c.nome as curso_nome, v.nome as voluntario_nome,
               COALESCE(array_agg(ta.aluno_id) FILTER (WHERE ta.aluno_id IS NOT NULL), '{}') as alunos_ids
        FROM turmas t
        LEFT JOIN cursos c ON c.id = t.curso_id
        LEFT JOIN voluntarios v ON v.id = t.voluntario_id
        LEFT JOIN turma_alunos ta ON ta.turma_id = t.id
        WHERE t.id = $1
        GROUP BY t.id, c.nome, v.nome
      `, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Turma não encontrada' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao buscar turma:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async create(req: Request, res: Response) {
    const client = await pool.connect();
    try {
      const { nome, curso_id, voluntario_id, data_inicio, data_fim, alunos_ids = [] }: Turma = req.body;

      if (!nome || !curso_id) {
        return res.status(400).json({ error: 'Nome e curso são obrigatórios' });
      }

      await client.query('BEGIN');

      const turmaResult = await client.query(
        `INSERT INTO turmas (nome, curso_id, voluntario_id, data_inicio, data_fim) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [nome, curso_id, voluntario_id || null, data_inicio || null, data_fim || null]
      );
      const turma = turmaResult.rows[0];

      if (alunos_ids && alunos_ids.length > 0) {
        const values = alunos_ids.map((alunoId, i) => `($1, $${i + 2})`).join(',');
        await client.query(
          `INSERT INTO turma_alunos (turma_id, aluno_id) VALUES ${values}`,
          [turma.id, ...alunos_ids]
        );
      }

      await client.query('COMMIT');
      res.status(201).json(turma);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao criar turma:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    } finally {
      client.release();
    }
  },

  async update(req: Request, res: Response) {
    const client = await pool.connect();
    try {
      const { id } = req.params;
      const { nome, curso_id, voluntario_id, data_inicio, data_fim, alunos_ids = [] }: Turma = req.body;

      await client.query('BEGIN');

      const result = await client.query(
        `UPDATE turmas SET nome=$1, curso_id=$2, voluntario_id=$3, data_inicio=$4, data_fim=$5, updated_at=CURRENT_TIMESTAMP
         WHERE id=$6 RETURNING *`,
        [nome, curso_id, voluntario_id || null, data_inicio || null, data_fim || null, id]
      );

      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Turma não encontrada' });
      }

      // Recriar vínculos de alunos
      await client.query('DELETE FROM turma_alunos WHERE turma_id = $1', [id]);
      if (alunos_ids && alunos_ids.length > 0) {
        const values = alunos_ids.map((alunoId, i) => `($1, $${i + 2})`).join(',');
        await client.query(
          `INSERT INTO turma_alunos (turma_id, aluno_id) VALUES ${values}`,
          [id, ...alunos_ids]
        );
      }

      await client.query('COMMIT');
      res.json(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao atualizar turma:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    } finally {
      client.release();
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM turmas WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Turma não encontrada' });
      }
      res.json({ message: 'Turma deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar turma:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
};


