
import Category from '../models/category.js';
import subCategory from '../models/subcategory.js';
/*
export const getSubCategories=async(req, res) =>{
    try{
        const subCategories=await subCategory.find();
        if(subCategories.length === 0) {
            return res.status(404).json({ message: 'No subcategories found' });
        }
        res.status(200).json(subCategories);
    }
    catch(error){
        res.status(500).json({ message: 'Error fetching subcategories', error });
    }
}
    */
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


export const createSubCategory = async (req, res) => {
    try {
        const { name, cat_id, } = req.body;
        const category = await Category.findOne({ code: cat_id });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        const count = await subCategory.countDocuments({ cat_id });
        const code = category.code + String(count + 1).padStart(3, '0');
        const newSubCategory = new subCategory({ name, cat_id: category.code, code });
        await newSubCategory.save();
        res.status(201).json(newSubCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating subcategory', error });
    }
}
export const getSubcatbyCatId = async (req, res) => {
    const { cat_id } = req.params;
    try {
        const subCategories = await subCategory.find({ cat_id });
        if (subCategories.length === 0) {
            return res.status(404).json({ message: 'No subcategories found for this category' });
        }
        res.status(200).json(subCategories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subcategories by category ID', error });
    }
}

/* export const getSubCategories = async (req, res) => {
    try {
        const subCategories = await subCategory.find()
            .populate("cat_id", "name code"); // only bring name & code from category

        res.json(subCategories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching subcategories", error: error.message });
    }
}; */