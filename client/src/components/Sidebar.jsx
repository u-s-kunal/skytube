import { NavLink } from "react-router-dom";

function Sidebar() {
  const links = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Subscriptions",
      path: "/subscriptions",
    },
    {
      name: "Liked Videos",
      path: "/liked-videos",
    },
    {
      name: "Playlists",
      path: "/playlists",
    },
  ];

  return (
    <aside className="w-60 min-h-[calc(100vh-4rem)] border-r p-4">
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 ${
                isActive
                  ? "bg-gray-200 font-semibold"
                  : "hover:bg-gray-100"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;