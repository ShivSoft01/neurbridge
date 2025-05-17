import React, { useState, useEffect, useRef } from 'react';
import { Clock, Timer, Award, Volume2, HelpCircle, Play, Pause, RotateCcw } from 'lucide-react';
import theme from '../../theme';

interface Task {
  id: string;
  name: string;
  description: string;
  actualDuration: number; // in seconds
  category: 'homework' | 'chores' | 'activities' | 'self-care';
  difficulty: 1 | 2 | 3;
  completed: boolean;
  predictedTime?: number;
}

const tasks: Task[] = [
  {
    id: 'task1',
    name: 'Pack Your Backpack',
    description: 'Get your books, notebooks, and supplies ready for school',
    actualDuration: 180, // 3 minutes
    category: 'self-care',
    difficulty: 1,
    completed: false,
  },
  {
    id: 'task2',
    name: 'Quick Math Practice',
    description: 'Complete 5 basic math problems',
    actualDuration: 300, // 5 minutes
    category: 'homework',
    difficulty: 2,
    completed: false,
  },
  {
    id: 'task3',
    name: 'Clean Your Desk',
    description: 'Organize your workspace and put things away',
    actualDuration: 240, // 4 minutes
    category: 'chores',
    difficulty: 1,
    completed: false,
  },
  {
    id: 'task4',
    name: 'Reading Time',
    description: 'Read a short story or chapter',
    actualDuration: 360, // 6 minutes
    category: 'homework',
    difficulty: 2,
    completed: false,
  },
  {
    id: 'task5',
    name: 'Exercise Break',
    description: 'Do some stretches or simple exercises',
    actualDuration: 180, // 3 minutes
    category: 'activities',
    difficulty: 1,
    completed: false,
  },
];

interface GameState {
  score: number;
  currentTask: Task | null;
  predictedTime: number | null;
  elapsedTime: number;
  gamePhase: 'prediction' | 'execution' | 'feedback';
  isRunning: boolean;
  showTutorial: boolean;
  audioEnabled: boolean;
}

function TimeTurtle() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    currentTask: null,
    predictedTime: null,
    elapsedTime: 0,
    gamePhase: 'prediction',
    isRunning: false,
    showTutorial: true,
    audioEnabled: true,
  });

  const [availableTasks, setAvailableTasks] = useState<Task[]>(tasks);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (gameState.isRunning) {
      timerRef.current = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          elapsedTime: prev.elapsedTime + 1
        }));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.isRunning]);

  const startNewTask = () => {
    const randomTask = availableTasks[Math.floor(Math.random() * availableTasks.length)];
    setGameState(prev => ({
      ...prev,
      currentTask: randomTask,
      predictedTime: null,
      elapsedTime: 0,
      gamePhase: 'prediction',
      isRunning: false,
    }));
  };

  const handlePrediction = (prediction: number) => {
    if (!gameState.currentTask) return;
    
    setGameState(prev => ({
      ...prev,
      predictedTime: prediction,
      gamePhase: 'execution',
    }));
  };

  const startTask = () => {
    setGameState(prev => ({
      ...prev,
      isRunning: true,
    }));
  };

  const pauseTask = () => {
    setGameState(prev => ({
      ...prev,
      isRunning: false,
    }));
  };

  const completeTask = () => {
    if (!gameState.currentTask || !gameState.predictedTime) return;

    const actualTime = gameState.currentTask.actualDuration;
    const predictedTime = gameState.predictedTime;
    const timeDiff = Math.abs(actualTime - predictedTime);
    const accuracy = Math.max(0, 100 - (timeDiff / actualTime) * 100);
    const points = Math.floor(accuracy / 10);

    if (gameState.audioEnabled && audioRef.current) {
      audioRef.current.play();
    }

    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      gamePhase: 'feedback',
      isRunning: false,
    }));

    setAvailableTasks(prev => 
      prev.filter(task => task.id !== gameState.currentTask?.id)
    );
  };

  const renderPredictionPhase = () => (
    <div className="bg-white rounded-xl p-6 max-w-md mx-auto" style={{ border: `2px solid ${theme.secondary}` }}>
      <h3 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>
        How long will this take? 🤔
      </h3>
      <div className="mb-6">
        <h4 className="text-lg font-semibold" style={{ color: theme.text }}>
          {gameState.currentTask?.name}
        </h4>
        <p className="mt-2" style={{ color: theme.text }}>
          {gameState.currentTask?.description}
        </p>
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(minutes => (
          <button
            key={minutes}
            onClick={() => handlePrediction(minutes * 60)}
            className="w-full py-2 rounded-lg transition-colors duration-200"
            style={{
              background: theme.primary,
              color: theme.text,
            }}
          >
            {minutes} minute{minutes > 1 ? 's' : ''}
          </button>
        ))}
      </div>
    </div>
  );

  const renderExecutionPhase = () => (
    <div className="bg-white rounded-xl p-6 max-w-md mx-auto" style={{ border: `2px solid ${theme.secondary}` }}>
      <h3 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>
        Time to complete the task! ⏳
      </h3>
      <div className="mb-6">
        <h4 className="text-lg font-semibold" style={{ color: theme.text }}>
          {gameState.currentTask?.name}
        </h4>
        <p className="mt-2" style={{ color: theme.text }}>
          {gameState.currentTask?.description}
        </p>
      </div>
      <div className="text-center mb-6">
        <div className="text-4xl font-bold" style={{ color: theme.secondary }}>
          {Math.floor(gameState.elapsedTime / 60)}:{(gameState.elapsedTime % 60).toString().padStart(2, '0')}
        </div>
        <p className="mt-2" style={{ color: theme.text }}>
          Your prediction: {Math.floor((gameState.predictedTime || 0) / 60)} minutes
        </p>
      </div>
      <div className="space-x-4">
        {!gameState.isRunning ? (
          <button
            onClick={startTask}
            className="px-6 py-2 rounded-lg"
            style={{ background: theme.secondary, color: theme.white }}
          >
            <Play className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={pauseTask}
            className="px-6 py-2 rounded-lg"
            style={{ background: theme.secondary, color: theme.white }}
          >
            <Pause className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={completeTask}
          className="px-6 py-2 rounded-lg"
          style={{ background: theme.primary, color: theme.text }}
        >
          Done!
        </button>
      </div>
    </div>
  );

  const renderFeedbackPhase = () => {
    if (!gameState.currentTask || !gameState.predictedTime) return null;

    const actualTime = gameState.currentTask.actualDuration;
    const predictedTime = gameState.predictedTime;
    const timeDiff = Math.abs(actualTime - predictedTime);
    const accuracy = Math.max(0, 100 - (timeDiff / actualTime) * 100);

    return (
      <div className="bg-white rounded-xl p-6 max-w-md mx-auto text-center" style={{ border: `2px solid ${theme.secondary}` }}>
        <Award className="w-16 h-16 mx-auto mb-4" style={{ color: theme.secondary }} />
        <h3 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>
          Task Complete! 🎉
        </h3>
        <div className="space-y-4 mb-6">
          <p style={{ color: theme.text }}>
            Your prediction: {Math.floor(predictedTime / 60)} minutes
          </p>
          <p style={{ color: theme.text }}>
            Actual time: {Math.floor(actualTime / 60)} minutes
          </p>
          <p className="text-lg font-semibold" style={{ color: theme.secondary }}>
            Accuracy: {Math.round(accuracy)}%
          </p>
          <p style={{ color: theme.text }}>
            Total Score: {gameState.score}
          </p>
        </div>
        {availableTasks.length > 0 ? (
          <button
            onClick={startNewTask}
            className="px-6 py-2 rounded-lg"
            style={{ background: theme.secondary, color: theme.white }}
          >
            Next Task
          </button>
        ) : (
          <div>
            <h4 className="text-xl font-bold mb-2" style={{ color: theme.text }}>
              Game Complete!
            </h4>
            <p style={{ color: theme.text }}>
              Final Score: {gameState.score}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-lg mt-4"
              style={{ background: theme.secondary, color: theme.white }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderTutorial = () => (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-md" style={{ border: `2px solid ${theme.secondary}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>How to Play</h2>
        <ul className="space-y-2" style={{ color: theme.text }}>
          <li>• Predict how long each task will take</li>
          <li>• Complete the task within your predicted time</li>
          <li>• Get points for accurate predictions</li>
          <li>• Learn to manage your time better!</li>
        </ul>
        <button
          onClick={() => {
            setGameState(prev => ({ ...prev, showTutorial: false }));
            startNewTask();
          }}
          className="mt-6 px-6 py-2 rounded-lg w-full"
          style={{ background: theme.secondary, color: theme.white }}
        >
          Start Playing!
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-8 ml-64 min-h-screen relative" style={{ background: theme.primary }}>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2" style={{ color: theme.text }}>
            <Clock className="w-8 h-8" />
            Time Turtle
          </h1>
          <p className="mt-2" style={{ color: theme.text }}>
            Score: {gameState.score} • Tasks Remaining: {availableTasks.length}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setGameState(prev => ({ ...prev, audioEnabled: !prev.audioEnabled }))}
            className="p-2 rounded-lg"
            style={{ background: theme.white }}
          >
            <Volume2 
              className={`w-6 h-6 ${gameState.audioEnabled ? '' : 'opacity-50'}`}
              style={{ color: theme.secondary }}
            />
          </button>
          <button
            onClick={() => setGameState(prev => ({ ...prev, showTutorial: true }))}
            className="p-2 rounded-lg"
            style={{ background: theme.white }}
          >
            <HelpCircle className="w-6 h-6" style={{ color: theme.secondary }} />
          </button>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
        {gameState.showTutorial && renderTutorial()}
        {!gameState.showTutorial && (
          <>
            {gameState.gamePhase === 'prediction' && renderPredictionPhase()}
            {gameState.gamePhase === 'execution' && renderExecutionPhase()}
            {gameState.gamePhase === 'feedback' && renderFeedbackPhase()}
          </>
        )}
      </div>

      {/* Audio Elements */}
      <audio ref={audioRef} src="/success-sound.mp3" />
    </div>
  );
}

export default TimeTurtle; 