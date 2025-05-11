import React, { useState, useEffect } from 'react';
import './TechTest.css';

// Zone data based on coordinates
const zoneData = {
  'Central': {
    description: 'Central Phoenix',
    coordinates: {
      minLng: -112.1,
      maxLng: -111.95,
      minLat: 33.4,
      maxLat: 33.6
    }
  },
  'North East': {
    description: 'Scottsdale/North East',
    coordinates: {
      minLng: -111.95,
      maxLng: -111.8,
      minLat: 33.5,
      maxLat: 33.7
    }
  },
  'North West': {
    description: 'Glendale/Peoria',
    coordinates: {
      minLng: -112.3,
      maxLng: -112.1,
      minLat: 33.5,
      maxLat: 33.7
    }
  },
  'South East': {
    description: 'Mesa/Chandler',
    coordinates: {
      minLng: -111.95,
      maxLng: -111.8,
      minLat: 33.3,
      maxLat: 33.5
    }
  },
  'South West': {
    description: 'Avondale/Goodyear',
    coordinates: {
      minLng: -112.3,
      maxLng: -112.1,
      minLat: 33.3,
      maxLat: 33.5
    }
  }
};

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
        <h2>Welcome to Zone Tester! 🗺️</h2>
        <div className="welcome-content">
          <p>Test your knowledge of Phoenix zones in this exciting 2-minute challenge!</p>
          <div className="rules-section">
            <ul>
              <li>Match zip codes to their correct zones</li>
              <li>Choose from Central, North East, North West, South East, and South West</li>
              <li>Score points for each correct match</li>
              <li>Race against the 2-minute timer!</li>
            </ul>
          </div>
          <p className="encouragement">Ready to master Phoenix's zones? Let's begin! 🌟</p>
        </div>
        <button className="try-again-button" onClick={onClose}>
          Got It! Let's Play! 🚀
        </button>
      </div>
    </div>
  );
};

function TechTest() {
  const [currentZip, setCurrentZip] = useState('');
  const [selectedZone, setSelectedZone] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledZones, setShuffledZones] = useState([]);
  const [timeLeft, setTimeLeft] = useState(2 * 60); // 2 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setShowGameOver(true);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Format time to mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Toggle timer
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Reset game
  const handleReset = () => {
    setScore(0);
    setTimeLeft(2 * 60); // Reset to 2 minutes
    setIsActive(false);
    setShowGameOver(false);
    setCurrentZip(generateRandomZip());
    setShuffledZones(shuffleArray(Object.keys(zoneData)));
    setSelectedZone(null);
    setIsCorrect(false);
    setIsIncorrect(false);
  };

  // Shuffle array function
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Generate random zipcode from the available zones
  const generateRandomZip = () => {
    const testZipcodes = [
      '85004', // Central
      '85006', // Central
      '85008', // Central
      '85250', // North East
      '85251', // North East
      '85254', // North East
      '85301', // North West
      '85302', // North West
      '85303', // North West
      '85201', // South East
      '85202', // South East
      '85203', // South East
      '85323', // South West
      '85338', // South West
      '85353'  // South West
    ];
    return testZipcodes[Math.floor(Math.random() * testZipcodes.length)];
  };

  // Find the correct zone for a zipcode
  const findCorrectZone = (zipcode) => {
    const zoneMap = {
      '85004': 'Central',
      '85006': 'Central',
      '85008': 'Central',
      '85250': 'North East',
      '85251': 'North East',
      '85254': 'North East',
      '85301': 'North West',
      '85302': 'North West',
      '85303': 'North West',
      '85201': 'South East',
      '85202': 'South East',
      '85203': 'South East',
      '85323': 'South West',
      '85338': 'South West',
      '85353': 'South West'
    };
    return zoneMap[zipcode] || null;
  };

  // Handle zone selection
  const handleZoneSelect = (zone) => {
    if (!isActive) return; // Don't allow selections if timer is not active
    
    setSelectedZone(zone);
    const correctZone = findCorrectZone(currentZip);
    
    if (zone === correctZone) {
      setIsCorrect(true);
      setScore(prev => prev + 1);
      
      setTimeout(() => {
        setIsCorrect(false);
        setSelectedZone(null);
        setCurrentZip(generateRandomZip());
        setShuffledZones(shuffleArray(Object.keys(zoneData)));
      }, 600);
    } else {
      setIsIncorrect(true);
      
      setTimeout(() => {
        setIsIncorrect(false);
        setSelectedZone(null);
      }, 600);
    }
  };

  // Initialize first zipcode and shuffled zones
  useEffect(() => {
    setCurrentZip(generateRandomZip());
    setShuffledZones(shuffleArray(Object.keys(zoneData)));
  }, []);

  return (
    <div className="tech-test">
      {showWelcome && (
        <WelcomeModal onClose={() => setShowWelcome(false)} />
      )}
      {showGameOver && (
        <GameOverModal score={score} onTryAgain={handleReset} />
      )}
      
      <div className="tech-test-header">
        <h2>Zone Test</h2>
        <div className="stats-container">
          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>
          <div className="score">Score: {score}</div>
          <div className={`timer ${timeLeft <= 30 ? 'warning' : ''}`}>
            {formatTime(timeLeft)}
          </div>
          <button 
            className={`timer-button ${isActive ? 'active' : ''}`} 
            onClick={toggleTimer}
            disabled={showGameOver}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
        </div>
      </div>

      <div className="current-zip">
        <h3>Current Zipcode:</h3>
        <div className="zipcode">{currentZip}</div>
      </div>

      <div className="tech-cards">
        {shuffledZones.map((zone) => (
          <button
            key={zone}
            data-zone={zone}
            className={`tech-card ${selectedZone === zone ? 'selected' : ''} ${
              selectedZone === zone && isCorrect ? 'correct' : ''
            } ${selectedZone === zone && isIncorrect ? 'incorrect' : ''}`}
            onClick={() => handleZoneSelect(zone)}
            disabled={!isActive || isCorrect || isIncorrect || showGameOver}
          >
            <div className="tech-name">{zone}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TechTest; 