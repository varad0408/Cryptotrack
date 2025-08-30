// src/pages/Login.jsx
import React, { useState } from "react";
import api from "../services/api";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ stops browser reload

    try {
      const res = await api.post("/auth/login", formData);

      // ✅ Save token for authenticated requests
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setMessage("Login successful!");
      } else {
        setMessage("Login successful, but no token received.");
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
