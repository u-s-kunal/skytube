import { LoaderCircle } from "lucide-react";

function LoadingScreen({
  message = "Starting SkyTube...",
}) {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-[var(--background)] px-4">

      <div className="flex w-full max-w-sm flex-col items-center text-center">

        {/* Logo */}

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20 sm:h-18 sm:w-18">
          <span className="text-2xl font-bold tracking-tight sm:text-3xl">
            S
          </span>
        </div>

        {/* Brand */}

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          Sky
          <span className="text-[var(--accent)]">
            Tube
          </span>
        </h1>

        {/* Message */}

        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {message}
        </p>

        {/* Loading indicator */}

        <div className="mt-6 flex items-center gap-2">

          <LoaderCircle
            size={20}
            className="animate-spin text-[var(--accent)]"
          />

          <span className="text-xs font-medium text-[var(--text-muted)]">
            Please wait
          </span>

        </div>

      </div>

    </main>
  );
}

export default LoadingScreen;