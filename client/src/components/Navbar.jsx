import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo ">
       ☁️ SkyTube
      </Link>

      <div className="navbar__search">
        <input
          type="text"
          placeholder="Search videos..."
        />

        <button>
          Search
        </button>
      </div>

      <div className="navbar__actions">
        <Link to="/login">
          Login
        </Link>

        <Link to="/register">
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;