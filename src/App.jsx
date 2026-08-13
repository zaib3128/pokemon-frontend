import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import PokemonsPage from "./pages/PokemonsPage";
import GamesPage from "./pages/GamesPage";
import AboutPage from "./pages/AboutPage";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pokemons" element={<PokemonsPage />} />
        <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
}

export default App;