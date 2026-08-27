import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

function AuthLayout() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;