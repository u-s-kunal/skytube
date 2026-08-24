
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

function Navbar() {
   const { user, isAuthenticated } = useAuth();
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

      <div className="flex items-center gap-3">
  {isAuthenticated ? (
    <Link
      to={`/channel/${user.userName}`}
      className="flex items-center gap-2"
    >
      <img
        src={user.avatar}
        alt={user.userName}
        className="h-9 w-9 rounded-full object-cover"
      />

      <p className="font-medium">
        {user.userName}
      </p>
    </Link>
  ) : (
    <>
      <Link to="/login">
        Login
      </Link>

      <Link to="/register">
        Register
      </Link>
    </>
  )}
</div>
    </nav>
  );
}

export default Navbar;