import React, { useState, useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';

const FocusFlow: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [targetSize, setTargetSize] = useState(50);
  const [reactionTime, setReactionTime] = useState<number[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: number;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameState('finished');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    setReactionTime([]);
    generateNewTarget();
  };

  const generateNewTarget = () => {
    if (!gameAreaRef.current) return;

    const gameArea = gameAreaRef.current.getBoundingClientRect();
    const maxX = gameArea.width - targetSize;
    const maxY = gameArea.height - targetSize;
    
    setTargetPosition({
      x: Math.random() * maxX,
      y: Math.random() * maxY,
    });
    setTargetSize(Math.random() * 30 + 30); // Random size between 30 and 60
  };

  const handleTargetClick = () => {
    const endTime = performance.now();
    const startTime = useRef(endTime).current;
    const newReactionTime = endTime - startTime;

    setScore((prev) => prev + 1);
    setReactionTime((prev) => [...prev, newReactionTime]);
    generateNewTarget();
  };

  const calculateAverageReactionTime = () => {
    if (reactionTime.length === 0) return 0;
    return Math.round(reactionTime.reduce((a, b) => a + b, 0) / reactionTime.length);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-[#0066ff]" />
          <h2 className="text-2xl font-bold text-gray-800">Focus Flow</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-gray-600">Time: </span>
            <span className="font-bold text-[#0066ff]">{timeLeft}s</span>
          </div>
          <div className="bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-gray-600">Score: </span>
            <span className="font-bold text-[#0066ff]">{score}</span>
          </div>
        </div>
      </div>

      {gameState === 'idle' ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Click targets as quickly as possible!</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors"
          >
            Start Game
          </button>
        </div>
      ) : gameState === 'playing' ? (
        <div
          ref={gameAreaRef}
          className="relative w-full h-[400px] bg-gray-50 rounded-lg overflow-hidden"
        >
          <button
            onClick={handleTargetClick}
            className="absolute bg-[#0066ff] rounded-full transition-all duration-200 hover:bg-[#0052cc]"
            style={{
              left: `${targetPosition.x}px`,
              top: `${targetPosition.y}px`,
              width: `${targetSize}px`,
              height: `${targetSize}px`,
            }}
          />
        </div>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold text-green-600 mb-4">Game Over!</h3>
          <div className="space-y-2 mb-6">
            <p className="text-gray-600">Final Score: <span className="font-bold">{score}</span></p>
            <p className="text-gray-600">
              Average Reaction Time: <span className="font-bold">{calculateAverageReactionTime()}ms</span>
            </p>
          </div>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default FocusFlow; 