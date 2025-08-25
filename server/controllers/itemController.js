import Category from '../models/category.js';
import subCategory from '../models/subcategory.js';
import Item from '../models/item.js';




export const getItems = async (req, res) => {
  try {
    
    const items = await Item.find();
    if (items.length === 0) {
      return res.status(200).json({ message: "No items found"});
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
const capitalizeWords = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean) // removes extra spaces
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const createItem = async (req, res) => {
  try {
    const {  cat_id, subcat_id } = req.body; 
    let { name } = req.body;
    name = capitalizeWords(name);
    
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
      code: newCode,
      pcat_id: cat._id,
      pscat_id: subcat._id
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
export const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findById(id)
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    await Item.findByIdAndDelete(id);
    res.status(200).json({ message: 'Item deleted successfully' });
    
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error });
  }
}
export const editItem = async (req, res) => {
  try {
    const { id } = req.params; // item id
    let { name } = req.body;
    name = capitalizeWords(name);
    
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error editing item', error: error.message });
  }
}
