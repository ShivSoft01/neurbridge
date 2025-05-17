import React from 'react';
import { Trees, Cloud, BookOpen, Compass, Rocket, Clock, Brain, PencilLine, Wind, Map, Puzzle, Target, Circle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import theme from '../theme';

interface GameCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  path: string;
  progress?: number;
}

const GameCard: React.FC<GameCardProps> = ({ icon: Icon, title, description, path, progress = 0 }) => {
  return (
    <Link
      to={path}
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="flex flex-col items-center text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: theme.primary }}
        >
          <Icon className="w-8 h-8" style={{ color: theme.secondary }} />
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>
          {title}
        </h3>
        <p className="text-sm mb-4" style={{ color: theme.text }}>
          {description}
        </p>
        {/* Progress indicator */}
        <div className="w-full h-2 bg-gray-100 rounded-full">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: theme.secondary,
            }}
          />
        </div>
      </div>
    </Link>
  );
};

const games: GameCardProps[] = [
  {
    icon: Trees,
    title: 'Focus Forest',
    description: 'Grow a magical forest by staying focused.',
    path: '/games/focus-forest',
    progress: 45,
  },
  {
    icon: Circle,
    title: 'Bubble Focus Pop',
    description: 'Pop bubbles based on patterns and rules.',
    path: '/games/bubble-focus',
    progress: 10,
  },
  {
    icon: BookOpen,
    title: 'Word Builder Island',
    description: 'Build words and explore phonics zones.',
    path: '/games/word-builder',
    progress: 0,
  },
  {
    icon: Heart,
    title: 'Emotion Explorer',
    description: 'Navigate through emotion islands and learn about feelings',
    path: '/games/emotion-explorer',
    progress: 0,
  },
  {
    icon: Rocket,
    title: 'Math Galaxy Rescue',
    description: 'Solve math problems to rescue aliens',
    path: '/games/math-galaxy',
    progress: 0,
  },
  {
    icon: Clock,
    title: 'Time Turtle',
    description: 'Learn to predict and manage task durations',
    path: '/games/time-turtle',
    progress: 0,
  },
  {
    icon: Puzzle,
    title: 'Memory Match Me',
    description: 'Train working memory with matching games.',
    path: '/games',
    progress: 0,
  },
  {
    icon: Puzzle,
    title: 'Creative Quest',
    description: 'Express yourself through drawing or writing.',
    path: '/games',
    progress: 0,
  },
  {
    icon: Puzzle,
    title: 'Breathe With Me',
    description: 'Practice calming breathing exercises.',
    path: '/games',
    progress: 0,
  },
  {
    icon: Puzzle,
    title: 'Task Tracker Quest',
    description: 'Turn tasks into interactive adventures.',
    path: '/games',
    progress: 0,
  },
];

function GameCenter() {
  return (
    <div className="p-8 ml-64" style={{ background: theme.primary }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>
          Game Center
        </h1>
        <p className="mt-2" style={{ color: theme.text }}>
          Choose your next learning adventure! 🎮
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game) => (
          <GameCard key={game.path} {...game} />
        ))}
      </div>
    </div>
  );
}

export default GameCenter; 