import express from 'express';

import { getCategories, createCategory,createOrGetCategory, deleteCategory, editCategory } from '../controllers/categoryController.js';

const router = express.Router();
router.get('/', getCategories);
router.post('/', createCategory);
router.post('/createOrGet', createOrGetCategory);
router.delete('/:id', deleteCategory);
router.put('/:id', editCategory);

export default router;