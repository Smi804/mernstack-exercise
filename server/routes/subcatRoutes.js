import express from 'express';
import { getSubCategories, 
         createSubCategory,
         createOrGetSubcat, 
         getSubCategoriesByCatName, 
         deleteSubCategory,
         getFileredSubCategories } from '../controllers/subcatController.js';


const router = express.Router();

router.get('/', getSubCategories);
router.post('/', createSubCategory);
router.post('/createOrGet', createOrGetSubcat); 
router.get('/:categoryName', getSubCategoriesByCatName);
router.delete('/:id', deleteSubCategory);
router.get('/filter/:pcat_id', getFileredSubCategories);


export default router;