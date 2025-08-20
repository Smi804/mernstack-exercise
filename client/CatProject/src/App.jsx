import { useState, useEffect } from 'react'
import { Delete } from 'lucide-react'
import MyForm from './comp/MyForm'

import './App.css'


function App() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategoryForTable, setSelectedCategoryForTable] = useState(null);
  
  

const [selectedCatForItems, setSelectedCatForItems] = useState("");
const [selectedSubCatForItems, setSelectedSubCatForItems] = useState("");


const filteredSubCategories = selectedCategoryForTable
  ? subcategories.filter((sub) => sub.cat_id === selectedCategoryForTable)
  : subcategories;
const filteredItems = items.filter((item) => {
  if (selectedCatForItems && item.cat_id !== selectedCatForItems) return false;
  if (selectedSubCatForItems && item.subcat_id !== selectedSubCatForItems) return false;
  return true;
});

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




   
    fetchCategories();
    fetchSubcategories();
    fetchItems();

  }, []);
  const handleItemsDelete = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/items/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    console.log("Delete response:", res.status, data);

    if (res.ok) {
      alert(data.message);
      setItems(items.filter((item) => item._id !== id));
    } else {
      throw new Error(data.message || "Failed to delete item");
    }
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};
const handleCatDelete = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    console.log("Delete response:", res.status, data);

    if (res.ok) {
      alert(data.message);
      setCategories(categories.filter((cat) => cat._id !== id));
    } else {
      throw new Error(data.message || "Failed to delete category");
    }
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};
const handleSubCatDelete = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/subcategories/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    console.log("Delete response:", res.status, data);

    if (res.ok) {
      alert(data.message);
      setSubcategories(subcategories.filter((subcat) => subcat._id !== id));
    } else {
      throw new Error(data.message || "Failed to delete subcategory");
    }
  } catch (error) {
    console.error("Error deleting subcategory:", error);
  }
};


    



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
                
                <button
                  className="p-2 hover:bg-gray-100 text-red-600 rounded-full"
                   onClick={()=>handleCatDelete(cat._id)} 
                >
                  <Delete size={20} />
                </button>

               
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    
      
      <h1 className="text-2xl h-9 w-full bg-yellow-500 pt-2 m-5 font-bold">SubCategories</h1>
      <label className="block mb-4">
      <span className="text-gray-700">Filter by Category</span>
      <select
        className="ml-2 border p-2 rounded"
        value={selectedCategoryForTable || ""}
        onChange={(e) => setSelectedCategoryForTable(e.target.value)} >
  
          <option value="">All Categories</option>
           {categories.map((cat) => (
           <option key={cat.name} value={cat.code}>
           {cat.name}
            </option>
    ))}
  </select>
</label>

      
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
          {filteredSubCategories.map((subcat) => (
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
                <button
                  className="p-2 hover:bg-gray-100 text-red-600 rounded-full"
                   onClick={() =>
                    handleSubCatDelete(subcat._id)
                  } 
                  >
                  <Delete size={20} />
                </button> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <h1 className="text-2xl w-full bg-yellow-500 font-bold mt-10">Items</h1>
      <label className="block mb-4">
      <span className="text-gray-700">Filter by Category</span>
      <select
       className="ml-2 border p-2 rounded"
       value={selectedCatForItems}
       onChange={(e) => {
       setSelectedCatForItems(e.target.value);
       setSelectedSubCatForItems(""); 
        }}  >
       <option value="">All Categories</option>
      {categories.map((cat) => (
      <option key={cat.name} value={cat.code}>
        {cat.name}
      </option>
      ))}
     </select>
     </label>
     <label className="block mb-4">
  <span className="text-gray-700">Filter by Subcategory</span>
  <select
    className="ml-2 border p-2 rounded"
    value={selectedSubCatForItems}
    onChange={(e) => setSelectedSubCatForItems(e.target.value)}
    disabled={!selectedCatForItems} // disable if no category selected
  >
    <option value="">All Subcategories</option>
    {subcategories.filter((sub) => sub.cat_id === selectedCatForItems)
      .map((sub) => (
        <option key={sub.name} value={sub.code}>
          {sub.name}
        </option>
      ))}
  </select>
</label>


      {loading && <p>Loading...</p>}
      <table className="min-w-full border-collapse border border-gray-300 rounded-lg shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">Item Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Cat_Name</th>
            <th className="border border-gray-300 px-4 py-2 text-center">SubCat_Name</th>
            <th className="border border-gray-300 px-4 py-2 text-center">code</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>

          </tr>
        </thead>
        <tbody>
          {filteredItems.length >= 0 && filteredItems.map((ite) => (
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
              <td className="border border-gray-300 px-4 py-2 text-center relative">
                <button
                  className="p-2 hover:bg-gray-100 text-red-600 rounded-full"
                   onClick={()=>handleItemsDelete(ite._id)} 
                  >
                  <Delete size={20} />
                </button> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
     <MyForm/>
    </div>

  );
};

export default App;

