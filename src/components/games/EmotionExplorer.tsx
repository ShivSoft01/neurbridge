import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface Emotion {
  id: string;
  emoji: string;
  name: string;
  description: string;
}

interface Scenario {
  id: string;
  description: string;
  correctEmotion: string;
  options: string[];
}

const emotions: Emotion[] = [
  { id: 'happy', emoji: '😊', name: 'Happy', description: 'Feeling joy or pleasure' },
  { id: 'sad', emoji: '😢', name: 'Sad', description: 'Feeling down or unhappy' },
  { id: 'angry', emoji: '😠', name: 'Angry', description: 'Feeling mad or upset' },
  { id: 'scared', emoji: '😨', name: 'Scared', description: 'Feeling afraid or worried' },
  { id: 'surprised', emoji: '😮', name: 'Surprised', description: 'Feeling shocked or amazed' },
  { id: 'excited', emoji: '🎉', name: 'Excited', description: 'Feeling enthusiastic or thrilled' },
];

const scenarios: Scenario[] = [
  {
    id: '1',
    description: "You just won a prize in a competition!",
    correctEmotion: 'happy',
    options: ['happy', 'sad', 'angry', 'scared']
  },
  {
    id: '2',
    description: "Your favorite toy broke.",
    correctEmotion: 'sad',
    options: ['happy', 'sad', 'excited', 'surprised']
  },
  {
    id: '3',
    description: "Someone took your turn in line.",
    correctEmotion: 'angry',
    options: ['happy', 'sad', 'angry', 'scared']
  },
  {
    id: '4',
    description: "You see a big spider crawling towards you.",
    correctEmotion: 'scared',
    options: ['happy', 'sad', 'angry', 'scared']
  },
  {
    id: '5',
    description: "Your friend gave you a surprise gift!",
    correctEmotion: 'surprised',
    options: ['happy', 'sad', 'surprised', 'angry']
  }
];

const EmotionExplorer: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (gameState === 'playing' && !currentScenario) {
      startNewScenario();
    }
  }, [gameState, currentScenario]);

  const startGame = () => {
    setScore(0);
    setGameState('playing');
    startNewScenario();
  };

  const startNewScenario = () => {
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    setCurrentScenario(randomScenario);
    setFeedback(null);
  };

  const handleEmotionSelect = (selectedEmotion: string) => {
    if (!currentScenario) return;

    const isCorrect = selectedEmotion === currentScenario.correctEmotion;
    setFeedback(isCorrect ? 'Correct! 🎉' : 'Try again! 💪');
    
    if (isCorrect) {
      setScore(score + 1);
      setTimeout(() => {
        if (score + 1 >= scenarios.length) {
          setGameState('finished');
        } else {
          startNewScenario();
        }
      }, 1000);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-[#0066ff]" />
          <h2 className="text-2xl font-bold text-gray-800">Emotion Explorer</h2>
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
          <p className="text-gray-600 mb-4">Learn to identify emotions in different situations!</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors"
          >
            Start Game
          </button>
        </div>
      ) : gameState === 'playing' ? (
        <div className="space-y-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Scenario:</h3>
            <p className="text-gray-700 text-lg">{currentScenario?.description}</p>
          </div>

          {feedback && (
            <div className={`text-center text-xl font-semibold ${
              feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'
            }`}>
              {feedback}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {currentScenario?.options.map((emotionId) => {
              const emotion = emotions.find(e => e.id === emotionId);
              if (!emotion) return null;
              
              return (
                <button
                  key={emotion.id}
                  onClick={() => handleEmotionSelect(emotion.id)}
                  disabled={!!feedback}
                  className={`p-4 rounded-lg flex items-center gap-3 transition-all ${
                    feedback
                      ? emotion.id === currentScenario.correctEmotion
                        ? 'bg-green-100'
                        : 'bg-red-100'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="text-3xl">{emotion.emoji}</span>
                  <div className="text-left">
                    <div className="font-medium">{emotion.name}</div>
                    <div className="text-sm text-gray-600">{emotion.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold text-green-600 mb-4">Game Complete!</h3>
          <div className="space-y-2 mb-6">
            <p className="text-gray-600">Final Score: <span className="font-bold">{score}</span></p>
            <p className="text-gray-600">Out of: <span className="font-bold">{scenarios.length}</span></p>
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

export default EmotionExplorer; 