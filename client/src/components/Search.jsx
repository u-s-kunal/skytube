import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";

function Search() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      navigate("/");
      return;
    }

    navigate(
      `/?query=${encodeURIComponent(trimmedQuery)}`,
    );
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full max-w-2xl items-center"
    >
      {/* Search input */}

      <div className="relative flex-1">
        <SearchIcon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
        />

        <input
          type="text"
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Search videos..."
          aria-label="Search videos"
          className="h-11 w-full rounded-full border border-[var(--border)] bg-[var(--background)] pl-11 pr-12 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15"
        />

        {/* Clear search */}

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
          >
            ×
          </button>
        )}
      </div>

      {/* Search button */}

      <button
        type="submit"
        aria-label="Search"
        className="ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white transition hover:bg-[var(--accent-hover)] hover:scale-105 active:scale-95"
      >
        <SearchIcon size={18} />
      </button>
    </form>
  );
}

export default Search;