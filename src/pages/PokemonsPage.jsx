import React, { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./PokemonsPage.css";

const PokemonsPage = () => {
  const { user, toggleFavorite } = useContext(AuthContext);

  const [pokemons, setPokemons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPokemonId, setCurrentPokemonId] = useState(null);

  // ================================
  // FORM STATE
  // ================================

  const [formData, setFormData] = useState({
    name: "",
    img: "",
    description: "",
    background:
      "linear-gradient(135deg, #001020, #002b5c, #8a007a, #000)",
    order: 0,
  });

  // ================================
  // FETCH POKEMONS
  // ================================

  const fetchPokemons = async () => {
    try {
      const res = await api.get("/api/pokemon");

      const sorted = res.data.sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );

      setPokemons(sorted);
    } catch (error) {
      console.error("Error fetching pokemons:", error);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  // ================================
  // HANDLE INPUT CHANGE
  // ================================

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================================
  // ADD POKEMON
  // ================================

  const handleAddClick = () => {
    if (!user) {
      alert("Please log in to add a Pokémon.");
      return;
    }

    setShowForm(true);
    setEditMode(false);
    setCurrentPokemonId(null);

    setFormData({
      name: "",
      img: "",
      description: "",
      background:
        "linear-gradient(135deg, #001020, #002b5c, #8a007a, #000)",
      order: 0,
    });
  };

  // ================================
  // EDIT POKEMON
  // ================================

  const handleEditClick = (pokemon) => {
    setShowForm(true);
    setEditMode(true);
    setCurrentPokemonId(pokemon._id);

    setFormData({
      name: pokemon.name || "",
      img: pokemon.img || "",
      description: pokemon.description || "",
      background:
        pokemon.background ||
        "linear-gradient(135deg, #001020, #002b5c, #8a007a, #000)",
      order: pokemon.order || 0,
    });
  };

  // ================================
  // DELETE POKEMON
  // ================================

  const handleDelete = async (id) => {
    if (!user) {
      alert("Please log in first.");
      return;
    }

    const token =
      user?.token || localStorage.getItem("token");

    if (!token) {
      alert(
        "Authentication token missing. Please log out and log in again."
      );
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Pokémon?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/api/pokemon/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchPokemons();
    } catch (err) {
      console.error("Delete error:", err.response);

      alert(
        err.response?.data?.message ||
          "Error deleting Pokémon"
      );
    }
  };

  // ================================
  // ADD / UPDATE POKEMON
  // ================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve token from user object or localStorage
    const token =
      user?.token || localStorage.getItem("token");

    if (!token) {
      alert(
        "Authentication token missing. Please log out and log in again."
      );
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      if (editMode) {
        await api.put(
          `/api/pokemon/${currentPokemonId}`,
          formData,
          config
        );
      } else {
        await api.post(
          "/api/pokemon",
          formData,
          config
        );
      }

      // Close form
      setShowForm(false);
      setEditMode(false);
      setCurrentPokemonId(null);

      // Refresh list
      await fetchPokemons();
    } catch (err) {
      console.error("Error response:", err.response);

      alert(
        err.response?.data?.message ||
          "Error saving Pokémon"
      );
    }
  };

  // ================================
  // CANCEL FORM
  // ================================

  const handleCancel = () => {
    setShowForm(false);
    setEditMode(false);
    setCurrentPokemonId(null);

    setFormData({
      name: "",
      img: "",
      description: "",
      background:
        "linear-gradient(135deg, #001020, #002b5c, #8a007a, #000)",
      order: 0,
    });
  };

  // ================================
  // RENDER
  // ================================

  return (
    <div className="pokemons-page-wrapper">

      {/* =================================
          HEADER
      ================================= */}

      <div className="pokemons-header">
        <h1>Pokémons</h1>

        <p>
          {pokemons.length} Pokémon in the Pokédex. Tap a
          card to read the full story.
        </p>

        {!showForm && (
          <button
            className="add-pokemon-btn"
            onClick={handleAddClick}
          >
            Add a Pokémon
          </button>
        )}
      </div>

      {/* =================================
          FORM
      ================================= */}

      {showForm ? (
        <div className="pokemon-form-container">

          <form
            onSubmit={handleSubmit}
            className="pokemon-form"
          >

            {/* NAME */}

            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter Pokémon name"
                required
              />
            </div>

            {/* IMAGE */}

            <div className="form-group">
              <label>Image URL</label>

              <input
                type="text"
                name="img"
                value={formData.img}
                onChange={handleInputChange}
                placeholder="Enter image URL"
                required
              />
            </div>

            {/* DESCRIPTION */}

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter Pokémon description"
                required
                rows="4"
              />
            </div>

            {/* BACKGROUND */}

            <div className="form-group">
              <label>
                Background gradient (CSS)
              </label>

              <input
                type="text"
                name="background"
                value={formData.background}
                onChange={handleInputChange}
                placeholder="linear-gradient(...)"
              />
            </div>

            {/* ORDER */}

            <div className="form-group">
              <label>Display order</label>

              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
              />
            </div>

            {/* FORM BUTTONS */}

            <div className="form-actions">

              <button
                type="submit"
                className="submit-btn"
              >
                {editMode
                  ? "Update Pokémon"
                  : "Add Pokémon"}
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      ) : (

        /* =================================
           HORIZONTAL POKEMON LIST
        ================================= */

        <div className="pokemons-list">

          {pokemons.map((pokemon) => {

            // Check favorite
            const isFav =
              user?.favorites?.includes(
                pokemon._id
              );

            // Get logged-in user's ID
            const loggedInUserId =
              user?._id || user?.id;

            /*
             * creator can either be:
             *
             * "USER_ID"
             *
             * OR:
             *
             * {
             *   _id: "USER_ID"
             * }
             */

            const creatorId =
              typeof pokemon.creator === "object"
                ? pokemon.creator?._id
                : pokemon.creator;

            // OWNER AUTHORIZATION CHECK
            const isOwner =
              user &&
              loggedInUserId &&
              creatorId &&
              String(creatorId) ===
                String(loggedInUserId);

            return (
              <div
                key={pokemon._id}
                className="pokemon-horizontal-card"
                style={{
                  background:
                    pokemon.background,
                }}
              >

                {/* ============================
                    LEFT SIDE - IMAGE
                ============================ */}

                <div className="pokemon-image-wrapper">

                  <img
                    src={pokemon.img}
                    alt={pokemon.name}
                  />

                </div>

                {/* ============================
                    MIDDLE - CONTENT
                ============================ */}

                <div className="pokemon-content">

                  <h2 className="pokemon-name">
                    {pokemon.name}
                  </h2>

                  <p className="pokemon-desc">
                    {pokemon.description
                      ? pokemon.description.length >
                        120
                        ? pokemon.description.substring(
                            0,
                            120
                          ) + "..."
                        : pokemon.description
                      : "No description available."}
                  </p>

                  {/* FAVORITE BUTTON */}

                  <button
                    className={`fav-btn-square ${
                      isFav ? "active" : ""
                    }`}
                    onClick={() =>
                      toggleFavorite(
                        pokemon._id
                      )
                    }
                  >
                    ♡{" "}
                    {isFav
                      ? "Remove from favorites"
                      : "Add to favorites"}
                  </button>

                </div>

                {/* ============================
                    RIGHT SIDE - OWNER ACTIONS
                ============================ */}

                {isOwner && (
                  <div className="owner-actions-right">

                    <button
                      className="action-btn-pill"
                      onClick={() =>
                        handleEditClick(
                          pokemon
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="action-btn-pill"
                      onClick={() =>
                        handleDelete(
                          pokemon._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default PokemonsPage;