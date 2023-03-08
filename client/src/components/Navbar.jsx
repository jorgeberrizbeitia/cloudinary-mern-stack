import { Link } from "react-router-dom";

function Navbar() {
  const navStyles = {
    display: "flex",
    justifyContent: "space-evenly",
    margin: "20px",
  };

  return (
    <nav style={navStyles}>
      <Link to="/">Home</Link>
      <Link to="/item/create">Create Item</Link>
      <Link to="/item/list">See all Items</Link>
    </nav>
  );
}

export default Navbar;
