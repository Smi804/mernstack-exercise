import { useState,useEffect } from 'react'
import { MoreVertical } from 'lucide-react'

import './App.css'


function App() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [newItem, setNewItem] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
    setLoading(false);
  };
   const fetchSubcategories = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/subcategories/`);
      const data = await res.json();
      setSubcategories(data);
      
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  }; 
  const fetchItems = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/items/`);
      const data = await res.json();
      
      setItems(data);
      if (data.length === 0) 
        console.log("No items found");
      console.log("Items fetched:", data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };
 



  // Create subcategory
/*   const createSubcategory = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:5000/api/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: subForm.name, cat_id: subForm.catId }),
      });
      fetchSubcategories(subForm.catId); // refresh subs
      setSubForm({ catId: null, name: "" });
    } catch (err) {
      console.error("Error creating subcategory:", err);
    }
  }; */

  // Create item
/*   const createItem = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:5000/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: itemForm.name,
          cat_id: itemForm.catId,
          subcat_id: itemForm.subcatId,
        }),
      }); */
     /*  fetchSubcategories(itemForm.catId); // refresh
      setItemForm({ subcatId: null, name: "" });
    } catch (err) {
      console.error("Error creating item:", err);
    }
  }; */
    fetchCategories();
    fetchSubcategories();
    fetchItems();
   
  }, []);

  /* const handleCreateCategory = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catName }),
      });
      await res.json();
      setNewCategory(""); // Clear input field
      console.log("Category created successfully");

     // refresh
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };   */

  return (
    <div className="p-6">
      <h1 className="text-2xl w-full bg-yellow-500 font-bold">Categories</h1>
      {loading && <p>Loading...</p>}
         <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow">
          <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">Category Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.code} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 font-semibold">
                {cat.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {cat.code}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center relative">
                {/* 3 dot menu */}
                <button
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={() =>
                    setOpenMenu(openMenu === cat.code ? null : cat.code)
                  }
                >
                  <MoreVertical size={20} />
                </button>

                {/* Dropdown menu */}
                {openMenu === cat.code && (
                  <div className="absolute right-2 mt-2 w-44 bg-white shadow-lg border rounded-lg z-10">
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Show Subcategories
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => setSubForm({ catId: cat.code, name: "" })}
                    >
                      Create Subcategory
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
       {/* Create Category */}
     {/*  <div>
        <h3>Create Category</h3>
        <input
          type="text"
          value={newCategory}
          placeholder="Category Name"
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={ handleCreateCategory }>Create Category</button>
      </div> */}
    <button className='bg-green-400 '>Create Categories</button>

    <h1 className="text-2xl w-full bg-yellow-500 font-bold">Sub Categories</h1>
      {loading && <p>Loading...</p>}
         <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow">
          <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">Sub Cat Name</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Cat Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subcategories.map((subcat) => (
            <tr key={subcat.code} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 font-semibold">
                {subcat.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {subcat.cat_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {subcat.code}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center relative">
                {/* 3 dot menu */}
                <button
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={() =>
                    setOpenMenu(openMenu === subcat.code ? null : subcat.code)
                  }
                >
                  <MoreVertical size={20} />
                </button>

                {/* Dropdown menu */}
                {openMenu === subcat.code && (
                  <div className="absolute right-2 mt-2 w-44 bg-white shadow-lg border rounded-lg z-10">
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Show Items
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => setSubForm({ catId: subcat.code, name: "" })}
                    >
                      Create Item
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    <button className='bg-green-400'>Create SubCategories</button>
<h1 className="text-2xl w-full bg-yellow-500 font-bold">Items</h1>
  {loading && <p>Loading...</p>}
         <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow">
          <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">Item Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Cat_Name</th>
            <th className="border border-gray-300 px-4 py-2 text-center">SubCat_Name</th>
            <th className="border border-gray-300 px-4 py-2 text-center">code</th>
            
          </tr>
        </thead>
        <tbody>
          {items.length>=0 && items.map((ite) => (
            <tr key={ite.code} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 font-semibold">
                {ite.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {ite.cat_name} 
              </td>
              <td className="border border-gray-300 px-4 py-2">
                 {ite.subcat_name} 
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {ite.code}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    <button className='bg-green-400 '>Create Items</button>


    </div>
    
  );
};

export default App;

