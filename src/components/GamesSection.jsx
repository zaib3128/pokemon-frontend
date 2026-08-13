import React, { useState, useEffect } from "react";
 import api from "../api/axios";
import "./GamesSection.css";

const GamesSection = () => {
  const [pokemons, setPokemons] = useState([]);
  const [targetPokemon, setTargetPokemon] = useState(null);
  const [options, setOptions] = useState([]);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);

  // Fetch Pokémon data on mount
  useEffect(() => {
    api.get("api/pokemon").then((res) => {
      setPokemons(res.data);
    });
  }, []);

  // Start the very first round once pokemons data is loaded from the backend
  useEffect(() => {
    if (pokemons.length > 0) {
      startNewRound();
    }
  }, [pokemons]);

  const startNewRound = () => {
    if (pokemons.length === 0) return;

    setHasGuessed(false);
    setSelectedAnswer(null);

    // Pick 1 correct Pokémon
    const correctIndex = Math.floor(Math.random() * pokemons.length);
    const correct = pokemons[correctIndex];

    // Pick 3 random wrong options
    let wrongOptions = [];
    while (wrongOptions.length < 3) {
      const randomOption = pokemons[Math.floor(Math.random() * pokemons.length)];
      if (randomOption._id !== correct._id && !wrongOptions.includes(randomOption)) {
        wrongOptions.push(randomOption);
      }
    }

    // Combine and shuffle options
    const allOptions = [correct, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setTargetPokemon(correct);
    setOptions(allOptions);
  };

  const handleGuess = (guessedPokemon) => {
    if (hasGuessed) return;

    setHasGuessed(true);
    setSelectedAnswer(guessedPokemon.name);
    setRoundsPlayed((prev) => prev + 1);

    if (guessedPokemon.name === targetPokemon.name) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextRound = () => {
    startNewRound();
  };

  return (
    <div className="games-page-wrapper">
      {/* WHO'S THAT POKEMON SECTION */}
      <div className="guessing-game-section">
        
        {/* Title and Subtitle aligned as shown in the image */}
        <div className="game-header-text">
          <h1 className="game-main-title">WHO'S THAT POKÉMON?</h1>
          <p className="game-subtitle">Guess the Pokémon behind the silhouette.</p>
        </div>

        <h2 className="score-display">Score {score} / {roundsPlayed}</h2>

        {targetPokemon && (
          <div className="game-area">
            <img
              src={targetPokemon.img}
              alt="Who's that Pokémon?"
              className={`mystery-pokemon ${hasGuessed ? "revealed" : "hidden"}`}
            />

            <div className="options-container">
              {options.map((opt) => {
                let btnClass = "option-btn";
                
                if (hasGuessed) {
                  if (opt.name === targetPokemon.name) {
                    btnClass += " correct";
                  } else if (opt.name === selectedAnswer) {
                    btnClass += " incorrect";
                  } else {
                    btnClass += " dimmed";
                  }
                }

                return (
                  <button
                    key={opt._id}
                    className={btnClass}
                    onClick={() => handleGuess(opt)}
                    disabled={hasGuessed}
                  >
                    {opt.name}
                  </button>
                );
              })}
            </div>

            {hasGuessed && (
              <div className="result-area">
                <p className="result-text">
                  {selectedAnswer === targetPokemon.name
                    ? "Correct!"
                    : `Nope, it was ${targetPokemon.name}.`}
                </p>
                <button className="next-round-btn" onClick={handleNextRound}>
                  Next round
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* OFFICIAL GAMES SECTION */}
      <div className="official-games-section">
        <h1 className="official-title">PLAY THE OFFICIAL POKÉMON GAMES</h1>
        <p className="official-subtitle">Free browser and mobile titles straight from The Pokémon Company.</p>

        <div className="games-grid">
          <GameCard 
            title="Pokémon Official Games Hub" 
            desc="The full catalogue of official games from The Pokémon Company."
            link="https://pokemon.com/us/pokemon-video-games"
          />
          <GameCard 
            title="Play! Pokémon TCG Live" 
            desc="Build decks and battle online in the official Trading Card Game."
            link="https://tcg.pokemon.com/en-us/tcgl/"
          />
          <GameCard 
            title="Pokémon Sleep" 
            desc="Track your sleep and collect Pokémon while you rest."
            link="https://www.pokemonsleep.net/en/"
          />
          <GameCard 
            title="Pokémon GO" 
            desc="Catch Pokémon in the real world on your phone."
            link="https://pokemongolive.com/"
          />
          <GameCard 
            title="Pokémon UNITE" 
            desc="5v5 team battles on Switch and mobile."
            link="https://unite.pokemon.com/"
          />
          <GameCard 
            title="Pokémon Playhouse" 
            desc="Gentle games and puzzles for younger trainers."
            link="https://www.pokemon.com/us/app/pokemon-playhouse"
          />
        </div>
      </div>
    </div>
  );
};

const GameCard = ({ title, desc, link }) => (
  <div className="official-game-card">
    <h3>{title}</h3>
    <p>{desc}</p>
    <a href={link} target="_blank" rel="noopener noreferrer" className="play-now-link">
      PLAY NOW &rarr;
    </a>
  </div>
);

export default GamesSection;