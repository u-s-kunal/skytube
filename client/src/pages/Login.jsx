import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

import { loginUser } from "../api/auth.api.js";
import { useAuth } from "../hooks/useAuth.js";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================================================
  // INPUT
  // =========================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response =
        await loginUser(formData);

      console.log(
        "Login response:",
        response,
      );

      login(
        response.data.user,
        response.data.accessToken,
      );

      navigate("/");
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 sm:py-12">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]"
      >

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="border-b border-[var(--border)] p-6 text-center sm:p-8">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <LogIn size={25} />
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Welcome back
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Login to your SkyTube account.
          </p>
        </div>

        {/* =====================================================
            FORM
        ===================================================== */}

        <div className="space-y-5 p-6 sm:p-8">

          {/* Email */}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
            >
              Email
            </label>

            <div className="relative">
              <Mail
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] py-3 pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
                required
              />
            </div>
          </div>

          {/* Password */}

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
            >
              Password
            </label>

            <div className="relative">
              <Lock
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />

              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] py-3 pl-11 pr-12 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev,
                  )
                }
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          </div>

          {/* ===================================================
              ERROR
          =================================================== */}

          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-4 py-3">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0 text-[var(--danger)]"
              />

              <p className="text-sm leading-5 text-[var(--danger)]">
                {error}
              </p>
            </div>
          )}

          {/* ===================================================
              LOGIN BUTTON
          =================================================== */}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />

                Logging in...
              </>
            ) : (
              <>
                <LogIn size={17} />

                Login
              </>
            )}
          </button>

          {/* ===================================================
              REGISTER
          =================================================== */}

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-[var(--surface)] px-3 text-xs text-[var(--text-muted)]">
                New to SkyTube?
              </span>
            </div>
          </div>

          <Link
            to="/register"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--surface-hover)] active:scale-[0.99]"
          >
            <UserPlus size={17} />

            Create an account
          </Link>

        </div>
      </form>
    </main>
  );
}

export default Login;