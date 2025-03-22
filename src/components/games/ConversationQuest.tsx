import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface ConversationStep {
  id: string;
  scenario: string;
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

const conversationSteps: ConversationStep[] = [
  {
    id: '1',
    scenario: "Your friend is showing you their new toy. What should you say?",
    options: [
      { text: "That's cool! Can you tell me more about it?", isCorrect: true, feedback: "Great job! Showing interest in others' interests is a good way to make friends!" },
      { text: "I have a better toy.", isCorrect: false, feedback: "That might hurt your friend's feelings. Try being supportive instead!" },
      { text: "I don't care.", isCorrect: false, feedback: "That's not very friendly. Try showing interest in what your friend is sharing!" }
    ]
  },
  {
    id: '2',
    scenario: "Someone accidentally bumped into you. What should you say?",
    options: [
      { text: "It's okay, no worries!", isCorrect: true, feedback: "That's very kind! Being understanding helps maintain good relationships." },
      { text: "Watch where you're going!", isCorrect: false, feedback: "Getting angry might make the situation worse. Try being understanding!" },
      { text: "You're so clumsy!", isCorrect: false, feedback: "That's not very nice. Try being more understanding of accidents!" }
    ]
  },
  {
    id: '3',
    scenario: "Your friend is feeling sad. What should you say?",
    options: [
      { text: "I'm here for you. Would you like to talk about it?", isCorrect: true, feedback: "That's very supportive! Being there for friends is important." },
      { text: "Just get over it.", isCorrect: false, feedback: "That's not very helpful. Try being more supportive!" },
      { text: "I don't have time for this.", isCorrect: false, feedback: "That might make your friend feel worse. Try being more caring!" }
    ]
  },
  {
    id: '4',
    scenario: "You want to join a game that others are playing. What should you say?",
    options: [
      { text: "Can I join the game?", isCorrect: true, feedback: "That's polite! Asking nicely is a good way to join activities." },
      { text: "Let me play!", isCorrect: false, feedback: "That might sound demanding. Try asking politely!" },
      { text: "I want to play too!", isCorrect: false, feedback: "That might sound too demanding. Try asking nicely!" }
    ]
  },
  {
    id: '5',
    scenario: "Someone is talking to you but you're busy. What should you say?",
    options: [
      { text: "I'm busy right now, but I'll talk to you in a few minutes.", isCorrect: true, feedback: "That's respectful! Being honest while staying friendly is important." },
      { text: "Go away!", isCorrect: false, feedback: "That's not very nice. Try being more polite!" },
      { text: "I don't want to talk to you.", isCorrect: false, feedback: "That might hurt their feelings. Try being more polite!" }
    ]
  }
];

const ConversationQuest: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);

  const startGame = () => {
    setCurrentStep(0);
    setScore(0);
    setGameState('playing');
    setFeedback(null);
  };

  const handleOptionSelect = (isCorrect: boolean, feedback: string) => {
    setFeedback(feedback);
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentStep + 1 >= conversationSteps.length) {
        setGameState('finished');
      } else {
        setCurrentStep(currentStep + 1);
        setFeedback(null);
      }
    }, 2000);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-[#0066ff]" />
          <h2 className="text-2xl font-bold text-gray-800">Conversation Quest</h2>
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
          <p className="text-gray-600 mb-4">Learn how to handle different social situations!</p>
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
            <h3 className="text-xl font-semibold mb-4">Scenario {currentStep + 1}:</h3>
            <p className="text-gray-700 text-lg">{conversationSteps[currentStep].scenario}</p>
          </div>

          {feedback && (
            <div className={`text-center text-xl font-semibold ${
              feedback.includes('Great') || feedback.includes('That\'s very') ? 'text-green-600' : 'text-red-600'
            }`}>
              {feedback}
            </div>
          )}

          <div className="space-y-4">
            {conversationSteps[currentStep].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option.isCorrect, option.feedback)}
                disabled={!!feedback}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  feedback
                    ? option.isCorrect
                      ? 'bg-green-100'
                      : 'bg-red-100'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold text-green-600 mb-4">Game Complete!</h3>
          <div className="space-y-2 mb-6">
            <p className="text-gray-600">Final Score: <span className="font-bold">{score}</span></p>
            <p className="text-gray-600">Out of: <span className="font-bold">{conversationSteps.length}</span></p>
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

export default ConversationQuest; 