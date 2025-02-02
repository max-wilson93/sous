import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li><Link to="/" style={styles.navLink}>Inventory</Link></li>
        <li><Link to="/recipes" style={styles.navLink}>Recipes</Link></li>
        <li><Link to="/shopping-list" style={styles.navLink}>Shopping List</Link></li>
        <li><Link to="/ai-recipe" style={styles.navLink}>Recipe AI</Link></li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    background: "linear-gradient(to right, #222, #555)", // Dark modern gradient
    padding: "12px 20px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
  navList: {
    listStyle: "none",
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    padding: 0,
    margin: 0,
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "500",
    padding: "8px 16px",
    borderRadius: "8px",
    transition: "background 0.3s ease-in-out",
  },
  navLinkHover: {
    background: "rgba(255, 255, 255, 0.2)",
  },
};

export default Navbar;
