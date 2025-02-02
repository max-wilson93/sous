import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase'; // Import Firebase DB (adjust according to your Firebase setup)
import { doc, setDoc } from 'firebase/firestore';

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [hasChanges, setHasChanges] = useState(false); // Track if changes were made

  // Load the shopping list from localStorage when the component mounts
  useEffect(() => {
    const storedItems = localStorage.getItem('shoppingList');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  // Save shopping list to localStorage and Firebase when necessary
  useEffect(() => {
    if (hasChanges) {
      saveToFirebase(items);
      setHasChanges(false); // Reset changes tracker after saving
    }
  }, [hasChanges, items]); // Trigger saving when items or hasChanges changes

  const addItem = () => {
    if (itemName && quantity) {
      setItems((prevItems) => {
        const updatedItems = [...prevItems, { name: itemName, quantity }];
        setHasChanges(true); // Mark changes
        return updatedItems;
      });
      setItemName(''); // Reset item name field
      setQuantity(''); // Reset quantity field
    }
  };

  const removeItem = (index) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.filter((_, i) => i !== index);
      setHasChanges(true); // Mark changes
      return updatedItems;
    });
  };

  const clearList = () => {
    setItems([]);
    setHasChanges(true); // Mark changes when clearing the list
  };

  // Save data to Firebase
  const saveToFirebase = async (data) => {
    try {
      await setDoc(doc(db, 'shoppingList', 'user-shopping-list'), {
        items: data,
        lastUpdated: new Date(),
      });
      console.log('Shopping list saved to Firebase.');
    } catch (error) {
      console.error('Error saving shopping list to Firebase: ', error);
    }
  };

  return (
    <div style={{ fontFamily: "'Dancing Script', cursive", padding: '20px', textAlign: 'center' }}>
      <h1>Shopping List</h1>

      {/* Add Item Section */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Item Name: </label>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Enter item name"
          style={styles.inputName}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Quantity: </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={styles.inputSmall}
        />
      </div>

      <button onClick={addItem} style={styles.addButton}>Add Item</button>

      {/* Clear List Button */}
      <button onClick={clearList} style={styles.clearButton}>Clear List</button>

      {/* Shopping List Display */}
      <div style={styles.listContainer}>
        {items.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {items.map((item, index) => (
              <li key={index} style={styles.listItem}>
                <span style={styles.itemName}>{item.name}</span>
                <span style={styles.itemQuantity}>x{item.quantity}</span>
                <button 
                  onClick={() => removeItem(index)} 
                  style={styles.removeButton}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No items in the shopping list.</p>
        )}
      </div>
    </div>
  );
};

// Styles for Shopping List Component
const styles = {
  inputGroup: {
    marginBottom: '15px',  // Adds space between label and input field
  },
  label: {
    fontFamily: "'Dancing Script', cursive",
    fontSize: '18px',
    color: '#3e2723',
    marginBottom: '5px',
  },
  inputName: {
    width: '60%',  // Item name width
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontFamily: "'Dancing Script', cursive",
    fontSize: '16px',
  },
  inputSmall: {
    width: '80px',  // Smaller boxes for quantity
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontFamily: "'Dancing Script', cursive",
    fontSize: '16px',
  },
  addButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#3e2723',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px',
  },
  clearButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#d32f2f',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px',
  },
  listContainer: {
    marginTop: '20px',
    textAlign: 'left',
    maxWidth: '500px',
    margin: '0 auto',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
  },
  listItem: {
    padding: '8px',
    background: '#fff',
    margin: '5px 0',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: "'Dancing Script', cursive",
    fontSize: '16px',
  },
  itemName: {
    fontWeight: 'bold',
  },
  itemQuantity: {
    color: '#888',
  },
  removeButton: {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default ShoppingList;
