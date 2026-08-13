import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./AuthModal.css";

const AuthModal = ({ type, onClose }) => {
  const { login, signup } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(type === "login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await signup(username, email, password);
      }
      onClose(); // Close modal on success
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    // Clicking the dark backdrop closes the modal
    <div className="modal-backdrop" onClick={onClose}>
      {/* stopPropagation prevents clicks inside the card from closing it */}
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Close (X) Button */}
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>

        <h2 className="modal-title">
          {isLogin ? "WELCOME BACK" : "CREATE ACCOUNT"}
        </h2>

        {error && <p className="modal-error">{error}</p>}

        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            placeholder="Trainer Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {!isLogin && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="modal-submit-btn">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="modal-toggle-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Log In"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;