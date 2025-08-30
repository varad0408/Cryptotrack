import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Only this line changed — added /api/
      const res = await api.post("/api/auth/register", { username, email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Registration failed. A user with this email may already exist.");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth: '400px', margin: '3rem auto'}}>
        <h3 style={{textAlign: 'center', fontSize: '1.8rem', marginBottom: '1.5rem'}}>Create Account</h3>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required style={{width: '100%', marginBottom: '1rem', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.8rem 1rem', borderRadius: '8px'}} />
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required style={{width: '100%', marginBottom: '1rem', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.8rem 1rem', borderRadius: '8px'}} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{width: '100%', marginBottom: '1rem', background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.8rem 1rem', borderRadius: '8px'}} />
            <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>Create Account</button>
        </form>
        <p style={{textAlign: 'center', marginTop: '1.5rem'}}>
          Already have an account?{" "}
          <Link to="/login" style={{color: 'var(--accent)'}}>Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
