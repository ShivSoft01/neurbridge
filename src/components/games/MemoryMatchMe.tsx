import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, RefreshCw, Trophy } from 'lucide-react';
import theme from '../../theme';

interface Card {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function MemoryMatchMe() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);

  const cardPairs = [
    { content: '🐶', type: 'emoji' },
    { content: '🐱', type: 'emoji' },
    { content: '🐰', type: 'emoji' },
    { content: '🦊', type: 'emoji' },
    { content: '🐼', type: 'emoji' },
    { content: '🦁', type: 'emoji' },
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledCards = [...cardPairs, ...cardPairs]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        id: index,
        content: card.content,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setIsGameComplete(false);
  };

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2 || cards[cardId].isMatched || cards[cardId].isFlipped) {
      return;
    }

    const newCards = cards.map(card =>
      card.id === cardId ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      const [firstCard, secondCard] = newFlippedCards;

      if (cards[firstCard].content === cards[secondCard].content) {
        // Match found
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCard || card.id === secondCard
                ? { ...card, isMatched: true }
                : card
            )
          );
          setFlippedCards([]);
          setMatches(prev => prev + 1);
          
          if (matches + 1 === cardPairs.length) {
            setIsGameComplete(true);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCard || card.id === secondCard
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="p-8 ml-64 min-h-screen" style={{ background: theme.primary }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: theme.text }}>
            Memory Match Me
          </h1>
          <p className="mt-2" style={{ color: theme.text }}>
            Match the pairs to improve your memory! 🧩
          </p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Moves</p>
            <p className="text-2xl font-bold">{moves}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Matches</p>
            <p className="text-2xl font-bold">{matches}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Pairs Left</p>
            <p className="text-2xl font-bold">{cardPairs.length - matches}</p>
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex justify-end gap-4 mb-8">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-lg bg-white hover:bg-gray-100"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
          <button
            onClick={initializeGame}
            className="p-2 rounded-lg bg-white hover:bg-gray-100"
          >
            <RefreshCw className="w-6 h-6" />
          </button>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-4">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-xl text-4xl flex items-center justify-center transition-all duration-300 ${
                card.isFlipped || card.isMatched
                  ? 'bg-white transform rotate-180'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
              disabled={card.isMatched}
            >
              {(card.isFlipped || card.isMatched) && (
                <span className="transform -rotate-180">{card.content}</span>
              )}
            </button>
          ))}
        </div>

        {/* Game Complete Modal */}
        {isGameComplete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
              <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
              <p className="mb-6">
                You completed the game in {moves} moves!
              </p>
              <button
                onClick={initializeGame}
                className="px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200"
                style={{ background: theme.secondary }}
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemoryMatchMe; 