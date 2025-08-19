import express from 'express';
import { getSubCategories, createSubCategory, getSubcatbyCatId} from '../controllers/subcatController.js';


const router = express.Router();

router.get('/', getSubCategories);
router.post('/', createSubCategory);
router.get('/:cat_id', getSubcatbyCatId);

export default router;