import React, { useState } from 'react';
import { Brain, Heart, MessageSquare, Activity, BookOpen, Music, Target, Palette, Grid, Zap, Puzzle, Gamepad2, TestTube } from 'lucide-react';
import FocusFlow from './FocusFlow';
import PatternPuzzle from './PatternPuzzle';
import MemoryMatch from './MemoryMatch';
import EmotionExplorer from './EmotionExplorer';
import ConversationQuest from './ConversationQuest';
import FocusFrenzy from './FocusFrenzy';
import SocialStoryBuilder from './SocialStoryBuilder';
import SensoryMatch from './SensoryMatch';

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
  games: Game[];
}

interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  component: React.ComponentType;
}

interface GameTabsProps {
  onGameSelect: (gameId: string) => void;
}

const GameTabs: React.FC<GameTabsProps> = ({ onGameSelect }) => {
  const [activeTab, setActiveTab] = useState('focus');

  const games: Game[] = [
    // Focus Games
    {
      id: 'focus_flow',
      title: 'Focus Flow',
      description: 'Stay focused and react quickly to visual cues.',
      icon: Zap,
      component: FocusFlow
    },
    {
      id: 'focus_frenzy',
      title: 'Focus Frenzy',
      description: 'Stay focused on moving objects while avoiding distractions.',
      icon: Target,
      component: FocusFrenzy
    },
    {
      id: 'pattern_puzzle',
      title: 'Pattern Puzzle',
      description: 'Complete patterns and improve cognitive flexibility.',
      icon: Puzzle,
      component: PatternPuzzle
    },
    {
      id: 'memory_match',
      title: 'Memory Match',
      description: 'Test and improve your memory by matching pairs of cards.',
      icon: Grid,
      component: MemoryMatch
    },

    // Social Games
    {
      id: 'emotion_explorer',
      title: 'Emotion Explorer',
      description: 'Learn to identify emotions in different situations.',
      icon: Heart,
      component: EmotionExplorer
    },
    {
      id: 'social_story',
      title: 'Social Story Builder',
      description: 'Create your own social stories with different elements.',
      icon: BookOpen,
      component: SocialStoryBuilder
    },

    // Communication Games
    {
      id: 'conversation_quest',
      title: 'Conversation Quest',
      description: 'Learn how to handle different social situations.',
      icon: MessageSquare,
      component: ConversationQuest
    },

    // Sensory Games
    {
      id: 'sensory_match',
      title: 'Sensory Match',
      description: 'Match items to their sensory categories.',
      icon: Palette,
      component: SensoryMatch
    }
  ];

  const tabs: Tab[] = [
    {
      id: 'focus',
      label: 'Focus Games',
      icon: Brain,
      games: games.filter(game => game.id.startsWith('focus_'))
    },
    {
      id: 'social',
      label: 'Social Games',
      icon: Heart,
      games: games.filter(game => game.id.startsWith('emotion_') || game.id.startsWith('social_'))
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: MessageSquare,
      games: games.filter(game => game.id.startsWith('conversation_'))
    },
    {
      id: 'sensory',
      label: 'Sensory Games',
      icon: Palette,
      games: games.filter(game => game.id.startsWith('sensory_'))
    },
    {
      id: 'test',
      label: 'Test',
      icon: TestTube,
      games: []  // Empty for now, you can add test games later
    }
  ];

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-[#0066ff]" />
          <h2 className="text-2xl font-bold text-gray-800">{tabs.find(tab => tab.id === activeTab)?.label}</h2>
        </div>
        <div className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#0066ff] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tabs.find(tab => tab.id === activeTab)?.games.map((game) => {
          const Icon = game.icon;
          return (
            <button
              key={game.id}
              onClick={() => onGameSelect(game.id)}
              className="flex flex-col items-start p-6 bg-white rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <Icon className="w-8 h-8 text-[#0066ff] mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{game.title}</h3>
              <p className="text-gray-600 text-sm">{game.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GameTabs; 