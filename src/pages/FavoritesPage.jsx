import React, { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./FavoritesPage.css";

const FALLBACK_IMAGE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png";

const FavoritesPage = () => {
  const { user, toggleFavorite } = useContext(AuthContext);
  const [allPokemons, setAllPokemons] = useState([]);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const res = await api.get("/api/pokemon");
        setAllPokemons(res.data);
      } catch (error) {
        console.error("Error fetching pokemons:", error);
      }
    };
    fetchPokemons();
  }, []);

  // Filter dynamically so removing a favorite updates the UI instantly
  const favoritePokemons = allPokemons.filter((pokemon) =>
    user?.favorites?.includes(pokemon._id)
  );

  if (!user) {
    return (
      <div className="favorites-page-wrapper">
        <h2 className="login-prompt">Please log in to view your collection.</h2>
      </div>
    );
  }

  return (
    <div className="favorites-page-wrapper">
      <div className="favorites-header">
        <h1>MY COLLECTION</h1>
        <p>{favoritePokemons.length} Pokémon saved.</p>
      </div>

      <div className="favorites-grid">
        {favoritePokemons.map((pokemon) => (
          <div
            key={pokemon._id}
            className="fav-pokemon-card"
            style={{ background: pokemon.background || "linear-gradient(135deg, #a67c00, #bf953f)" }}
          >
            <img
              src={pokemon.img}
              alt={pokemon.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMAGE;
              }}
            />
            <h2 className="fav-pokemon-name">{pokemon.name}</h2>
            
            <button
              className="fav-remove-btn"
              onClick={() => toggleFavorite(pokemon._id)}
            >
              ♥ Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;