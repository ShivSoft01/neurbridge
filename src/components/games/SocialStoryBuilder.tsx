import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface StoryElement {
  id: string;
  type: 'character' | 'action' | 'emotion' | 'setting';
  text: string;
  category: string;
}

const storyElements: StoryElement[] = [
  // Characters
  { id: 'char1', type: 'character', text: 'Alex', category: 'Characters' },
  { id: 'char2', type: 'character', text: 'Sam', category: 'Characters' },
  { id: 'char3', type: 'character', text: 'Teacher', category: 'Characters' },
  
  // Actions
  { id: 'act1', type: 'action', text: 'shared toys', category: 'Actions' },
  { id: 'act2', type: 'action', text: 'helped clean up', category: 'Actions' },
  { id: 'act3', type: 'action', text: 'took turns', category: 'Actions' },
  { id: 'act4', type: 'action', text: 'said hello', category: 'Actions' },
  
  // Emotions
  { id: 'em1', type: 'emotion', text: 'happy', category: 'Emotions' },
  { id: 'em2', type: 'emotion', text: 'excited', category: 'Emotions' },
  { id: 'em3', type: 'emotion', text: 'proud', category: 'Emotions' },
  { id: 'em4', type: 'emotion', text: 'friendly', category: 'Emotions' },
  
  // Settings
  { id: 'set1', type: 'setting', text: 'playground', category: 'Settings' },
  { id: 'set2', type: 'setting', text: 'classroom', category: 'Settings' },
  { id: 'set3', type: 'setting', text: 'park', category: 'Settings' },
];

const SocialStoryBuilder: React.FC = () => {
  const [selectedElements, setSelectedElements] = useState<StoryElement[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'building' | 'finished'>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);

  const startGame = () => {
    setSelectedElements([]);
    setGameState('building');
    setFeedback(null);
  };

  const handleElementSelect = (element: StoryElement) => {
    if (selectedElements.length >= 4) {
      setFeedback("You've reached the maximum number of elements!");
      return;
    }

    setSelectedElements(prev => [...prev, element]);
  };

  const handleElementRemove = (elementId: string) => {
    setSelectedElements(prev => prev.filter(el => el.id !== elementId));
  };

  const handleFinishStory = () => {
    if (selectedElements.length < 2) {
      setFeedback('Please add at least 2 elements to your story!');
      return;
    }

    const hasCharacter = selectedElements.some(el => el.type === 'character');
    const hasAction = selectedElements.some(el => el.type === 'action');
    
    if (!hasCharacter || !hasAction) {
      setFeedback('Your story needs at least one character and one action!');
      return;
    }

    setGameState('finished');
  };

  const getStoryText = () => {
    const character = selectedElements.find(el => el.type === 'character')?.text || '';
    const action = selectedElements.find(el => el.type === 'action')?.text || '';
    const emotion = selectedElements.find(el => el.type === 'emotion')?.text || '';
    const setting = selectedElements.find(el => el.type === 'setting')?.text || '';

    let story = `${character} `;
    if (emotion) story += `felt ${emotion} `;
    if (action) story += `and ${action} `;
    if (setting) story += `at the ${setting}.`;

    return story;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-[#0066ff]" />
          <h2 className="text-2xl font-bold text-gray-800">Social Story Builder</h2>
        </div>
      </div>

      {gameState === 'idle' ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Create your own social story by combining different elements!</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors"
          >
            Start Building
          </button>
        </div>
      ) : gameState === 'building' ? (
        <div className="space-y-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Your Story:</h3>
            <div className="min-h-[100px] flex flex-wrap gap-2">
              {selectedElements.map(element => (
                <div
                  key={element.id}
                  className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2"
                >
                  <span>{element.text}</span>
                  <button
                    onClick={() => handleElementRemove(element.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {feedback && (
            <div className="text-center text-xl font-semibold text-red-600">
              {feedback}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            {['Characters', 'Actions', 'Emotions', 'Settings'].map(category => (
              <div key={category} className="space-y-4">
                <h4 className="font-semibold text-lg">{category}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {storyElements
                    .filter(el => el.category === category)
                    .map(element => (
                      <button
                        key={element.id}
                        onClick={() => handleElementSelect(element)}
                        disabled={selectedElements.some(el => el.id === element.id)}
                        className={`p-2 rounded-lg text-left transition-all ${
                          selectedElements.some(el => el.id === element.id)
                            ? 'bg-gray-100 text-gray-400'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        {element.text}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleFinishStory}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Finish Story
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold text-green-600 mb-4">Your Story:</h3>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-xl">{getStoryText()}</p>
          </div>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors"
          >
            Create New Story
          </button>
        </div>
      )}
    </div>
  );
};

export default SocialStoryBuilder; 