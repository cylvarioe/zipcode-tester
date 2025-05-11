import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './ZipcodeGame.css';

// Modal component
const GameOverModal = ({ score, onTryAgain }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Time's Up!</h2>
        <p>Your Score: {score}</p>
        <button className="try-again-button" onClick={onTryAgain}>
          Try Again
        </button>
      </div>
    </div>
  );
};

// Welcome Modal component
const WelcomeModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content welcome-modal">
        <h2>Welcome to ZipCoder! 🎮</h2>
        <div className="welcome-content">
          <p>Test your knowledge of Phoenix zip codes in this exciting 3-minute challenge!</p>
          <div className="rules-section">
            <ul>
              <li>Find the highlighted zip code on the map</li>
              <li>Click the correct location to score points</li>
              <li>Use the zone legend to help you navigate</li>
              <li>Race against the 3-minute timer!</li>
            </ul>
          </div>
          <p className="encouragement">Ready to become a Phoenix zip code master? Let's go! 🌟</p>
        </div>
        <button className="try-again-button" onClick={onClose}>
          Got It! Let's Play! 🚀
        </button>
      </div>
    </div>
  );
};

const ZipcodeGame = () => {
  const [zipcodes, setZipcodes] = useState([]);
  const [currentZipcode, setCurrentZipcode] = useState(null);
  const [foundZipcodes, setFoundZipcodes] = useState(new Set());
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3 * 60); // 3 minutes in seconds
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/data/zipcodes.geojson')
      .then(response => response.json())
      .then(data => {
        setZipcodes(data.features);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const startGame = () => {
    setFoundZipcodes(new Set());
    setGameStarted(true);
    setGameComplete(false);
    setTime(0);
    setTimeLeft(3 * 60);
    pickNewZipcode();
    timerRef.current = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
  };

  const pickNewZipcode = () => {
    const availableZipcodes = zipcodes.filter(
      feature => !foundZipcodes.has(feature.properties.zipcode)
    );
    
    if (availableZipcodes.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableZipcodes.length);
      setCurrentZipcode(availableZipcodes[randomIndex].properties.zipcode);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameStarted(false);
    setGameComplete(true);
    clearInterval(timerRef.current);
    setShowGameOver(true);
  };

  const getZoneColor = (feature) => {
    if (foundZipcodes.has(feature.properties.zipcode)) {
      return '#4CAF50';  // Green for correct answers
    }
    
    const coordinates = feature.geometry.coordinates[0];
    const centroid = coordinates.reduce(
      (acc, coord) => ({
        x: acc.x + coord[0]/coordinates.length,
        y: acc.y + coord[1]/coordinates.length
      }),
      {x: 0, y: 0}
    );

    // Central (Zone 1 - Green)
    if (centroid.x >= -112.1 && centroid.x <= -111.95 &&
        centroid.y >= 33.4 && centroid.y <= 33.6) {
      return '#006400';
    }
    
    // North East (Zone 2 - Orange)
    if (centroid.x >= -111.95 && centroid.y >= 33.5) {
      return '#FFA500';
    }
    
    // North West (Zone 3 - Dark Blue)
    if (centroid.x <= -112.1 && centroid.y >= 33.5) {
      return '#00008B';
    }
    
    // South East (Zone 4 - Red)
    if (centroid.x >= -111.95 && centroid.y <= 33.5) {
      return '#FF0000';
    }
    
    // South West (Zone 5 - Yellow)
    if (centroid.x <= -112.1 && centroid.y <= 33.5) {
      return '#FFD700';
    }
    
    return '#808080'; // Default gray
  };

  const handleZipcodeClick = (feature) => {
    if (!gameStarted || gameComplete) return;
    
    const clickedZipcode = feature.properties.zipcode;
    
    if (clickedZipcode === currentZipcode) {
      const newFoundZipcodes = new Set(foundZipcodes);
      newFoundZipcodes.add(clickedZipcode);
      setFoundZipcodes(newFoundZipcodes);
      pickNewZipcode();
      setScore(prev => prev + 1);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      clearInterval(timerRef.current);
    } else {
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setTime(0);
    setFoundZipcodes(new Set());
    setGameStarted(false);
    setGameComplete(false);
    setIsPaused(false);
    setShowGameOver(false);
    setScore(0);
    setTimeLeft(3 * 60);
    pickNewZipcode();
  };

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (gameStarted && !gameComplete && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameComplete, isPaused, timeLeft]);

  // Format time to mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="loading"><div className="loader">Loading map data...</div></div>;
  if (error) return (
    <div className="error">
      <div className="error-message">
        <h3>Error loading map data</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    </div>
  );

  return (
    <div className="zipcode-game">
      {showWelcome && (
        <WelcomeModal onClose={() => setShowWelcome(false)} />
      )}
      {showGameOver && (
        <GameOverModal score={score} onTryAgain={handleReset} />
      )}
      
      <div className="game-wrapper">
        <div className="map-container">
          <MapContainer
            center={[33.4484, -112.0740]}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {zipcodes.map((feature) => (
              <GeoJSON
                key={feature.properties.zipcode}
                data={feature}
                style={{
                  fillColor: getZoneColor(feature),
                  fillOpacity: 0.7,
                  color: 'black',
                  weight: 1,
                }}
                eventHandlers={{
                  click: () => handleZipcodeClick(feature),
                }}
              >
                <Tooltip
                  permanent
                  direction="center"
                  className="zipcode-label"
                  opacity={1}
                  sticky={true}
                  interactive={false}
                  pane="tooltipPane"
                >
                  <span style={{
                    color: foundZipcodes.has(feature.properties.zipcode) ? '#00ff00' : '#000',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff'
                  }}>
                    {feature.properties.zipcode}
                  </span>
                </Tooltip>
              </GeoJSON>
            ))}
          </MapContainer>
        </div>

        <div className="right-panel">
          <div className="game-controls">
            {!gameStarted && !gameComplete && (
              <button onClick={startGame}>Start Game</button>
            )}
            {gameStarted && (
              <div className="game-info">
                <div>Find Zipcode: {currentZipcode}</div>
                <div>Time: {formatTime(timeLeft)}</div>
                <div>Found: {foundZipcodes.size}/{zipcodes.length}</div>
                <div className="game-buttons">
                  <button onClick={handlePauseResume}>
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>
                  <button onClick={handleReset}>Reset</button>
                </div>
              </div>
            )}
            {gameComplete && (
              <div className="game-complete">
                <h2>Game Complete!</h2>
                <p>Time: {formatTime(timeLeft)}</p>
                <button onClick={startGame}>Play Again</button>
              </div>
            )}
          </div>

          <div className="zone-legend">
            <h4>Zones</h4>
            <div className="zone-legend-item">
              <div className="zone-color zone-1"></div>
              <span>Central</span>
            </div>
            <div className="zone-legend-item">
              <div className="zone-color zone-2"></div>
              <span>North East</span>
            </div>
            <div className="zone-legend-item">
              <div className="zone-color zone-3"></div>
              <span>North West</span>
            </div>
            <div className="zone-legend-item">
              <div className="zone-color zone-4"></div>
              <span>South East</span>
            </div>
            <div className="zone-legend-item">
              <div className="zone-color zone-5"></div>
              <span>South West</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZipcodeGame; 