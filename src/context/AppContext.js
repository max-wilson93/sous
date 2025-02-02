import { createContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Load saved data from localStorage
  useEffect(() => {
    setInventory(JSON.parse(localStorage.getItem("inventory")) || []);
    setRecipes(JSON.parse(localStorage.getItem("recipes")) || []);
    setShoppingList(JSON.parse(localStorage.getItem("shoppingList")) || []);
  }, []);

  // Autosave to localStorage
  useEffect(() => localStorage.setItem("inventory", JSON.stringify(inventory)), [inventory]);
  useEffect(() => localStorage.setItem("recipes", JSON.stringify(recipes)), [recipes]);
  useEffect(() => localStorage.setItem("shoppingList", JSON.stringify(shoppingList)), [shoppingList]);

  return (
    <AppContext.Provider
      value={{
        darkMode,
        setDarkMode,
        inventory,
        setInventory,
        recipes,
        setRecipes,
        shoppingList,
        setShoppingList,
        user,
        setUser,
        error,
        setError,
        email,
        setEmail,
        password,
        setPassword,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
