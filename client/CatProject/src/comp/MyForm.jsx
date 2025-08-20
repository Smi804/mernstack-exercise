import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";

const MyForm = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [itemName, setItemName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);


  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        const data = await res.json();
        setCategories(
          data.map((cat) => ({
            value: cat.code,
            label: cat.name,
          }))
        );
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    const fetchSubcategories=async(name)=>{
        try{
        const res = await fetch("http://localhost:5000/api/subcategories");
        const data = await res.json();
        setSubCategories(
          data.map((cat) => ({
            value: cat.code,
            label: cat.name,
          }))
        );

        }catch(err){
            console.error("Error fetching subcategories", err);

        }
    }
    
fetchCategories();
fetchSubcategories();
  }, []);
  useEffect(() => {
    if (!selectedCategory) return;

    fetch("http://localhost:5000/api/subcategories")
      .then((res) => res.json())
      .then((data) => {
        // filter only subcategories of this parent
        const filtered = data.filter((s) => s.cat_id === selectedCategory.value);
        setSubCategories(
          filtered.map((s) => ({ value: s.code, label: s.name }))
        );
      });
  }, [selectedCategory]);
  const createCategory = async (name) => {
        try{
            const res = await fetch("http://localhost:5000/api/categories/createOrGet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            const newCat = await res.json();
            setCategories((prev) => [...prev, { value: newCat.code, label: newCat.name }]);
            setSelectedCategory({ value: newCat.code, label: newCat.name });
        }
        catch (err) {
          console.error("Error creating category", err);
        }

  }


const handleCategoryChange = async (newValue) => {
  let selectedCat;

  if (newValue.__isNew__) {
    // Create new category in DB
    try {
      const res = await fetch("http://localhost:5000/api/categories/createOrGet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newValue.label }),
      });
      const newCat = await res.json();

      const option = { value: newCat.code, label: newCat.name };
      setCategories((prev) => [...prev, option]);
      selectedCat = option;
    } catch (err) {
      console.error("Error creating category", err);
      return;
    }
  } else {
    selectedCat = newValue;
  }

  setSelectedCategory(selectedCat);

  // Filter subcategories belonging to selected category
  const filteredSubs = subCategories.filter(sub => sub.cat_id === selectedCat.value);
  setFilteredSubcategories(filteredSubs);

  // Reset selected subcategory
  setSelectedSubCategory(null);
};

  /* const handleCategoryChange = async (newValue) => {
    if (newValue.__isNew__) {
      // Create new category in DB
      try {
        const res = await fetch("http://localhost:5000/api/categories/createOrGet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newValue.label }),
        });
        const newCat = await res.json();

        const option = { value: newCat.code, label: newCat.name };
        setCategories((prev) => [...prev, option]);
        setSelectedCategory(option);
      } catch (err) {
        console.error("Error creating category", err);
      }
    } else {
      setSelectedCategory(newValue);
    }
  }; */

  /* const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !subCategoryName) {
      alert("Please select a category and enter a subcategory");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: subCategoryName,
          cat_id: selectedCategory.value, // we store category code as cat_id
        }),
      });

      if (!res.ok) throw new Error("Failed to create subcategory");

      const newSub = await res.json();
      console.log("Subcategory created:", newSub);

      setSubCategoryName("");
      setSelectedCategory(null);
    } catch (err) {
      console.error("Error creating subcategory:", err);
    }
  }; */
   const handleChange = (newValue) => {
    setSelectedSubCategory(newValue);
  };

  // Handle creating a new subcategory
  const handleCreate = async (inputValue) => {
    if (!selectedCategory) {
      alert("Please select a category first");
      return;
    }

    const res = await fetch("http://localhost:5000/api/subcategories/createOrGet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: inputValue,
        cat_id: selectedCategory.value, // parent category code
      }),
    });

    const newSubCat = await res.json();
    const newOption = { value: newSubCat.code, label: newSubCat.name };

    setSubCategories((prev) => [...prev, newOption]);
    setSelectedSubCategory(newOption);
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
      alert(`✅ Item created: ${newItem.name}`);
      setItemName("");
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
          options={categories}
          value={selectedCategory}
          onChange={handleCategoryChange}
          placeholder="Select or create a category..."
        />
      </label>

      <label className="block">
        <span className="text-gray-700">Subcategory</span>
        {/* <CreatableSelect
        isClearable
        onChange={handleChange}
        onCreateOption={handleCreate}
        options={subCategories}
        value={selectedSubCategory}
        placeholder={
        selectedCategory
          ? "Select or create subcategory"
          : "Please select a category first"
      }
      isDisabled={!selectedCategory} // disable until a category is chosen
    /> */}
    <CreatableSelect
      isClearable
      value={selectedSubCategory}
      onChange={handleChange}       // <-- handle selecting existing subcat
      onCreateOption={handleCreate} // <-- handle creating new subcat
      options={subCategories}          // <-- use filtered list based on category
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
