import React from "react";
import { useNavigate } from "react-router-dom";
import "./AboutSection.css";

const AboutSection = () => {
  const navigate = useNavigate();

  return (
    <div className="about-section">
      <div className="about-content">
        <h1 className="about-title">ABOUT</h1>

        <p className="about-paragraph">
          A fan-made showcase of the Pokémon we grew up with.
        </p>

        <p className="about-paragraph">
          PokéSlider started as a single draggable slider experiment and grew into a full site.
          Every Pokémon you see is stored in the site's database, so the gallery, the detail pages
          and the guessing game always stay in sync.
        </p>

        <p className="about-paragraph">
          Create an account and you get your own collection: tap the heart on any Pokémon and
          it is saved to your profile, on every device you sign in from.
        </p>

        <p className="about-paragraph">
          Site admins can add, edit and remove Pokémon from the admin panel — new entries
          show up instantly across the whole site.
        </p>

        <div className="about-buttons">
          <button className="btn btn-fill" onClick={() => navigate("/pokemons")}>
            Browse Pokémon
          </button>
          <button className="btn btn-outline" onClick={() => navigate("/games")}>
            Play the game
          </button>
        </div>

        <footer className="footer-notice">
          Pokémon and all related names are trademarks of Nintendo, Game Freak and The Pokémon Company. This is a non-commercial fan project.
        </footer>
      </div>
    </div>
  );
};

export default AboutSection;