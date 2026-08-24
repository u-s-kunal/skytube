import { useState } from "react";
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = new FormData();

      data.append("fullName", formData.fullName);
      data.append("userName", formData.userName);
      data.append("email", formData.email);
      data.append("password", formData.password);

      if (avatar) {
        data.append("avatar", avatar);
      }

      if (coverImage) {
        data.append("coverImage", coverImage);
      }

      await registerUser(data);

      setSuccess("Registration successful");

      setFormData({
        fullName: "",
        userName: "",
        email: "",
        password: "",
      });

      setAvatar(null);
      setCoverImage(null);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl border p-6 shadow-sm"
      >
        <div>
          <h1 className="text-2xl font-bold">
            Create your SkyTube account
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Register to start using SkyTube.
          </p>
        </div>

        <input
          name="fullName"
          type="text"
          placeholder="Full name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
          required
        />

        <input
          name="userName"
          type="text"
          placeholder="Username"
          value={formData.userName}
          onChange={handleChange}
          className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
          required
        />

        <div>
          <label className="mb-2 block text-sm font-medium">
            Avatar
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Cover image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-green-600">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );
}

export default Register;