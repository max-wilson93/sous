import React, { useState, useEffect } from 'react';
import { setDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";

const Recipes = ({ updateInventory, inventory, addToShoppingList }) => {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    ingredients: [{ name: '', quantity: 0, unit: 'grams' }],
    procedure: [''],
  });

  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [hasChanges, setHasChanges] = useState(false); // Track changes

  // Save recipes to Firebase only when there are changes
  const saveToFirebase = async () => {
    try {
      await setDoc(doc(db, "Recipes", "user-Recipes"), {
        recipes: recipes,
        lastUpdated: new Date(),
      });
      console.log("Recipes saved to Firebase.");
      setHasChanges(false); // Reset change tracker after save
    } catch (error) {
      console.error("Error saving recipes: ", error);
    }
  };

  // Load recipes from localStorage when the component mounts
  useEffect(() => {
    const storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
      setRecipes(JSON.parse(storedRecipes));
    }
  }, []);

  // Save recipes to localStorage whenever recipes change
  useEffect(() => {
    if (recipes.length > 0) {
      localStorage.setItem('recipes', JSON.stringify(recipes));
    }
  }, [recipes]);

  // Handle adding a new recipe
  const saveRecipe = () => {
    if (newRecipe.name.trim() && newRecipe.ingredients.some(ing => ing.name.trim())) {
      const updatedRecipes = [...recipes, newRecipe];
      setRecipes(updatedRecipes);
      setNewRecipe({
        name: '',
        ingredients: [{ name: '', quantity: 0, unit: 'grams' }],
        procedure: [''],
      });
      setHasChanges(true); // Mark as changed
    } else {
      alert('Please enter a recipe name and at least one ingredient.');
    }
  };

  const addIngredientField = () => {
    setNewRecipe({
      ...newRecipe,
      ingredients: [...newRecipe.ingredients, { name: '', quantity: 0, unit: 'grams' }],
    });
    setHasChanges(true); // Mark as changed
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...newRecipe.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    setNewRecipe({ ...newRecipe, ingredients: updatedIngredients });
    setHasChanges(true); // Mark as changed
  };

  const handleProcedureChange = (index, value) => {
    const updatedProcedure = [...newRecipe.procedure];
    updatedProcedure[index] = value;
    setNewRecipe({ ...newRecipe, procedure: updatedProcedure });
    setHasChanges(true); // Mark as changed
  };

  const addProcedureStep = () => {
    setNewRecipe({ ...newRecipe, procedure: [...newRecipe.procedure, ''] });
    setHasChanges(true); // Mark as changed
  };

  const handleCookRecipe = (recipe) => {
    const missingIngredients = recipe.ingredients.filter(
      (ingredient) => 
        !inventory[ingredient.name] || inventory[ingredient.name] < ingredient.quantity
    );

    if (missingIngredients.length === 0) {
      const confirmCook = window.confirm(`Are you going to cook ${recipe.name}?`);
      if (confirmCook) {
        recipe.ingredients.forEach((ingredient) => {
          if (ingredient.name.trim() && ingredient.quantity > 0) {
            updateInventory(ingredient.name, ingredient.quantity);
          }
        });
        alert(`You have cooked ${recipe.name}! Inventory updated.`);
      }
    } else {
      const missingNames = missingIngredients.map(ingredient => ingredient.name).join(", ");
      alert(`You do not have the following ingredients: ${missingNames}. They have been added to your shopping list.`);
      missingIngredients.forEach(ingredient => addToShoppingList(ingredient.name, ingredient.quantity));
    }
  };

  const toggleRecipeExpansion = (index) => {
    setExpandedRecipe(expandedRecipe === index ? null : index);
  };

  const saveIfNeeded = () => {
    if (hasChanges) {
      saveToFirebase();
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Recipe Maker</h1>

      {/* Recipe Name */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Recipe Name:</label>
        <input
          type="text"
          value={newRecipe.name}
          onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
          placeholder="Enter recipe name"
          style={styles.input}
        />
      </div>

      {/* Ingredients Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Ingredients</h3>
        {newRecipe.ingredients.map((ingredient, index) => (
          <div key={index} style={styles.ingredientRow}>
            <input
              type="text"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
              placeholder="Ingredient name"
              style={styles.input}
            />
            <input
              type="number"
              value={ingredient.quantity}
              onChange={(e) => handleIngredientChange(index, "quantity", parseInt(e.target.value))}
              placeholder="Quantity"
              style={styles.input1}
            />
            <select
              value={ingredient.unit}
              onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
              style={styles.select}
            >
              <option value="grams">grams</option>
              <option value="ml">mL</option>
              <option value="tsp">tsp</option>
              <option value="tbsp">tbsp</option>
            </select>
          </div>
        ))}
        <button onClick={addIngredientField} style={styles.addButton}>+ Add Ingredient</button>
      </div>

      {/* Procedure Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Procedure</h3>
        {newRecipe.procedure.map((step, index) => (
          <div key={index} style={styles.procedureRow}>
            <textarea
              value={step}
              onChange={(e) => handleProcedureChange(index, e.target.value)}
              placeholder={`Step ${index + 1}`}
              style={styles.input}
            />
          </div>
        ))}
        <button onClick={addProcedureStep} style={styles.addButton}>+ Add Step</button>
      </div>

      {/* Save Button */}
      <button onClick={saveRecipe} style={styles.saveButton}>Save Recipe</button>
      <button onClick={saveIfNeeded} style={styles.syncButton}>Sync with Cloud</button>

      {/* Recipe List */}
      <div style={styles.catalog}>
        <h2 style={styles.catalogTitle}>Saved Recipes</h2>
        <ul style={styles.recipeList}>
          {recipes.map((recipe, index) => (
            <li key={index} style={styles.recipeCard}>
              <div onClick={() => toggleRecipeExpansion(index)} style={styles.recipeTitle}>
                {recipe.name}
              </div>
              {expandedRecipe === index && (
                <div style={styles.recipeDetails}>
                  <h4>Ingredients:</h4>
                  <ul>
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i}>{ing.quantity} {ing.unit} of {ing.name}</li>
                    ))}
                  </ul>
                  <button onClick={() => handleCookRecipe(recipe)} style={styles.cookButton}>Cook</button>
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
    width: "97%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontFamily: "'Dancing Script', cursive",
    fontSize: "16px",
  },
  input1: {
    width: "10%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontFamily: "'Dancing Script', cursive",
    fontSize: "16px",
  },
  section: {
    marginBottom: "20px",
  },
  sectionTitle: {
    fontFamily: "'Dancing Script', cursive",
    fontSize: "24px",
    color: "#3e2723",
    marginBottom: "10px",
  },
  ingredientGroup: {
    marginBottom: "10px",
  },
  quantityGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "5px",
  },
  quantityInput: {
    width: "80px",
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontFamily: "'Dancing Script', cursive",
    fontSize: "16px",
  },
  unitSelect: {
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontFamily: "'Dancing Script', cursive",
    fontSize: "16px",
  },
  procedureGroup: {
    marginBottom: "10px",
  },
  textarea: {
    width: "97%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontFamily: "'Dancing Script', cursive",
    fontSize: "16px",
    height: "80px",
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
  saveButton: {
    background: "#3e2723",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    fontFamily: "'Dancing Script', cursive",
    fontSize: "18px",
    cursor: "pointer",
    transition: "background 0.3s ease-in-out",
    width: "100%",
    marginTop: "20px",
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
  recipeList: {
    listStyle: "none",
    padding: 0,
  },
  recipeItem: {
    background: "white",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  recipeTitle: {
    fontFamily: "'Dancing Script', cursive",
    fontSize: "22px",
    color: "#3e2723",
    cursor: "pointer",
  },
  recipeDetails: {
    marginTop: "10px",
  },
  detailsTitle: {
    fontFamily: "'Dancing Script', cursive",
    fontSize: "20px",
    color: "#3e2723",
    marginBottom: "10px",
  },
  detailItem: {
    fontFamily: "'Dancing Script', cursive",
    fontSize: "16px",
    color: "#3e2723",
    marginBottom: "5px",
  },
  cookButton: {
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

export default Recipes;