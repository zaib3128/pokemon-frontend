import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./AuthForm.css";

const AuthForm = ({ type }) => {
  const { login, signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (type === "login") {
        await login(username, password);
      } else {
        await signup(username, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{type === "login" ? "Welcome Back!" : "Join the Adventure!"}</h2>
        {error && <p className="error-msg">{error}</p>}
        
        <input 
          type="text" 
          placeholder="Trainer Name" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        <button type="submit" className="auth-btn">
          {type === "login" ? "Login" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;