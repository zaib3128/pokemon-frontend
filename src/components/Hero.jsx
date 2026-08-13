import React, { useEffect, useState } from "react";
import "./Hero.css";

 import api from "../api/axios";

const FALLBACK_IMG = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png";

const Hero = () => {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    api.get("/api/pokemon").then((res) => setPokemons(res.data));
  }, []);

  const heroImages = pokemons.length
    ? pokemons.map((p) => p.heroImg || p.img)
    : [];

  const repeatedList = [...heroImages, ...heroImages];

  return (
    <div className="hero" id="home">
      <motion.div
        className="pokemon-slider"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          ease: "linear",
          duration: 15,
          repeat: Infinity,
        }}
      >
        {repeatedList.map((src, i) => (
          <div className="pokemon-card" key={i}>
            <img 
              src={src} 
              alt={`Pokemon ${i + 1}`} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMG;
              }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Hero;