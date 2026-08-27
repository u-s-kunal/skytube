import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  ImagePlus,
  Image,
  Eye,
  EyeOff,
  Upload,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import { registerUser } from "../api/auth.api.js";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [avatarPreview, setAvatarPreview] =
    useState("");

  const [coverPreview, setCoverPreview] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // FORM INPUT
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
  // AVATAR
  // =========================================================

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0] || null;

    setAvatar(file);

    if (file) {
      setAvatarPreview(
        URL.createObjectURL(file),
      );
    } else {
      setAvatarPreview("");
    }
  };

  // =========================================================
  // COVER IMAGE
  // =========================================================

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0] || null;

    setCoverImage(file);

    if (file) {
      setCoverPreview(
        URL.createObjectURL(file),
      );
    } else {
      setCoverPreview("");
    }
  };

  // =========================================================
  // CLEANUP IMAGE PREVIEWS
  // =========================================================

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }

      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [avatarPreview, coverPreview]);

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!avatar) {
      setError(
        "Please select a profile picture.",
      );
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append(
        "fullName",
        formData.fullName.trim(),
      );

      data.append(
        "userName",
        formData.userName.trim(),
      );

      data.append(
        "email",
        formData.email.trim(),
      );

      data.append(
        "password",
        formData.password,
      );

      data.append("avatar", avatar);

      if (coverImage) {
        data.append(
          "coverImage",
          coverImage,
        );
      }

      await registerUser(data);

      setSuccess(
        "Registration successful. You can now log in.",
      );

      setFormData({
        fullName: "",
        userName: "",
        email: "",
        password: "",
      });

      setAvatar(null);
      setCoverImage(null);
      setAvatarPreview("");
      setCoverPreview("");
      setShowPassword(false);
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 sm:py-12">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]"
      >

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="border-b border-[var(--border)] p-6 text-center sm:p-8">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <UserPlus size={25} />
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Create your SkyTube account
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
            Join SkyTube and start sharing
            your videos with the world.
          </p>
        </div>

        {/* =====================================================
            ACCOUNT INFORMATION
        ===================================================== */}

        <div className="space-y-5 p-6 sm:p-8">

          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Account information
            </h2>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Set up the basic information
              for your account.
            </p>
          </div>

          {/* Full name */}

          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
            >
              Full name
            </label>

            <div className="relative">
              <User
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />

              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] py-3 pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
                required
              />
            </div>
          </div>

          {/* Username */}

          <div>
            <label
              htmlFor="userName"
              className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
            >
              Username
            </label>

            <div className="flex overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] transition focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/10">

              <span className="flex items-center px-4 text-sm font-medium text-[var(--text-muted)]">
                @
              </span>

              <input
                id="userName"
                name="userName"
                type="text"
                placeholder="johndoe"
                value={formData.userName}
                onChange={handleChange}
                className="w-full bg-transparent py-3 pr-4 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                required
              />
            </div>
          </div>

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
                placeholder="Create a password"
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
              PROFILE APPEARANCE
          =================================================== */}

          <div className="border-t border-[var(--border)] pt-6">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <ImagePlus size={19} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                  Profile appearance
                </h2>

                <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                  Add your profile picture
                  and optional cover image.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">

              {/* Avatar */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Profile picture
                </label>

                <label
                  htmlFor="avatar"
                  className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background)] p-4 transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-[var(--border)]"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--surface-hover)] text-[var(--text-muted)]">
                      <User size={23} />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                      {avatar
                        ? avatar.name
                        : "Choose profile picture"}
                    </p>

                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      JPG, PNG or WEBP
                    </p>
                  </div>

                  <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] sm:flex">
                    <Upload size={13} />
                    Browse
                  </span>

                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={
                      handleAvatarChange
                    }
                    className="hidden"
                    required
                  />
                </label>
              </div>

              {/* Cover */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Cover image
                  <span className="ml-1 font-normal text-[var(--text-muted)]">
                    (optional)
                  </span>
                </label>

                <label
                  htmlFor="coverImage"
                  className="group block cursor-pointer overflow-hidden rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background)] transition hover:border-[var(--accent)]"
                >
                  {coverPreview && (
                    <div className="relative aspect-[3/1] overflow-hidden">
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                        <span className="flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-xs font-semibold text-white">
                          <Upload size={14} />
                          Change image
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-hover)] text-[var(--text-muted)]">
                        <Image size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                          {coverImage
                            ? coverImage.name
                            : "Choose cover image"}
                        </p>

                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                          JPG, PNG or WEBP
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)]">
                      Browse
                    </span>
                  </div>

                  <input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={
                      handleCoverChange
                    }
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* ===================================================
              MESSAGES
          =================================================== */}

          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-4 py-3">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0 text-[var(--danger)]"
              />

              <p className="text-sm text-[var(--danger)]">
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 rounded-2xl border border-[var(--success)]/20 bg-[var(--success)]/10 px-4 py-3">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-[var(--success)]"
              />

              <p className="text-sm text-[var(--success)]">
                {success}
              </p>
            </div>
          )}

          {/* ===================================================
              SUBMIT
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
                Creating account...
              </>
            ) : (
              <>
                <UserPlus size={17} />
                Create account
              </>
            )}
          </button>

          {/* ===================================================
              LOGIN
          =================================================== */}

          <p className="text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-[var(--accent)] transition hover:text-[var(--accent-hover)]"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}

export default Register;