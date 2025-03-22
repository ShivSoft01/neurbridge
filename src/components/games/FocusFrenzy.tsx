import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';

interface Target {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
const sizes = [40, 50, 60];

const FocusFrenzy: React.FC = () => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [level, setLevel] = useState(1);

  useEffect(() => {
    let timer: number;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameState('finished');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (gameState === 'playing' && targets.length < 3) {
      createNewTarget();
    }
  }, [gameState, targets]);

  const createNewTarget = () => {
    const newTarget: Target = {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 100),
      size: sizes[Math.floor(Math.random() * sizes.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setTargets(prev => [...prev, newTarget]);
  };

  const startGame = () => {
    setTargets([]);
    setScore(0);
    setTimeLeft(60);
    setLevel(1);
    setGameState('playing');
  };

  const handleTargetClick = (targetId: string) => {
    setTargets(prev => prev.filter(target => target.id !== targetId));
    setScore(prev => prev + 1);
    
    // Level up every 5 points
    if ((score + 1) % 5 === 0) {
      setLevel(prev => prev + 1);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-[#0066ff]" />
          <h2 className="text-2xl font-bold text-gray-800">Focus Frenzy</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-gray-600">Score: </span>
            <span className="font-bold text-[#0066ff]">{score}</span>
          </div>
          <div className="bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-gray-600">Time: </span>
            <span className="font-bold text-[#0066ff]">{timeLeft}s</span>
          </div>
          <div className="bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-gray-600">Level: </span>
            <span className="font-bold text-[#0066ff]">{level}</span>
          </div>
        </div>
      </div>

      {gameState === 'idle' ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Click the targets as quickly as you can!</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors"
          >
            Start Game
          </button>
        </div>
      ) : gameState === 'playing' ? (
        <div className="relative w-full h-[600px] bg-gray-50 rounded-lg overflow-hidden">
          {targets.map(target => (
            <button
              key={target.id}
              onClick={() => handleTargetClick(target.id)}
              className="absolute rounded-full transition-transform hover:scale-110"
              style={{
                left: target.x,
                top: target.y,
                width: target.size,
                height: target.size,
                backgroundColor: target.color,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold text-green-600 mb-4">Game Complete!</h3>
          <div className="space-y-2 mb-6">
            <p className="text-gray-600">Final Score: <span className="font-bold">{score}</span></p>
            <p className="text-gray-600">Level Reached: <span className="font-bold">{level}</span></p>
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

export default FocusFrenzy; 