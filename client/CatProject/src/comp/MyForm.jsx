import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";  
import { API_ENDPOINTS } from "../config/api";  

const MyForm = ({categories, setCategories,subcategories, setSubcategories, setItems}) => {
  /* const [categories, setCategories] = useState([]); */
  const [selectedCategory, setSelectedCategory] = useState(null);
 /*  const [subcategories, setSubcategories] = useState([]); */
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [itemName, setItemName] = useState("");




  useEffect(() => {
  console.log("Categories received in MyForm:", categories);
}, [categories]);

  useEffect(() => {
    if (!selectedCategory) return;
    
  }, [selectedCategory]);

  const handleCategoryChange = async (newValue) => {
    let selectedCat;

    if (newValue.__isNew__) {
      // Create new category in DB
      try {
        const res = await fetch(API_ENDPOINTS.categories.createorget, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newValue.label }),
        });
        const newCat = await res.json();

        const option = { name: newCat.name, code: newCat.code };
        setCategories((prev) => [...prev, option]);
        const option1 = { value: newCat.code, label: newCat.name };
        selectedCat = option1;
      } catch (err) {
        console.error("Error creating category", err);
        return;
      }
    } else {
      selectedCat = newValue;
    }

    setSelectedCategory(selectedCat);

    // Filter subcategories belonging to selected category
    const filteredSubs = subcategories.filter(sub => sub.cat_id === selectedCat.value);

    // Reset selected subcategory
    setSelectedSubCategory(null);
  };


  const handleChange = (newValue) => {
    setSelectedSubCategory(newValue);
  };

  // Handle creating a new subcategory
  const handleCreate = async (inputValue) => {
    if (!selectedCategory) {
      alert("Please select a category first");
      return;
    }

    const res = await fetch(API_ENDPOINTS.subcategories.createorget, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: inputValue,
        cat_id: selectedCategory.value, // parent category code
      }),
    });

    
      const newSubCat = await res.json();
      setSubcategories((prev) => [...prev, newSubCat]);  // keep raw DB object
      setSelectedSubCategory({ value: newSubCat.code, label: newSubCat.name });

  };
  const handleSave = async (e) => {

    e.preventDefault();
    if (!selectedCategory || !selectedSubCategory || !itemName) {
      alert("Please fill all fields");
      return;
    }

    const res = await fetch("http://localhost:5000/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: itemName,
        cat_id: selectedCategory.value,
        subcat_id: selectedSubCategory.value,
      }),
    });

    if (res.ok) {
      const newItem = await res.json();
      alert(`Item created: ${newItem.name}`);
      setItemName("");
      setItems((prev) => [...prev, newItem]);
      setSelectedCategory(null);
      setSelectedSubCategory(null);
    } else {
      const err = await res.json();
      alert(` Error: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSave} className="p-4 border rounded align-middle m-auto w-96 space-y-4">

      <label className="block">
        <span className="text-gray-700 pr-2">Name</span>
        <input
          type="text"
          name="Item Name"
          id="Name"
          placeholder="name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="px-4 border border-black p-2 rounded w-full"
        />

      </label>

      <label className="block">

        <span className="text-gray-700">Category</span>
        <CreatableSelect
          isClearable
           options={categories.map((cat) => ({
           value: String(cat.code),
           label: cat.name,
           }))}
          value={selectedCategory}
          onChange={handleCategoryChange}
          placeholder="Select or create a category..."
        />
      </label>

      <label className="block">
        <span className="text-gray-700">Subcategory</span>
       
        <CreatableSelect
          isClearable
          value={selectedSubCategory}
          onChange={handleChange}       // <-- handle selecting existing subcat
          onCreateOption={handleCreate} // <-- handle creating new subcat
           options={subcategories
              .filter((s) => s.cat_id === selectedCategory?.value)   // filter here
              .map((s) => ({ value: s.code, label: s.name }))}          // <-- use filtered list based on category
          placeholder={
            selectedCategory
              ? "Select or create subcategory"
              : "Please select a category first"
          }
          isDisabled={!selectedCategory} // disable until a category is chosen
        />
      </label>

      <button
        type="submit"
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Save
      </button>
    </form>
  );
};

export default MyForm;
