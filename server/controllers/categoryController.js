  import Category from '../models/category.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
}
export const createCategory = async (req, res) => {
  try {
    const { name} = req.body;
    const count=await Category.countDocuments();
    const code = String(count + 1).padStart(2,'0');
    const newCategory = new Category({ name , code});
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error });
  }
}


