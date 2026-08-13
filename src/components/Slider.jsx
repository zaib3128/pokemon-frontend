import React, { useState, useEffect, useContext } from "react";
import "./Slider.css";
import { FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Slider = () => {
  const [pokemons, setPokemons] = useState([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  
  // Pulling user state and the toggle function from AuthContext
  const { user, toggleFavorite } = useContext(AuthContext);

  useEffect(() => {
    axios.get("/api/pokemon").then((res) => setPokemons(res.data));
  }, []);

  if (!pokemons.length) return null;

  const currentPokemon = pokemons[index];
  
  // Check if the current Pokémon's ID is in the user's favorites array
  const isFav = user?.favorites?.includes(currentPokemon._id);

  const handlePrev = () => {
    setDirection("prev");
    setIndex((prev) => (prev - 1 + pokemons.length) % pokemons.length);
  };

  const handleNext = () => {
    setDirection("next");
    setIndex((prev) => (prev + 1) % pokemons.length);
  };

  const handleFavoriteClick = async () => {
    if (!user) {
      alert("Please log in to add Pokémon to your favorites!");
      return;
    }
    try {
      await toggleFavorite(currentPokemon._id);
    } catch (err) {
      alert("Something went wrong while saving.");
    }
  };

  return (
    <div className="slider-section" style={{ background: currentPokemon.background }}>
      <div className="slider-container">
        
        {/* Left Side: 3D Image Carousel */}
        <div className="slider-images">
          {pokemons.map((pokemon, i) => {
            const offset = (i - index + pokemons.length) % pokemons.length;
            let x = 0, y = 0, scale = 1, opacity = 1, blur = "none", zIndex = 1;

            if (offset === 0) {
              x = 0; y = 0; scale = 1.1; opacity = 1; blur = "none"; zIndex = 3;
            } else if (offset === 1) {
              x = 220; y = -90; scale = 0.85; opacity = 0.4; blur = "blur(3px)"; zIndex = 2;
            } else if (offset === pokemons.length - 1) {
              x = -290; y = 200; scale = 0.65; opacity = 0.4; blur = "blur(6px)"; zIndex = 2;
            } else {
              x = 0; y = 0; scale = 0.9; opacity = 0; blur = "blur(10px)"; zIndex = 0;
            }

            return (
              <img
                key={pokemon._id}
                src={pokemon.img}
                alt={pokemon.name}
                className="slider-pokemon-img"
                style={{
                  transform: `translate(${x}px, ${y}px) scale(${scale})`,
                  opacity,
                  filter: blur,
                  zIndex,
                }}
              />
            );
          })}
        </div>

        {/* Right Side: Info, Favorite Button, and Arrows */}
        <div className="slider-info-wrapper">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              className="slider-info"
              custom={direction}
              initial={{ y: direction === "next" ? -50 : 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: direction === "next" ? 50 : -50, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <p className="description-text">{currentPokemon.description}</p>

              <button 
                className={`btn-favorite ${isFav ? "favorited" : ""}`} 
                onClick={handleFavoriteClick}
              >
                {isFav ? <FaHeart color="#ff4d4d" /> : <FaRegHeart />}
                <span>{isFav ? "Favorited" : "Add to favorites"}</span>
              </button>
            </motion.div>
          </AnimatePresence>

          {/* Backward and Forward Navigation Arrows */}
          <div className="slider-arrows">
            <button className="arrow-btn" onClick={handlePrev}>
              <FaChevronLeft size={18} />
            </button>
            <button className="arrow-btn" onClick={handleNext}>
              <FaChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Slider;