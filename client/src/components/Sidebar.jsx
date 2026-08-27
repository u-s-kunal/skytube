import {
  Home,
  Users,
  MessageSquare,
  Heart,
  ListVideo,
  MoreHorizontal,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
  const primaryLinks = [
    {
      name: "Home",
      path: "/",
      icon: Home,
    },
    {
      name: "Subscriptions",
      path: "/subscriptions",
      icon: Users,
    },
    {
      name: "Tweets",
      path: "/tweets",
      icon: MessageSquare,
    },
    {
      name: "Liked Videos",
      path: "/liked-videos",
      icon: Heart,
    },
    {
      name: "Playlists",
      path: "/playlists",
      icon: ListVideo,
    },
  ];

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-64 border-r border-[var(--border)] bg-[var(--surface)] lg:block">

        <nav className="flex flex-col gap-1 p-4">

          {primaryLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                  }`
                }
              >
                <Icon size={19} />

                <span>
                  {link.name}
                </span>
              </NavLink>
            );
          })}

        </nav>

      </aside>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ===================================================== */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--surface)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">

        <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">

          {primaryLinks.slice(0, 4).map(
            (link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={
                    link.path === "/"
                  }
                  className={({ isActive }) =>
                    `flex min-w-16 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-medium transition ${
                      isActive
                        ? "text-[var(--accent)]"
                        : "text-[var(--text-muted)]"
                    }`
                  }
                >
                  <Icon size={20} />

                  <span>
                    {link.name ===
                    "Subscriptions"
                      ? "Subs"
                      : link.name ===
                        "Liked Videos"
                        ? "Liked"
                        : link.name}
                  </span>
                </NavLink>
              );
            },
          )}

          {/* More */}

          <NavLink
            to="/playlists"
            className={({ isActive }) =>
              `flex min-w-16 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-medium transition ${
                isActive
                  ? "text-[var(--accent)]"
                  : "text-[var(--text-muted)]"
              }`
            }
          >
            <MoreHorizontal size={20} />

            <span>More</span>
          </NavLink>

        </div>

      </nav>
    </>
  );
}

export default Sidebar;