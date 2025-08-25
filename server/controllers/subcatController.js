
import Category from '../models/category.js';
import subCategory from '../models/subcategory.js';
import Item from '../models/item.js';

export const getSubCategories = async (req, res) => {
    try {
        const subCategories = await subCategory.find();
        const categories = await Category.find();
        const catMap = {};
        categories.forEach(cat => {
            catMap[cat.code] = cat.name;

        });
        const updatedSubCats = subCategories.map(subcat => ({
            ...subcat._doc, cat_name: catMap[subcat.cat_id] || "Unknown"
        })
        );
        res.json(updatedSubCats);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching subcategories", error: error.message });
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

export const createSubCategory = async (req, res) => {
    try {
        let { name, cat_id } = req.body;
        name = capitalizeWords(name);
        const category = await Category.findOne({ code: cat_id });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        const count = await subCategory.countDocuments({ cat_id });
        const code = category.code + String(count + 1).padStart(3, '0');
        const newSubCategory = new subCategory({ 
          name,
          cat_id: category.code,
          code,
          pcat_id: category._id
         });
        await newSubCategory.save();
        res.status(201).json(newSubCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating subcategory', error });
    }
}

export const createOrGetSubcat = async (req, res) => {
  try {
    let { name, cat_id } = req.body;

    if (!name || !cat_id) {
      return res.status(400).json({ message: "Subcategory name and cat_id are required" });
    }

    name = capitalizeWords(name);

    // Ensure parent category exists
    const category = await Category.findOne({ code: cat_id });
    if (!category) {
      return res.status(404).json({ message: "Parent category not found" });
    }

    // Check if subcategory already exists under this category
    let subcat = await subCategory.findOne({ name, cat_id: category.code });

    if (!subcat) {
      // Count existing subcategories in this category
      const count = await subCategory.countDocuments({ cat_id: category.code });

      // Generate unique code (e.g., CAT001001, CAT001002...)
      const code = category.code + String(count + 1).padStart(3, "0");

      subcat = new subCategory({ 
        name, 
        cat_id: category.code,
        code,
        pcat_id: category._id
       });
      await subcat.save();
    }

    res.json(subcat);
  } catch (error) {
    res.status(500).json({ message: "Error creating or getting subcategory", error: error.message });
  }
};
export const getSubCategoriesByCatName = async (req, res) => {
  try {
    let { categoryName } = req.params;

    // Normalize category name (same capitalization as when saving)
    categoryName = capitalizeWords(categoryName);

    // Find category by name
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find subcategories linked to this category
    const SubCategories = await subCategory.find({ cat_id: category.code });

    res.json(SubCategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({
      message: "Error fetching subcategories",
      error: error.message,
    });
  }
};
export const deleteSubCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const subcat = await subCategory.findById(id);
    if  (!subcat) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    await Item.deleteMany({ pscat_id: id });
    await subCategory.findByIdAndDelete(id);
    res.status(200).json({ message: 'Subcategory deleted successfully' });
  }
  catch (error) {
    res.status(500).json({ message: 'Error deleting subcategory', error });
  }
}
export const getFileredSubCategories = async (req, res) => {
  try {
    const { pcat_id } = req.params;
    const subCategories = await subCategory.find({ pcat_id });
    if (subCategories.length === 0) {
      return res.status(404).json({ message: 'No subcategories found for this category' });
    }
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcategories', error });
  }
}





export const editSubCategory = async (req, res) => {
  try {
    const { id } = req.params; // subcategory id
    let { name } = req.body;

    name = capitalizeWords(name);
    const updatedSubCategory = await subCategory.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedSubCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    res.status(200).json({ message:"category updated", updatedSubCategory});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
