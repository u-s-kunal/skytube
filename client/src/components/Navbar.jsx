import { Link } from "react-router-dom";
import {
  LogIn,
  LogOut,
  Moon,
  Sun,
  User,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth.js";
import { useTheme } from "../context/ThemeContext.jsx";
import Search from "./Search.jsx";

function Navbar() {
  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const {
    theme,
    toggleTheme,
  } = useTheme();

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md">

      {/* ==================================================
          TOP NAVBAR
      ================================================== */}

      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-3 px-4 sm:px-6">

        {/* ==============================
            LOGO
        ============================== */}

        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-sm transition duration-200 group-hover:scale-105 group-hover:bg-[var(--accent-hover)]">
            <span className="text-sm font-bold">
              S
            </span>
          </div>

          <span className="hidden text-lg font-bold tracking-tight text-[var(--text-primary)] sm:block">
            Sky
            <span className="text-[var(--accent)]">
              Tube
            </span>
          </span>
        </Link>

        {/* ==============================
            DESKTOP SEARCH
        ============================== */}

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <Search />
        </div>

        {/* ==============================
            RIGHT ACTIONS
        ============================== */}

        <div className="ml-auto flex shrink-0 items-center gap-2">

          {/* Theme toggle */}

          <button
            type="button"
            onClick={toggleTheme}
            title={
              theme === "light"
                ? "Switch to dark mode"
                : "Switch to light mode"
            }
            aria-label={
              theme === "light"
                ? "Switch to dark mode"
                : "Switch to light mode"
            }
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
          >
            {theme === "light" ? (
              <Moon size={19} />
            ) : (
              <Sun size={19} />
            )}
          </button>

          {/* ==============================
              AUTHENTICATED
          ============================== */}

          {isAuthenticated ? (
            <div className="flex items-center gap-2">

              <Link
                to={`/channel/${user.userName}`}
                title="Your channel"
                className="flex items-center gap-2 rounded-full p-1 pr-2 transition hover:bg-[var(--surface-hover)]"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.userName}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-transparent transition"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                    <User size={18} />
                  </div>
                )}

                <span className="hidden max-w-28 truncate text-sm font-medium text-[var(--text-primary)] md:block">
                  {user.userName}
                </span>
              </Link>

              {/* Logout */}

              <button
                type="button"
                onClick={logout}
                title="Logout"
                aria-label="Logout"
                className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--text-secondary)] transition hover:bg-red-50 hover:text-[var(--danger)] dark:hover:bg-red-950/30"
              >
                <LogOut size={18} />
              </button>

            </div>
          ) : (
            <div className="flex items-center gap-2">

              {/* Login */}

              <Link
                to="/login"
                className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-hover)] sm:flex"
              >
                <LogIn size={17} />
                Login
              </Link>

              {/* Register */}

              <Link
                to="/register"
                className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
              >
                Register
              </Link>

            </div>
          )}

        </div>

      </div>

      {/* ==================================================
          MOBILE SEARCH
      ================================================== */}

      <div className="border-t border-[var(--border)] px-4 py-3 md:hidden">
        <Search />
      </div>

    </nav>
  );
}

export default Navbar;