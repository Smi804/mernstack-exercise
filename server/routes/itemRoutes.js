import express from 'express';
import { getItems, createItem, getItemBySubcatId, deleteItem, editItem} from '../controllers/itemController.js';
 
const router=express.Router();

router.get('/',getItems);
router.post('/',createItem);
router.get('/:subcat_id', getItemBySubcatId);
router.delete('/:id', deleteItem); 
router.put('/:id', editItem);

export default router;
