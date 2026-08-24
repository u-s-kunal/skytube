import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

function MainLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;