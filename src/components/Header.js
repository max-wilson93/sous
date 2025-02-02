import React from 'react';

const Header = ({ user, email, password, setEmail, setPassword, handleSignIn, handleSignUp, handleSignOut, error }) => {
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>de Partie</h1>
      <div style={styles.authContainer}>
        {user ? (
          <div style={styles.userContainer}>
            <p style={styles.welcomeMessage}>Welcome, {user.email}</p>
            <button onClick={handleSignOut} style={styles.button}>
              Sign Out
            </button>
          </div>
        ) : (
          <div style={styles.authForm}>
            <p style={styles.signInMessage}>Sign in to store your data</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              style={styles.input}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={styles.input}
            />
            <button onClick={handleSignIn} style={styles.button}>
              Sign In
            </button>
            <button onClick={handleSignUp} style={styles.button}>
              Sign Up
            </button>
          </div>
        )}
        {error && <p style={styles.errorMessage}>{error}</p>}
      </div>
    </header>
  );
};

const styles = {
  header: {
    background: "linear-gradient(to right, #f8f1e7, #e5d9c6)", // Soft cream gradient
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontFamily: "'Dancing Script', cursive", // Calligraphic font
    fontSize: "36px",
    fontWeight: "600",
    color: "#3e2723", // Rich brown for elegance
    margin: 0,
  },
  authContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  userContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  authForm: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  welcomeMessage: {
    fontFamily: "'Roboto', sans-serif",
    fontSize: "14px",
    color: "#3e2723", // Rich brown
    margin: 0,
  },
  signInMessage: {
    fontFamily: "'Roboto', sans-serif",
    fontSize: "14px",
    color: "#3e2723", // Rich brown
    margin: 0,
  },
  input: {
    padding: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontFamily: "'Roboto', sans-serif",
    fontSize: "14px",
  },
  button: {
    padding: "5px 10px",
    backgroundColor: "#3e2723", // Rich brown
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontFamily: "'Roboto', sans-serif",
    fontSize: "14px",
    cursor: "pointer",
  },
  errorMessage: {
    fontFamily: "'Roboto', sans-serif",
    fontSize: "14px",
    color: "#dc3545", // Red for errors
    margin: 0,
  },
};

export default Header;