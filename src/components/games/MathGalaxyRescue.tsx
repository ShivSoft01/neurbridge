import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Star, Volume2, Settings, HelpCircle, Award } from 'lucide-react';
import theme from '../../theme';

interface Alien {
  id: string;
  x: number;
  y: number;
  problem: string;
  answer: number;
  rescued: boolean;
  options: number[];
}

interface Level {
  id: number;
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division';
  difficulty: 1 | 2 | 3;
  timeLimit: number;
  aliensNeeded: number;
}

const levels: Level[] = [
  { id: 1, operation: 'addition', difficulty: 1, timeLimit: 120, aliensNeeded: 5 },
  { id: 2, operation: 'subtraction', difficulty: 1, timeLimit: 120, aliensNeeded: 5 },
  { id: 3, operation: 'multiplication', difficulty: 1, timeLimit: 150, aliensNeeded: 6 },
  { id: 4, operation: 'division', difficulty: 1, timeLimit: 150, aliensNeeded: 6 },
  // More levels with increasing difficulty
];

function generateProblem(operation: string, difficulty: number): { problem: string; answer: number } {
  let num1: number, num2: number, answer: number;
  
  switch (operation) {
    case 'addition':
      num1 = Math.floor(Math.random() * (difficulty * 10)) + 1;
      num2 = Math.floor(Math.random() * (difficulty * 10)) + 1;
      answer = num1 + num2;
      return { problem: `${num1} + ${num2}`, answer };
    
    case 'subtraction':
      num1 = Math.floor(Math.random() * (difficulty * 10)) + difficulty * 10;
      num2 = Math.floor(Math.random() * num1) + 1;
      answer = num1 - num2;
      return { problem: `${num1} - ${num2}`, answer };
    
    case 'multiplication':
      num1 = Math.floor(Math.random() * (difficulty * 5)) + 1;
      num2 = Math.floor(Math.random() * (difficulty * 5)) + 1;
      answer = num1 * num2;
      return { problem: `${num1} × ${num2}`, answer };
    
    case 'division':
      num2 = Math.floor(Math.random() * (difficulty * 5)) + 1;
      answer = Math.floor(Math.random() * (difficulty * 5)) + 1;
      num1 = num2 * answer;
      return { problem: `${num1} ÷ ${num2}`, answer };
    
    default:
      return { problem: '1 + 1', answer: 2 };
  }
}

function generateOptions(correctAnswer: number, count: number = 4): number[] {
  const options = [correctAnswer];
  while (options.length < count) {
    const offset = Math.floor(Math.random() * 5) + 1;
    const option = Math.random() < 0.5 
      ? correctAnswer + offset 
      : correctAnswer - offset;
    if (!options.includes(option) && option >= 0) {
      options.push(option);
    }
  }
  return options.sort(() => Math.random() - 0.5);
}

function MathGalaxyRescue() {
  const [currentLevel, setCurrentLevel] = useState<Level>(levels[0]);
  const [aliens, setAliens] = useState<Alien[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(currentLevel.timeLimit);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'complete'>('menu');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [selectedAlien, setSelectedAlien] = useState<Alien | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            setGameState('complete');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState]);

  const generateAliens = () => {
    const newAliens: Alien[] = [];
    for (let i = 0; i < currentLevel.aliensNeeded + 2; i++) {
      const { problem, answer } = generateProblem(currentLevel.operation, currentLevel.difficulty);
      newAliens.push({
        id: `alien-${i}`,
        x: Math.random() * 80 + 10, // Keep aliens within 10-90% of screen width
        y: Math.random() * 80 + 10, // Keep aliens within 10-90% of screen height
        problem,
        answer,
        rescued: false,
        options: generateOptions(answer),
      });
    }
    setAliens(newAliens);
  };

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(currentLevel.timeLimit);
    setScore(0);
    generateAliens();
    setShowTutorial(false);
  };

  const handleAlienClick = (alien: Alien) => {
    if (alien.rescued || gameState !== 'playing') return;
    setSelectedAlien(alien);
  };

  const handleAnswerSubmit = (selectedAnswer: number) => {
    if (!selectedAlien) return;

    if (selectedAnswer === selectedAlien.answer) {
      // Correct answer
      if (audioEnabled && audioRef.current) {
        audioRef.current.play();
      }
      
      setAliens(prev => prev.map(a => 
        a.id === selectedAlien.id ? { ...a, rescued: true } : a
      ));
      setScore(prev => prev + 1);
      
      // Check if level complete
      if (score + 1 >= currentLevel.aliensNeeded) {
        setGameState('complete');
      }
    } else {
      // Wrong answer
      setTimeLeft(prev => Math.max(0, prev - 5)); // Penalty: -5 seconds
    }
    
    setSelectedAlien(null);
  };

  const renderTutorial = () => (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-md" style={{ border: `2px solid ${theme.secondary}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>How to Play</h2>
        <ul className="space-y-2" style={{ color: theme.text }}>
          <li>• Click on aliens to see their math problems</li>
          <li>• Choose the correct answer to rescue them</li>
          <li>• Rescue enough aliens before time runs out</li>
          <li>• Wrong answers cost you 5 seconds</li>
        </ul>
        <button
          onClick={() => startGame()}
          className="mt-6 px-6 py-2 rounded-lg w-full"
          style={{ background: theme.secondary, color: theme.white }}
        >
          Start Mission!
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-8 ml-64 min-h-screen relative" style={{ background: theme.primary }}>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2" style={{ color: theme.text }}>
            <Rocket className="w-8 h-8" />
            Math Galaxy Rescue
          </h1>
          <p className="mt-2" style={{ color: theme.text }}>
            Level {currentLevel.id} • Aliens Rescued: {score}/{currentLevel.aliensNeeded}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2 rounded-lg"
            style={{ background: theme.white }}
          >
            <Volume2 
              className={`w-6 h-6 ${audioEnabled ? '' : 'opacity-50'}`}
              style={{ color: theme.secondary }}
            />
          </button>
          <button
            onClick={() => setShowTutorial(true)}
            className="p-2 rounded-lg"
            style={{ background: theme.white }}
          >
            <HelpCircle className="w-6 h-6" style={{ color: theme.secondary }} />
          </button>
        </div>
      </div>

      {/* Game Area */}
      <div 
        className="relative bg-white rounded-xl shadow-lg"
        style={{ 
          height: 'calc(100vh - 200px)',
          backgroundImage: 'url(/space-background.png)',
          backgroundSize: 'cover',
        }}
      >
        {/* Timer */}
        <div 
          className="absolute top-4 right-4 px-4 py-2 rounded-lg"
          style={{ background: theme.white }}
        >
          <span style={{ color: timeLeft < 30 ? '#ff4444' : theme.text }}>
            Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>

        {/* Aliens */}
        {aliens.map(alien => (
          <button
            key={alien.id}
            onClick={() => handleAlienClick(alien)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              alien.rescued ? 'opacity-50' : 'hover:scale-110'
            }`}
            style={{
              left: `${alien.x}%`,
              top: `${alien.y}%`,
              cursor: alien.rescued ? 'default' : 'pointer',
            }}
          >
            <div className="w-16 h-16 flex items-center justify-center">
              {alien.rescued ? '👽✨' : '👽'}
            </div>
          </button>
        ))}

        {/* Selected Alien Problem */}
        {selectedAlien && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6" style={{ border: `2px solid ${theme.secondary}` }}>
              <h3 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>
                {selectedAlien.problem} = ?
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {selectedAlien.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSubmit(option)}
                    className="px-6 py-3 rounded-lg text-lg font-medium transition-colors duration-200"
                    style={{
                      background: theme.primary,
                      color: theme.text,
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tutorial Overlay */}
        {showTutorial && renderTutorial()}

        {/* Game Complete */}
        {gameState === 'complete' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 text-center" style={{ border: `2px solid ${theme.secondary}` }}>
              <Award className="w-16 h-16 mx-auto mb-4" style={{ color: theme.secondary }} />
              <h2 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>
                {score >= currentLevel.aliensNeeded ? 'Mission Complete!' : 'Mission Failed'}
              </h2>
              <p className="mb-6" style={{ color: theme.text }}>
                Aliens Rescued: {score}/{currentLevel.aliensNeeded}
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => startGame()}
                  className="px-6 py-2 rounded-lg"
                  style={{ background: theme.secondary, color: theme.white }}
                >
                  Try Again
                </button>
                {score >= currentLevel.aliensNeeded && currentLevel.id < levels.length && (
                  <button
                    onClick={() => {
                      setCurrentLevel(levels[currentLevel.id]);
                      startGame();
                    }}
                    className="px-6 py-2 rounded-lg"
                    style={{ background: theme.primary, color: theme.text }}
                  >
                    Next Level
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audio Elements */}
      <audio ref={audioRef} src="/success-sound.mp3" />
    </div>
  );
}

export default MathGalaxyRescue; 