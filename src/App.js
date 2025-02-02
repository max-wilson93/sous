import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route here
import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Inventory from './views/Inventory';
import Recipes from './views/Recipes';
import ShoppingList from './views/ShoppingList';
import AIRecipe from './views/AIRecipe';
import './App.css';
import { signIn, signUp, signOutUser, onAuthStateChangedListener } from './services/firebaseAuth'; // Import the functions

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [user, setUser] = useState(null); // State to track logged-in user
  const [error, setError] = useState(''); // State to track authentication errors
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input

  // Load inventory, recipes, and shopping list from localStorage when the component mounts
  useEffect(() => {
    const savedInventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const savedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const savedShoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

    setInventory(savedInventory);
    setRecipes(savedRecipes);
    setShoppingList(savedShoppingList);
  }, []);

  // Autosave inventory, recipes, and shopping list to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }, [shoppingList]);

  // Function to add/update inventory
  const updateInventory = (newItem) => {
    setInventory((prevInventory) => [...prevInventory, newItem]);
  };

  // Function to add new recipes
  const updateRecipes = (newRecipe) => {
    setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
  };

  // Function to update shopping list
  const updateShoppingList = (item) => {
    setShoppingList((prevList) => [...prevList, item]);
  };

  // Function to handle sign-out
  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUser(null); // Clear user state on sign-out
      setError(''); // Clear any errors
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to handle sign-in
  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      setError(''); // Clear any errors
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to handle sign-up
  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      setError(''); // Clear any errors
    } catch (error) {
      setError(error.message);
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((currentUser) => {
      setUser(currentUser); // Set current user when authentication state changes
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe when the component is unmounted
  }, []);

  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      <Header
        user={user}
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        handleSignIn={handleSignIn}
        handleSignUp={handleSignUp}
        handleSignOut={handleSignOut}
        error={error}
      />
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main>
        <Routes>
          <Route
            path="/"
            element={<Inventory inventory={inventory} updateInventory={updateInventory} updateShoppingList={updateShoppingList} />}
          />
          <Route
            path="/recipes"
            element={<Recipes recipes={recipes} />}
          />
          <Route
            path="/shopping-list"
            element={<ShoppingList shoppingList={shoppingList} />}
          />
          <Route
            path="/ai-recipe"
            element={<AIRecipe updateRecipes={updateRecipes} />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
