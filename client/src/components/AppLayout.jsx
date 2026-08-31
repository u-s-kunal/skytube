import { Outlet } from "react-router-dom";

import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">

      {/* Fixed navbar */}
      <Navbar />

      {/* Everything below navbar */}
      <div className="flex pt-16">

        {/* Sidebar */}
        <Sidebar />

        {/* Page content */}
        <main className="min-w-0 flex-1 pb-20 lg:ml-64 lg:pb-0">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AppLayout;