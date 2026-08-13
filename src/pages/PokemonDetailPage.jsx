import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./PokemonDetailPage.css";

const PokemonDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleFavorite } = useContext(AuthContext);

  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/pokemon/${id}`)
      .then((res) => {
        setPokemon(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching pokemon:", err);
        setLoading(false);
      });
  }, [id]);

  // 1. Guard against null rendering during network loading
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!pokemon) return <div className="loading-screen">Pokémon not found!</div>;

  // 2. Safe to access pokemon properties now
  const isFav = user?.favorites?.includes(pokemon._id);

  const handleSave = async () => {
    if (!user) {
      alert("Please log in to save Pokémon!");
      return;
    }
    try {
      await toggleFavorite(pokemon._id);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Error saving favorite");
    }
  };

  return (
    <div
      className="pokemon-detail-container"
      style={{ background: pokemon.background || "linear-gradient(135deg, #4a2f1d, #b88645)" }}
    >
      <div className="detail-content">
        <button className="back-btn" onClick={() => navigate("/pokemons")}>
          &larr; Back to all Pokémon
        </button>

        <div className="detail-layout">
          <div className="detail-image-wrapper">
            <img src={pokemon.img} alt={pokemon.name} className="detail-image" />
          </div>

          <div className="detail-info">
            <h1 className="detail-title">{pokemon.name}</h1>
            <p className="detail-description">{pokemon.description}</p>

            {user ? (
              <button
                className={`save-btn ${isFav ? "saved" : ""}`}
                onClick={handleSave}
              >
                {isFav ? "Saved to Favorites" : "Save this Pokémon"}
              </button>
            ) : (
              <button className="save-btn outline" onClick={() => alert("Please log in first!")}>
                Sign in to save this Pokémon
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailPage;