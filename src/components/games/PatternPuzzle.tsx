import React, { useState, useEffect } from 'react';
import { Puzzle } from 'lucide-react';

interface Pattern {
  id: number;
  emoji: string;
  isSelected: boolean;
}

const emojis = ['🔴', '🔵', '🟡', '🟢', '🟣', '⚪', '⚫', '🟠'];

const PatternPuzzle: React.FC = () => {
  const [pattern, setPattern] = useState<Pattern[]>([]);
  const [userPattern, setUserPattern] = useState<Pattern[]>([]);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [showPattern, setShowPattern] = useState(false);
  const [canInput, setCanInput] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (gameState === 'playing') {
      generatePattern();
    }
  }, [gameState, level]);

  const generatePattern = () => {
    const newPattern = Array.from({ length: level + 2 }, (_, index) => ({
      id: index,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      isSelected: false,
    }));
    setPattern(newPattern);
    setUserPattern([]);
    setShowPattern(true);
    setCanInput(false);

    // Show pattern for 2 seconds
    setTimeout(() => {
      setShowPattern(false);
      setCanInput(true);
    }, 2000);
  };

  const handleEmojiClick = (emoji: string) => {
    if (!canInput) return;

    const newUserPattern = [...userPattern, { id: userPattern.length, emoji, isSelected: true }];
    setUserPattern(newUserPattern);

    // Check if pattern is complete
    if (newUserPattern.length === pattern.length) {
      checkPattern(newUserPattern);
    }
  };

  const checkPattern = (userPattern: Pattern[]) => {
    const isCorrect = userPattern.every(
      (item, index) => item.emoji === pattern[index].emoji
    );

    if (isCorrect) {
      setScore(score + level * 10);
      if (level === 5) {
        setGameState('finished');
      } else {
        setLevel(level + 1);
        setTimeout(generatePattern, 1000);
      }
    } else {
      setGameState('finished');
    }
  };

  const startGame = () => {
    setLevel(1);
    setScore(0);
    setGameState('playing');
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Puzzle className="w-8 h-8 text-[#0066ff]" />
          <h2 className="text-2xl font-bold text-gray-800">Pattern Puzzle</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-gray-600">Level: </span>
            <span className="font-bold text-[#0066ff]">{level}</span>
          </div>
          <div className="bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-gray-600">Score: </span>
            <span className="font-bold text-[#0066ff]">{score}</span>
          </div>
        </div>
      </div>

      {gameState === 'idle' ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Remember and repeat the pattern!</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors"
          >
            Start Game
          </button>
        </div>
      ) : gameState === 'playing' ? (
        <div className="space-y-8">
          <div className="flex justify-center gap-2">
            {(showPattern ? pattern : userPattern).map((item) => (
              <div
                key={item.id}
                className={`w-16 h-16 rounded-lg flex items-center justify-center text-4xl transition-all duration-300 ${
                  item.isSelected ? 'bg-white shadow-lg' : 'bg-gray-100'
                }`}
              >
                {item.isSelected && item.emoji}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-4">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                disabled={!canInput}
                className={`w-16 h-16 rounded-lg flex items-center justify-center text-4xl transition-all duration-300 ${
                  canInput
                    ? 'bg-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 cursor-not-allowed'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold text-green-600 mb-4">Game Over!</h3>
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

export default PatternPuzzle; 