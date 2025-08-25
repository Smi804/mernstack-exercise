  import Category from '../models/category.js';
  import SubCategory from '../models/subcategory.js';
  import Item from '../models/item.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
}
const capitalizeWords = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean) // removes extra spaces
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
export const createCategory = async (req, res) => {
  try {
    let { name} = req.body;
    name = capitalizeWords(name);
    const count=await Category.countDocuments();
    const code = String(count + 1).padStart(2,'0');
    const newCategory = new Category({ name , code});
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error });
  }
}
export const createOrGetCategory = async (req, res) => {
  try {
    let { name } = req.body;
    name = capitalizeWords(name);
    let category = await Category.findOne({ name });

    if (!category) {
      category = new Category({
        name,
        code: String(await Category.countDocuments() + 1).padStart(2, '0')
      });
      await category.save();
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error handling category", error: error.message });
  }
};
export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
      await Item.deleteMany({ pcat_id: id });
     await SubCategory.deleteMany({ pcat_id: id });
     await Category.findByIdAndDelete(id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
}

export const editCategory = async (req, res) => {
  try {
    const { id } = req.params; // category id from route
    let { name } = req.body; // new name

    name = capitalizeWords(name);

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true } 
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
