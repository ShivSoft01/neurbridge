import React, { useState, useEffect, useRef } from 'react';
import { Compass, Heart, Book, Pencil, Star, Volume2, Map as MapIcon } from 'lucide-react';
import theme from '../../theme';

interface Emotion {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  story: {
    title: string;
    content: string;
    question: string;
    options: string[];
  };
  activity: {
    type: 'matching' | 'reflection' | 'scenario';
    title: string;
  description: string;
    content: any;
  };
}

const emotions: Emotion[] = [
  {
    id: 'joy',
    name: 'Joy Island',
    emoji: '😊',
    color: '#FFD700',
    description: 'A bright and sunny place where happiness grows!',
    story: {
      title: 'The Birthday Surprise',
      content: 'Sarah woke up to find her room decorated with balloons and streamers. Her family had planned a surprise party!',
      question: 'What makes you feel as happy as Sarah?',
      options: ['Playing with friends', 'Getting a hug', 'Achieving a goal', 'Having fun with family'],
    },
    activity: {
      type: 'matching',
      title: 'Joy Matching',
      description: 'Match these happy moments with their emotions',
      content: [
        { situation: 'Winning a game', emotion: 'Proud and happy' },
        { situation: 'Helping a friend', emotion: 'Warm and glad' },
        { situation: 'Learning something new', emotion: 'Excited and curious' },
      ],
    },
  },
  {
    id: 'calm',
    name: 'Calm Cove',
    emoji: '😌',
    color: '#98FB98',
    description: 'A peaceful beach where worries float away...',
    story: {
      title: 'The Quiet Garden',
      content: 'Maya found a secret garden where she could sit quietly and watch butterflies dance in the sunshine.',
      question: 'Where do you feel most peaceful?',
      options: ['In my room', 'Outside in nature', 'Reading a book', 'With my pet'],
    },
    activity: {
      type: 'reflection',
      title: 'Calm Moments',
      description: 'Draw or write about your calm place',
      content: {
        prompt: 'What does your calm place look like?',
        suggestions: ['Draw the colors you see', 'What sounds do you hear?', 'How does it make you feel?'],
      },
    },
  },
  {
    id: 'worry',
    name: 'Worry Woods',
    emoji: '😟',
    color: '#B0C4DE',
    description: 'A forest where we learn to face our fears...',
    story: {
      title: 'The Big Test',
      content: 'Tom had a math test tomorrow and his tummy felt like butterflies. He learned to take deep breaths and prepare step by step.',
      question: 'What helps you feel better when you\'re worried?',
      options: ['Taking deep breaths', 'Talking to someone', 'Making a plan', 'Getting a hug'],
    },
    activity: {
      type: 'scenario',
      title: 'Worry Solutions',
      description: 'Help others find ways to feel better',
      content: [
        { situation: 'New school day', solution: 'Pack your bag the night before' },
        { situation: 'Big presentation', solution: 'Practice with a friend' },
        { situation: 'Difficult homework', solution: 'Break it into smaller parts' },
      ],
    },
  },
];

interface JournalEntry {
  id: string;
  emotion: string;
  text: string;
  timestamp: Date;
  emoji: string;
}

function EmotionExplorer() {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [view, setView] = useState<'map' | 'story' | 'activity' | 'journal'>('map');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [reflectionText, setReflectionText] = useState('');
  const [emotionGems, setEmotionGems] = useState<number>(0);

  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    speechSynthesisRef.current = new SpeechSynthesisUtterance();
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text: string) => {
    if (!audioEnabled || !speechSynthesisRef.current) return;
    window.speechSynthesis.cancel();
    speechSynthesisRef.current.text = text;
    window.speechSynthesis.speak(speechSynthesisRef.current);
  };

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    setView('story');
    speakText(`Welcome to ${emotion.name}! ${emotion.description}`);
  };

  const handleActivityComplete = () => {
    if (!selectedEmotion) return;
    
    if (!completedActivities.includes(selectedEmotion.id)) {
      setCompletedActivities([...completedActivities, selectedEmotion.id]);
      setEmotionGems(prev => prev + 1);
      speakText('Great job! You earned an emotion gem! 🌟');
    }
  };

  const addJournalEntry = () => {
    if (!selectedEmotion || !reflectionText) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      emotion: selectedEmotion.name,
      text: reflectionText,
      timestamp: new Date(),
      emoji: selectedEmotion.emoji,
    };

    setJournalEntries([newEntry, ...journalEntries]);
    setReflectionText('');
    handleActivityComplete();
  };

  const renderMap = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {emotions.map((emotion) => (
        <button
          key={emotion.id}
          onClick={() => handleEmotionSelect(emotion)}
          className="p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          style={{
            background: emotion.color + '33', // Add transparency
            border: `2px solid ${emotion.color}`,
          }}
        >
          <div className="flex flex-col items-center gap-4">
            <span className="text-4xl">{emotion.emoji}</span>
            <h3 className="text-xl font-bold" style={{ color: theme.text }}>
              {emotion.name}
            </h3>
            <p className="text-sm text-center" style={{ color: theme.text }}>
              {emotion.description}
            </p>
            {completedActivities.includes(emotion.id) && (
              <Star className="w-6 h-6" style={{ color: emotion.color }} />
            )}
          </div>
        </button>
      ))}
    </div>
  );

  const renderStory = () => {
    if (!selectedEmotion) return null;
  return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>
          {selectedEmotion.story.title}
        </h2>
        <p className="mb-6" style={{ color: theme.text }}>
          {selectedEmotion.story.content}
        </p>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>
            {selectedEmotion.story.question}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {selectedEmotion.story.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setView('activity')}
                className="p-4 rounded-lg transition-colors duration-200"
                style={{ background: theme.primary, color: theme.text }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderActivity = () => {
    if (!selectedEmotion) return null;
    const { activity } = selectedEmotion;

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>
          {activity.title}
        </h2>
        <p className="mb-6" style={{ color: theme.text }}>
          {activity.description}
        </p>

        {activity.type === 'reflection' && (
          <div className="space-y-4">
            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="Write your thoughts here..."
              className="w-full p-4 rounded-lg border-2"
              style={{ borderColor: theme.secondary }}
              rows={6}
            />
          <button
              onClick={addJournalEntry}
              className="px-6 py-3 rounded-lg text-white font-medium"
              style={{ background: theme.secondary }}
          >
              Save Reflection
          </button>
        </div>
        )}

        {activity.type === 'matching' && (
          <div className="space-y-4">
            {activity.content.map((item: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg"
                style={{ background: theme.primary }}
              >
                <span style={{ color: theme.text }}>{item.situation}</span>
                <span style={{ color: theme.secondary }}>→</span>
                <span style={{ color: theme.text }}>{item.emotion}</span>
          </div>
            ))}
            </div>
          )}

        {activity.type === 'scenario' && (
          <div className="space-y-4">
            {activity.content.map((item: any, index: number) => (
              <div
                key={index}
                className="p-4 rounded-lg"
                style={{ background: theme.primary }}
              >
                <h3 className="font-semibold mb-2" style={{ color: theme.text }}>
                  {item.situation}
                </h3>
                <p style={{ color: theme.secondary }}>{item.solution}</p>
                  </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 ml-64 min-h-screen" style={{ background: theme.primary }}>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2" style={{ color: theme.text }}>
            <Compass className="w-8 h-8" />
            Emotion Explorer
          </h1>
          <p className="mt-2" style={{ color: theme.text }}>
            Explore your feelings and earn emotion gems! 💎 {emotionGems}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2"
            title={audioEnabled ? "Mute Sounds" : "Unmute Sounds"}
          >
            <Volume2 className={`w-6 h-6 ${audioEnabled ? '' : 'opacity-50'}`} style={{ color: theme.secondary }} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setView('map')}
          className="px-4 py-2 rounded-lg flex items-center gap-2"
          style={{
            background: view === 'map' ? theme.secondary : theme.primary,
            color: view === 'map' ? theme.white : theme.text,
          }}
        >
          <MapIcon className="w-5 h-5" />
          Emotion Map
        </button>
        {selectedEmotion && (
          <>
            <button
              onClick={() => setView('story')}
              className="px-4 py-2 rounded-lg flex items-center gap-2"
              style={{
                background: view === 'story' ? theme.secondary : theme.primary,
                color: view === 'story' ? theme.white : theme.text,
              }}
            >
              <Book className="w-5 h-5" />
              Story
            </button>
            <button
              onClick={() => setView('activity')}
              className="px-4 py-2 rounded-lg flex items-center gap-2"
              style={{
                background: view === 'activity' ? theme.secondary : theme.primary,
                color: view === 'activity' ? theme.white : theme.text,
              }}
            >
              <Heart className="w-5 h-5" />
              Activity
            </button>
            <button
              onClick={() => setView('journal')}
              className="px-4 py-2 rounded-lg flex items-center gap-2"
              style={{
                background: view === 'journal' ? theme.secondary : theme.primary,
                color: view === 'journal' ? theme.white : theme.text,
              }}
            >
              <Pencil className="w-5 h-5" />
              Journal
            </button>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        {view === 'map' && renderMap()}
        {view === 'story' && renderStory()}
        {view === 'activity' && renderActivity()}
        {view === 'journal' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold" style={{ color: theme.text }}>
              My Emotion Journal
            </h2>
            {journalEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-lg"
                style={{ background: theme.primary }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{entry.emoji}</span>
                  <span className="font-semibold" style={{ color: theme.text }}>
                    {entry.emotion}
                  </span>
                  <span className="text-sm" style={{ color: theme.text }}>
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ color: theme.text }}>{entry.text}</p>
              </div>
            ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default EmotionExplorer; 