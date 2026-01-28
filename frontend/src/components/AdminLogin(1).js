import React, { useState } from "react";

export default function AdminLogin({ onAdminLogin, onBackToLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please enter both email and password!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert("Error: " + (data.message || "Login failed"));
        setLoading(false);
        return;
      }

      // Check if user is admin
      if (data.user.role !== "admin") {
        alert("Error: Only admins can access this page");
        setLoading(false);
        return;
      }

      // Save token to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Admin Login Successful!");
      onAdminLogin(); // go to Admin Dashboard
      setLoading(false);
    } catch (error) {
      alert("Error: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Admin Login"}
        </button>
      </form>
      <p>
        Back to user login?{" "}
        <button type="button" onClick={onBackToLogin}>
          Login
        </button>
      </p>
    </div>
  );
}