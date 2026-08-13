import React, { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./AdminPage.css";

const FALLBACK_IMAGE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png";

const AdminPage = () => {
  const { user } = useContext(AuthContext);
  const [pokemons, setPokemons] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    img: "",
    description: "",
    background: "linear-gradient(135deg, #001020, #002b5c)",
    order: 0,
  });

  const fetchPokemons = async () => {
    try {
      const res = await api.get("api/pokemon");
      const sorted = res.data.sort((a, b) => (a.order || 0) - (b.order || 0));
      setPokemons(sorted);
    } catch (err) {
      console.error("Error fetching pokemons:", err);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (pokemon) => {
    setEditingId(pokemon._id);
    setFormData({
      name: pokemon.name,
      img: pokemon.img,
      description: pokemon.description,
      background: pokemon.background || "linear-gradient(135deg, #001020, #002b5c)",
      order: pokemon.order || 0,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: "",
      img: "",
      description: "",
      background: "linear-gradient(135deg, #001020, #002b5c)",
      order: 0,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Pokémon?")) {
      const token = user?.token || localStorage.getItem("token");
      try {
        await api.delete(`api/pokemon/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (editingId === id) handleCancel();
        fetchPokemons();
      } catch (err) {
        alert(err.response?.data?.message || "Error deleting Pokémon");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = user?.token || localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (editingId) {
        await api.put(`api/pokemon/${editingId}`, formData, config);
      } else {
        await api.post("api/pokemon", formData, config);
      }
      handleCancel();
      fetchPokemons();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving Pokémon");
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="admin-page-wrapper">
        <h2 className="admin-access-denied">Access Denied. Admin privileges required.</h2>
      </div>
    );
  }

  return (
    <div className="admin-page-wrapper">
      <div className="admin-header">
        <h1>ADMIN</h1>
        <p>Add, edit and remove the Pokémon shown across the site.</p>
      </div>

      <div className="admin-grid-layout">
        {/* LEFT COLUMN: FORM */}
        <div className="admin-card-box">
          <h2 className="box-title">{editingId ? "Edit Pokémon" : "New Pokémon"}</h2>
          
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="admin-form-group">
              <label>Image URL</label>
              <input
                type="text"
                name="img"
                placeholder="https://.../pikachu.png"
                value={formData.img}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="admin-form-group">
              <label>Description</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="admin-form-group">
              <label>Background gradient (CSS)</label>
              <input
                type="text"
                name="background"
                value={formData.background}
                onChange={handleInputChange}
              />
            </div>

            <div className="admin-form-group">
              <label>Display order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
              />
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="admin-blue-btn">
                {editingId ? "Save Changes" : "Add Pokémon"}
              </button>
              {editingId && (
                <button type="button" className="admin-outline-btn" onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: POKÉDEX LIST */}
        <div className="admin-card-box">
          <h2 className="box-title">Pokédex ({pokemons.length})</h2>

          <div className="admin-pokedex-list">
            {pokemons.map((pokemon) => (
              <div key={pokemon._id} className="admin-list-row">
                <div className="row-left">
                  <img
                    src={pokemon.img}
                    alt={pokemon.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                  <span className="pokemon-row-name">{pokemon.name}</span>
                </div>

                <div className="row-actions">
                  <button className="admin-pill-btn" onClick={() => handleEdit(pokemon)}>
                    Edit
                  </button>
                  <button className="admin-pill-btn" onClick={() => handleDelete(pokemon._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;