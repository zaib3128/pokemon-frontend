import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

  const login = async (username, password) => {
    const res = await axios.post("/api/auth/login", { username, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const signup = async (username, email, password) => {
  const res = await axios.post("/api/auth/signup", { 
    username, 
    email, 
    password 
  });

  // Store token and user data
  localStorage.setItem("token", res.data.token);
  setUser(res.data.user); // <--- Use res.data.user here
  return res.data;
};

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const toggleFavorite = async (pokemonId) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Please log in first");
    const res = await axios.post(
      `/api/pokemon/favorite/${pokemonId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUser((prev) => ({ ...prev, favorites: res.data.favorites }));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};