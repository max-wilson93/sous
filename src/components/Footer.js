const Footer = () => {
	return (
	  <footer style={styles.footer}>
		<p style={styles.text}>© 2025 de Partie. All rights reserved.</p>
	  </footer>
	);
  };
  
  const styles = {
	footer: {
	  background: "linear-gradient(to right, #f8f1e7, #e5d9c6)", // Matching soft cream gradient
	  padding: "15px",
	  textAlign: "center",
	  boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow at the top
	},
	text: {
	  fontFamily: "'Dancing Script', cursive", // Calligraphic font for elegance
	  fontSize: "18px",
	  color: "#3e2723", // Rich brown to match the header
	  margin: 0,
	},
  };
  
  export default Footer;
  