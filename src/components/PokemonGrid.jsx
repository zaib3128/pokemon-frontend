import React, { useEffect, useState } from "react";
import "./PokemonGrid.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PokemonGrid = () => {
  const [pokemons, setPokemons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const res = await axios.get("/api/pokemon");
        setPokemons(res.data);
      } catch (error) {
        console.error("Failed to fetch Pokémon:", error);
      }
    };

    fetchPokemons();
  }, []);

  return (
    <div className="pokemons-section" id="pokemons">
      <div className="section-header">
        <h1 className="pokedex-title">Pokémons</h1>

        <p className="pokedex-subtitle">
          {pokemons.length} Pokémon in the Pokédex. Tap a card to read the full
          story.
        </p>
      </div>

      <div className="grid-container">
        {pokemons.map((pokemon) => (
          <div
            className="pokemon-grid-card"
            key={pokemon._id}
            onClick={() => navigate(`/pokemon/${pokemon._id}`)}
            style={{ cursor: "pointer" }}
          >
            <div
              className="pokedex-card"
              style={{ background: pokemon.background }}
            >
              <div className="card-img-wrapper">
                <img
                  src={pokemon.img}
                  alt={pokemon.name}
                />
              </div>

              <h2 className="card-name">
                {pokemon.name?.toUpperCase()}
              </h2>

              <p className="card-excerpt">
                {pokemon.description
                  ? `${pokemon.description.slice(0, 100)}...`
                  : "No description available."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonGrid;