import React, { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';

interface SensoryItem {
  id: string;
  name: string;
  category: 'sight' | 'sound' | 'touch' | 'smell' | 'taste';
  description: string;
  image: string;
}

const sensoryItems: SensoryItem[] = [
  // Sight
  { id: 'sight1', name: 'Rainbow', category: 'sight', description: 'A colorful arc in the sky', image: '🌈' },
  { id: 'sight2', name: 'Stars', category: 'sight', description: 'Twinkling lights in the night sky', image: '⭐' },
  { id: 'sight3', name: 'Sunset', category: 'sight', description: 'Beautiful colors as the sun sets', image: '🌅' },
  
  // Sound
  { id: 'sound1', name: 'Rain', category: 'sound', description: 'Gentle drops falling from the sky', image: '🌧️' },
  { id: 'sound2', name: 'Birds', category: 'sound', description: 'Sweet chirping in the morning', image: '🐦' },
  { id: 'sound3', name: 'Wind', category: 'sound', description: 'Soft breeze through the trees', image: '🌬️' },
  
  // Touch
  { id: 'touch1', name: 'Sand', category: 'touch', description: 'Grainy texture between fingers', image: '🏖️' },
  { id: 'touch2', name: 'Cotton', category: 'touch', description: 'Soft and fluffy material', image: '🧶' },
  { id: 'touch3', name: 'Water', category: 'touch', description: 'Cool and wet sensation', image: '💧' },
  
  // Smell
  { id: 'smell1', name: 'Flowers', category: 'smell', description: 'Sweet and fresh fragrance', image: '🌸' },
  { id: 'smell2', name: 'Bread', category: 'smell', description: 'Warm and comforting aroma', image: '🍞' },
  { id: 'smell3', name: 'Ocean', category: 'smell', description: 'Fresh and salty air', image: '🌊' },
  
  // Taste
  { id: 'taste1', name: 'Apple', category: 'taste', description: 'Sweet and crunchy fruit', image: '🍎' },
  { id: 'taste2', name: 'Lemon', category: 'taste', description: 'Sour citrus fruit', image: '🍋' },
  { id: 'taste3', name: 'Chocolate', category: 'taste', description: 'Sweet and smooth treat', image: '🍫' }
];

const categories = {
  sight: '👁️ Sight',
  sound: '👂 Sound',
  touch: '🖐️ Touch',
  smell: '👃 Smell',
  taste: '👅 Taste'
};

const SensoryMatch: React.FC = () => {
  const [items, setItems] = useState<SensoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categories | null>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);

  const startGame = () => {
    // Shuffle items
    const shuffledItems = [...sensoryItems].sort(() => Math.random() - 0.5);
    setItems(shuffledItems);
    setScore(0);
    setGameState('playing');
    setFeedback(null);
  };

  const handleCategorySelect = (category: keyof typeof categories) => {
    setSelectedCategory(category);
  };

  const handleItemSelect = (item: SensoryItem) => {
    if (!selectedCategory) return;

    const isCorrect = item.category === selectedCategory;
    setFeedback(isCorrect ? 'Correct! 🎉' : 'Try again! 💪');
    
    if (isCorrect) {
      setScore(score + 1);
      setItems(items.filter(i => i.id !== item.id));
      
      if (items.length <= 1) {
        setTimeout(() => {
          setGameState('finished');
        }, 1000);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Palette className="w-8 h-8 text-[#0066ff]" />
          <h2 className="text-2xl font-bold text-gray-800">Sensory Match</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-gray-600">Score: </span>
            <span className="font-bold text-[#0066ff]">{score}</span>
          </div>
        </div>
      </div>

      {gameState === 'idle' ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Match items to their sensory categories!</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors"
          >
            Start Game
          </button>
        </div>
      ) : gameState === 'playing' ? (
        <div className="space-y-8">
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(categories).map(([category, label]) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category as keyof typeof categories)}
                className={`p-4 rounded-lg text-center transition-all ${
                  selectedCategory === category
                    ? 'bg-[#0066ff] text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="text-2xl mb-2">{label.split(' ')[0]}</div>
                <div className="text-sm">{label.split(' ')[1]}</div>
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`text-center text-xl font-semibold ${
              feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'
            }`}>
              {feedback}
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => handleItemSelect(item)}
                disabled={!selectedCategory || !!feedback}
                className={`p-4 rounded-lg text-center transition-all ${
                  !selectedCategory || feedback
                    ? 'bg-gray-100'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="text-4xl mb-2">{item.image}</div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold text-green-600 mb-4">Game Complete!</h3>
          <div className="space-y-2 mb-6">
            <p className="text-gray-600">Final Score: <span className="font-bold">{score}</span></p>
            <p className="text-gray-600">Out of: <span className="font-bold">{sensoryItems.length}</span></p>
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

export default SensoryMatch; 