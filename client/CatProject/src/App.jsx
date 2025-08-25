import { useState, useEffect } from 'react'
import { Delete,PenLine } from 'lucide-react'
import MyForm from './comp/MyForm'
import Prompt from './comp/Prompt'
import { API_ENDPOINTS } from './config/api'

import './App.css'


function App() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategoryForTable, setSelectedCategoryForTable] = useState(null);
  const [selectedCatForItems, setSelectedCatForItems] = useState("");
  const [selectedSubCatForItems, setSelectedSubCatForItems] = useState("");
  const [editType, setEditType] = useState(null); 
  const [selectedRow, setSelectedRow] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);



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
        const res = await fetch(API_ENDPOINTS.categories.getAll);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
      setLoading(false);
    };
    const fetchSubcategories = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.subcategories.getAll);
        const data = await res.json();
        console.log("sub cats fetched");
        setSubcategories(data);  
      } catch (err) {
        console.error("Error fetching subcategories:", err);
      }
    };
    const fetchItems = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.items.getAll);
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

  }, [setSubcategories,setItems]);
const handleEditSave = async (newName) => {
  if (!selectedRow || !editType) return;

  let endpoint = "";
  let stateSetter = null;

  if (editType === "Category") {
    endpoint = API_ENDPOINTS.categories.update(selectedRow._id);
    stateSetter = setCategories;
  } else if (editType === "SubCategory") {
    endpoint =API_ENDPOINTS.subcategories.update(selectedRow._id);
    stateSetter = setSubcategories;
  } else if (editType === "Item") {
    endpoint = API_ENDPOINTS.items.update(selectedRow._id);
    stateSetter = setItems;
  }

  try {
    const res = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });

    const data = await res.json();
    if (res.ok) {
      stateSetter((prev) =>
        prev.map((row) =>
          row._id === selectedRow._id ? { ...row, name: newName } : row
        )
      );
    } else {
      alert(data.message || "Failed to update");
    }
  } catch (err) {
    console.error("Error updating:", err);
  }
};



  const handleItemsDelete = async (id) => {
     const confirmDelete = window.confirm(
    `Are you sure you want to delete item?`
  );

  if (confirmDelete) {
  try {
    const res = await fetch(API_ENDPOINTS.items.delete(id), {
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
}
};
const handleCatDelete = async (id) => {
    const cat = categories.find((c) => c._id === id);
  if (!cat) {
    console.error("Category not found in state");
    return;
  }

  // check in subcategories + items arrays
  const relatedSubcats = subcategories.filter((s) => s.cat_id === cat.code);
  const relatedItems = items.filter((i) => i.cat_id === cat.code);

  let message = `Are you sure you want to delete category "${cat.name}"?`;

  if (relatedSubcats.length > 0) {
    message += `\n\nThis category also has ${relatedSubcats.length} subcategories that will be deleted.`;
  }
  if (relatedItems.length > 0) {
    message += `\n This category also has ${relatedItems.length} items that will be deleted.`;
  }

  const confirmDelete = window.confirm(message);
  if (!confirmDelete) return;
  try {
    const res = await fetch(API_ENDPOINTS.categories.delete(id), {
      method: "DELETE",
    });

    const data = await res.json();
    console.log("Delete response:", res.status, data);

    if (res.ok) {
      alert(data.message);
        setCategories((prev) => prev.filter((c) => c._id !== cat._id));
        setSubcategories((prev) => prev.filter((sub) => sub.cat_id !== cat.code));
        setItems((prev) => prev.filter((item) => item.cat_id !== cat.code));
    } else {
      throw new Error(data.message || "Failed to delete category");
    }
  } catch (error) {
    console.error("Error deleting category:", error);
  }

};
const handleSubCatDelete = async (id) => {
  const sub = subcategories.find((c) => c._id === id);
  if (!sub) {
    console.error("Subcategory not found in state");
    return;
  }

  // check in items array
  const relatedItems = items.filter((i) => i.subcat_id === sub.code);

  let message = `Are you sure you want to delete subcategory "${sub.name}"?`;

  if (relatedItems.length > 0) {
    message += `\n\n This subcategory also has ${relatedItems.length} items that will be deleted.`;
  }

  const confirmDelete = window.confirm(message);
  if (!confirmDelete) return;
  
  try {
    const res = await fetch(API_ENDPOINTS.subcategories.delete(id), {
      method: "DELETE",
    });

    const data = await res.json();
    console.log("Delete response:", res.status, data);

    if (res.ok) {
      alert(data.message);
        setSubcategories((prev) => prev.filter((s) => s._id !== sub._id));
        setItems((prev) => prev.filter((item) => item.subcat_id !== sub.code));
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
            <tr key={cat._id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 font-semibold">
                {cat.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {cat.code}
              </td>
              <td className="border border-gray-300 px-4 py-2 flex flex-row justify-center text-center relative">
                
                <button
                  className="p-3 hover:bg-gray-200 text-red-600 rounded-full"
                   onClick={()=>handleCatDelete(cat._id)} 
                >
                  <Delete size={20} />
                </button>
                <button
                  className="p-3 hover:bg-gray-200 text-green-500 rounded-full"
                    onClick={() => {
                     setSelectedRow(cat);
                     setEditType("Category");
                     setShowPrompt(true);
                    }}
                >
                  <PenLine size={20} />
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
           <option key={cat._id} value={cat.code}>
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
            <tr key={subcat._id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 font-semibold">
                {subcat.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {subcat.cat_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {subcat.code}
              </td>
              <td className="border border-gray-300 px-4 py-2 flex flex-row justify-center text-center relative">
                <button
                  className="p-3 hover:bg-gray-200 text-red-600 rounded-full"
                   onClick={() =>
                    handleSubCatDelete(subcat._id)
                  } 
                  >
                  <Delete size={20} />
                </button> 
                <button
                  className="p-3 hover:bg-gray-200 text-green-500 rounded-full"
                    onClick={() => {
                     setSelectedRow(subcat);
                     setEditType("SubCategory");
                     setShowPrompt(true);
                    }}
                  >
                  <PenLine size={20} />
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
              <td className="border border-gray-300 px-4 py-2 flex flex-row justify-center text-center relative">
                <button
                  className="p-3 hover:bg-gray-200 text-red-600 rounded-full"
                   onClick={()=>handleItemsDelete(ite._id)} 
                  >
                  <Delete size={20} />
                </button>
                <button
                  className="p-3 hover:bg-gray-200 text-green-500 rounded-full"
                   onClick={() => {
                     setSelectedRow(ite);
                     setEditType("Item");
                     setShowPrompt(true);
                    }}
                  >
                  <PenLine size={20} />
                </button> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    
     <Prompt
      isOpen={showPrompt}
      onClose={() => setShowPrompt(false)}
      onSave={handleEditSave}
      editType={editType} 
      edit={selectedRow ? selectedRow.name : ""}
      />
       <MyForm 
     categories={categories}
     setCategories={setCategories}
     subcategories={subcategories}
     setSubcategories={setSubcategories}
     setItems={setItems}
     />


    </div>

  );
};

export default App;

