import { Router } from 'express';
import { cursoController } from '../controllers/cursoController';
import { voluntarioController } from '../controllers/voluntarioController';
import { alunoController } from '../controllers/alunoController';
import { turmaController } from '../controllers/turmaController';

const router = Router();

// Rotas para cursos
router.get('/cursos', cursoController.getAll);
router.get('/cursos/:id', cursoController.getById);
router.post('/cursos', cursoController.create);
router.put('/cursos/:id', cursoController.update);
router.delete('/cursos/:id', cursoController.delete);

// Rotas para voluntários
router.get('/voluntarios', voluntarioController.getAll);
router.get('/voluntarios/:id', voluntarioController.getById);
router.post('/voluntarios', voluntarioController.create);
router.put('/voluntarios/:id', voluntarioController.update);
router.delete('/voluntarios/:id', voluntarioController.delete);

// Rotas para alunos
router.get('/alunos', alunoController.getAll);
router.get('/alunos/:id', alunoController.getById);
router.post('/alunos', alunoController.create);
router.put('/alunos/:id', alunoController.update);
router.delete('/alunos/:id', alunoController.delete);
router.get('/cursos/:cursoId/alunos', alunoController.getByCurso);

// Rotas para turmas
router.get('/turmas', turmaController.getAll);
router.get('/turmas/:id', turmaController.getById);
router.post('/turmas', turmaController.create);
router.put('/turmas/:id', turmaController.update);
router.delete('/turmas/:id', turmaController.delete);

export default router;

