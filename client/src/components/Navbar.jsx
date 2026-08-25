
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

function Navbar() {
  const {
  user,
  isAuthenticated,
  logout,
  } = useAuth();
  
  
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
  <div className="flex items-center gap-3">
    <Link
      to={`/channel/${user.userName}`}
      className="flex items-center gap-2"
    >
      <img
        src={user.avatar}
        alt={user.userName}
        className="h-9 w-9 rounded-full object-cover"
      />

      <span className="font-medium">
        {user.userName}
      </span>
    </Link>

    <button
      onClick={logout}
      className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
    >
      Logout
    </button>
  </div>
) : (
  <>
    <Link to="/login">
      Login
    </Link>

    <Link
      to="/register"
      className="rounded-lg bg-black px-4 py-2 text-white"
    >
      Register
    </Link>
  </>
)}
</div>
    </nav>
  );
}

export default Navbar;