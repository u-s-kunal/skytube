import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

function MainLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--text-primary)]">

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <Navbar />

      {/* ==================================================
          APPLICATION AREA
      ================================================== */}

      <div className="flex min-h-[calc(100vh-4rem)]">

        {/* ==================================================
            SIDEBAR

            Desktop:
            Sidebar is fixed/visible.

            Mobile:
            Sidebar component will provide bottom
            navigation instead.
        ================================================== */}

        <Sidebar />

        {/* ==================================================
            PAGE CONTENT
        ================================================== */}

        <main
          className="
            min-w-0
            flex-1
            pb-20
            lg:ml-64
            lg:pb-0
          "
        >
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default MainLayout;