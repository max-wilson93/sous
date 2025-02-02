import React, { useState } from 'react';
import { fetchRecipe } from '../services/ai'; // Adjust the path according to your structure

const AIRecipe = ({ updateRecipes }) => {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const parseRecipe = (recipeText) => {
    // Split the recipe into parts based on known sections (title, ingredients, instructions)
    const recipeParts = recipeText.split('Ingredients:');
    const titlePart = recipeParts[0].trim();
    const ingredientsPart = recipeParts[1].split('Instructions:')[0].trim();
    const instructionsPart = recipeParts[1].split('Instructions:')[1].trim();

    // Format the parsed recipe into an object
    return {
      name: titlePart.replace('Recipe:', '').trim(),  // Clean up the title
      ingredients: ingredientsPart.split('\n').map(ingredient => ingredient.trim()).filter(Boolean),
      instructions: instructionsPart.split('\n').map(instruction => instruction.trim()).filter(Boolean),
    };
  };

  const handleGetRecipe = async () => {
    if (!ingredients.trim()) {
      alert('Please enter some ingredients.');
      return;
    }

    setIsLoading(true);
    setRecipe(null); // Clear previous recipe

    try {
      const fetchedRecipe = await fetchRecipe(ingredients); // Fetch recipe from API
      const structuredRecipe = parseRecipe(fetchedRecipe); // Parse the recipe into structured format
      setRecipe(structuredRecipe); // Update state with the parsed recipe
    } catch (error) {
      setRecipe('Failed to fetch recipe. Please try again.');
    } finally {
      setIsLoading(false); // Set loading state back to false
    }
  };

  const handleSaveRecipe = () => {
    if (recipe) {
      updateRecipes(recipe); // Save the recipe using the passed down function
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>AI Recipe Suggestions</h1>
      <div>
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Enter ingredients (e.g., tomatoes, pasta)"
          style={{ width: '300px', padding: '10px', marginRight: '10px' }}
        />
        <button onClick={handleGetRecipe} disabled={isLoading} style={styles.getRecipeButton}>
          {isLoading ? 'Generating...' : 'Get Recipe'}
        </button>
      </div>

      {recipe && typeof recipe === 'object' && (
        <div style={styles.recipeContainer}>
          <h2>{recipe.name}</h2>
          <div style={styles.recipeSection}>
            <h3>Ingredients:</h3>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} style={styles.ingredient}>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          <div style={styles.recipeSection}>
            <h3>Instructions:</h3>
            {recipe.instructions.map((step, index) => (
              <p key={index} style={styles.instruction}>
                {step}
              </p>
            ))}


          </div>
          
        </div>
     )}

      {recipe && typeof recipe === 'string' && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#ffe5b4', borderRadius: '8px' }}>
          <h2>Recipe:</h2>
          <p>{recipe}</p>
        </div>
      )}
    </div>
  );
};

// Styles for AI Recipe Component
const styles = {
  getRecipeButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#3e2723',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px',
  },
  recipeContainer: {
    marginTop: '20px',
    padding: '20px',
    background: '#ffe5b4',
    borderRadius: '10px',
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'left',
  },
  recipeSection: {
    marginBottom: '15px',
  },
  ingredient: {
    fontSize: '16px',
    color: '#3e2723',
  },
  instruction: {
    fontSize: '16px',
    color: '#3e2723',
    marginBottom: '10px',
  },
  saveButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#3e2723',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default AIRecipe;
