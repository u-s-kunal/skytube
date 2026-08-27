import { Outlet } from "react-router-dom";

import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="min-w-0 flex-1 pb-20 lg:ml-64 lg:pb-0">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AppLayout;