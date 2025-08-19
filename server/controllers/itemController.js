import Category from '../models/category.js';
import subCategory from '../models/subcategory.js';
import Item from '../models/item.js';

/* export const getItems = async (req, res) => {
    try {
        const items = await Item.find();
        if (items.length === 0) {
            return res.status(404).json({ message: 'No items found' });
        }
        res.status(200).json(items);
    }
    catch {
        res.status(500).json({ message: 'Error fetching items', error });
    }
}
 */


export const getItems = async (req, res) => {
  try {
    // fetch all items
    const items = await Item.find();
    if (items.length === 0) {
      return res.status(404).json({ message: "No items found" });
    }

    // fetch all categories & subcategories
    const categories = await Category.find();
    const subCategories = await subCategory.find();

    // build maps for fast lookup
    const catMap = {};
    categories.forEach(cat => {
      catMap[cat.code] = cat.name; // map code → name
    });

    const subCatMap = {};
    subCategories.forEach(subcat => {
      subCatMap[subcat.code] = subcat.name; // map code → name
    });

    // update items with cat_name & subcat_name
    const updatedItems = items.map(item => ({
      ...item._doc,
      cat_name: catMap[item.cat_id] || "Unknown",
      subcat_name: subCatMap[item.subcat_id] || "Unknown",
    }));

    res.status(200).json(updatedItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error: error.message });
  }
};

export const createItem = async (req, res) => {
  try {
    const { name, cat_id, subcat_id } = req.body; 

    
    const cat = await Category.findOne({ code: cat_id });
    if (!cat) return res.status(404).json({ message: "Category not found" });

    const subcat = await subCategory.findOne({ code: subcat_id });
    if (!subcat) return res.status(404).json({ message: "Subcategory not found" });
    if (subcat.cat_id.toString() !== cat_id) {
      return res.status(400).json({ message: "Category mismatch with Subcategory" });
    }
    
    const lastItem = await Item.findOne({ cat_id: cat_id, subcat_id: subcat_id })
      .sort({ createdAt: -1 });

    let nextNum = "0001";
    if (lastItem) {
      const lastNum = parseInt(lastItem.code.slice(-4));
      nextNum = (lastNum + 1).toString().padStart(4, "0");
    }

    const newCode = subcat.code + nextNum;

    // Create new item
    
     const newItem = new Item({
      name,
      cat_id,       
      subcat_id,  
      code: newCode
    });
  
  
    await newItem.save();
  
    res.status(201).json(newItem);

  } catch (err) {
    console.error("Item creation error:", err);
    res.status(500).json({ message: "Error creating item", error: err.message });
  }
};
export const getItemBySubcatId = async (req, res) => {
    const { subcat_id } = req.params;
    try {
        const items = await Item.find({ subcat_id });
        if (items.length === 0) {
            return res.status(404).json({ message: 'No items found for this subcategory' });
        }
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items by subcategory ID', error });
    }
}
