import express from 'express';
import { getItems, createItem, getItemBySubcatId } from '../controllers/itemController.js';
 
const router=express.Router();

router.get('/',getItems);
router.post('/',createItem);
router.get('/:subcat_id', getItemBySubcatId);

export default router;
