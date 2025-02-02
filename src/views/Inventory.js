import React, { useState, useEffect } from 'react';
import { setDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";

const Inventory = ({ updateShoppingList }) => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 0,
    unit: 'grams',  // Default unit
    price: 0,
    servings: 0,
  });

  const [expandedItem, setExpandedItem] = useState(null);

  // Load inventory from localStorage when the component mounts
  useEffect(() => {
    const storedItems = localStorage.getItem('inventory');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }

    // Set up autosave every 5 minutes
    const intervalId = setInterval(() => {
      saveToFirebase(items);
    }, 300000);  // 5 minutes

    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, []);

  // Save inventory to localStorage whenever items change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('inventory', JSON.stringify(items));
    }
  }, [items]);  // Save to localStorage whenever items change

  // Save data to Firebase
  const saveToFirebase = async (data) => {
    try {
      await setDoc(doc(db, "Inventory", "user-Inventory"), {
        items: data,
        lastUpdated: new Date(),
      });
      console.log("Inventory saved.");
    } catch (error) {
      console.error("Error saving inventory: ", error);
    }
  };

  const addItem = () => {
    if (newItem.name.trim() && newItem.quantity > 0 && newItem.servings > 0) {
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      setNewItem({ name: '', quantity: 0, unit: 'grams', price: 0, servings: 0 });
    } else {
      alert('Please enter valid details.');
    }
  };

  const handleUseItem = (itemName, usedQuantity) => {
    const updatedItems = items.map(item => {
      if (item.name === itemName) {
        const newQuantity = item.quantity - usedQuantity;
        if (newQuantity <= item.quantity * 0.25) {
          updateShoppingList(item.name); // Add to shopping list if quantity is low
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const toggleItemExpansion = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Inventory Management</h1>

      {/* Add New Item Form */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Item Name:</label>
        <input
          type="text"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          placeholder="Enter the name of the item"
          style={styles.input1}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Quantity: </label>
        <input
          type="number"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
          placeholder="Enter the total quantity"
          style={styles.input}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Number of Servings: </label>
        <input
          type="number"
          value={newItem.servings}
          onChange={(e) => setNewItem({ ...newItem, servings: parseInt(e.target.value) })}
          placeholder="Enter number of servings"
          style={styles.input}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Price per Unit: </label>
        <input
          type="number"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
          placeholder="Enter price per unit"
          style={styles.input}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Unit: </label>
        <select
          value={newItem.unit}
          onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
          style={styles.select}
        >
          <option value="grams">grams</option>
          <option value="ml">mL</option>
          <option value="tsp">tsp</option>
          <option value="tbsp">tbsp</option>
        </select>
      </div>

      <button onClick={addItem} style={styles.addButton}>Add Item</button>

      {/* Inventory List */}
      <div style={styles.catalog}>
        <h2 style={styles.catalogTitle}>Inventory Catalog</h2>
        <ul style={styles.itemList}>
          {items.map((item, index) => (
            <li key={index} style={styles.itemCard}>
              <div
                onClick={() => toggleItemExpansion(index)}
                style={styles.itemTitle}
              >
                {item.name}
              </div>
              {expandedItem === index && (
                <div style={styles.itemDetails}>
                  <p>Quantity: {item.quantity} {item.unit}</p>
                  <p>Price per unit: ${item.price}</p>
                  <p>Servings: {item.servings}</p>
                  <button 
                    onClick={() => handleUseItem(item.name, item.servings)} 
                    style={styles.useButton}
                  >
                    Use in Recipe
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: "linear-gradient(to right, #f8f1e7, #e5d9c6)",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    maxWidth: "800px",
    margin: "20px auto",
  },
  title: {
    fontFamily: "'Dancing Script', cursive",
    fontSize: "36px",
    fontWeight: "600",
    color: "#3e2723",
    textAlign: "center",
    marginBottom: "20px",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    fontFamily: "'Dancing Script', cursive",
    fontSize: "18px",
    color: "#3e2723",
    marginBottom: "5px",
  },
  input: {
    width: "10%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontFamily: "'Dancing Script', cursive",
    fontSize: "16px",
  },
  input1: {
    width: "97%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontFamily: "'Dancing Script', cursive",
    fontSize: "16px",  
  },
  select: {
    width: "8%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontFamily: "'Dancing Script', cursive",
    fontSize: "16px",
  },
  addButton: {
    background: "#3e2723",
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    fontFamily: "'Dancing Script', cursive",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s ease-in-out",
  },
  catalog: {
    marginTop: "40px",
  },
  catalogTitle: {
    fontFamily: "'Dancing Script', cursive",
    fontSize: "28px",
    color: "#3e2723",
    textAlign: "center",
    marginBottom: "20px",
  },
  itemList: {
    listStyle: "none",
    padding: 0,
  },
  itemCard: {
    background: "white",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  itemTitle: {
    fontFamily: "'Dancing Script', cursive",
    fontSize: "22px",
    color: "#3e2723",
    cursor: "pointer",
  },
  itemDetails: {
    marginTop: "10px",
  },
  useButton: {
    background: "#3e2723",
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    fontFamily: "'Dancing Script', cursive",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s ease-in-out",
    marginTop: "10px",
  },
};

export default Inventory;
