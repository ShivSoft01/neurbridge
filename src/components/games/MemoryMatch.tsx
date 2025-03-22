import React, { useState, useEffect } from 'react';
import { MemoryStick as Memory } from 'lucide-react';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emojis = ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎟️', '🎠'];

const MemoryMatch: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const gameCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setGameComplete(false);
  };

  const handleCardClick = (cardId: number) => {
    if (isProcessing || cards[cardId].isFlipped || cards[cardId].isMatched) return;

    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsProcessing(true);
      setMoves(moves + 1);
      checkMatch(newFlippedCards);
    }
  };

  const checkMatch = (flippedCardIds: number[]) => {
    const [first, second] = flippedCardIds;
    const match = cards[first].emoji === cards[second].emoji;

    setTimeout(() => {
      const newCards = [...cards];
      if (match) {
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setCards(newCards);
        setFlippedCards([]);
        setIsProcessing(false);

        // Check if game is complete
        if (newCards.every(card => card.isMatched)) {
          setGameComplete(true);
        }
      } else {
        newCards[first].isFlipped = false;
        newCards[second].isFlipped = false;
        setCards(newCards);
        setFlippedCards([]);
        setIsProcessing(false);
      }
    }, 1000);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Memory className="w-8 h-8 text-[#0066ff]" />
          <h2 className="text-2xl font-bold text-gray-800">Memory Match</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-gray-600">Moves: </span>
            <span className="font-bold text-[#0066ff]">{moves}</span>
          </div>
          <button
            onClick={initializeGame}
            className="px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors"
          >
            New Game
          </button>
        </div>
      </div>

      {gameComplete ? (
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold text-green-600 mb-4">Congratulations!</h3>
          <p className="text-gray-600 mb-4">You completed the game in {moves} moves!</p>
          <button
            onClick={initializeGame}
            className="px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-lg text-4xl flex items-center justify-center transition-all duration-300 ${
                card.isFlipped || card.isMatched
                  ? 'bg-white shadow-lg transform rotate-0'
                  : 'bg-[#0066ff] text-white shadow-md hover:shadow-lg transform rotate-180'
              }`}
            >
              {(card.isFlipped || card.isMatched) && card.emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryMatch; 