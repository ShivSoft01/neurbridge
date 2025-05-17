import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Coffee, Trees, Timer } from 'lucide-react';
import theme from '../../theme';

interface TreeState {
  id: number;
  growth: number;
  x: number;
  y: number;
}

function FocusForest() {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionLength, setSessionLength] = useState(5); // Default 5 minutes
  const [trees, setTrees] = useState<TreeState[]>([]);
  const [showBreak, setShowBreak] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [inactivityWarning, setInactivityWarning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inactivityRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize forest with random tree positions
  useEffect(() => {
    const initialTrees: TreeState[] = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      growth: 0,
      x: Math.random() * 80 + 10, // 10-90%
      y: Math.random() * 80 + 10,
    }));
    setTrees(initialTrees);
  }, []);

  // Handle timer
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setShowBreak(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  // Handle inactivity detection
  useEffect(() => {
    if (isActive) {
      const handleActivity = () => {
        setLastActivity(Date.now());
        setInactivityWarning(false);
      };

      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keypress', handleActivity);
      window.addEventListener('click', handleActivity);

      inactivityRef.current = setInterval(() => {
        const inactiveTime = Date.now() - lastActivity;
        if (inactiveTime > 30000) { // 30 seconds of inactivity
          setInactivityWarning(true);
          if (soundEnabled) {
            // Play gentle notification sound
            new Audio('/sounds/gentle-notification.mp3').play().catch(() => {});
          }
        }
      }, 5000);

      return () => {
        window.removeEventListener('mousemove', handleActivity);
        window.removeEventListener('keypress', handleActivity);
        window.removeEventListener('click', handleActivity);
        if (inactivityRef.current) clearInterval(inactivityRef.current);
      };
    }
  }, [isActive, lastActivity, soundEnabled]);

  // Update tree growth based on progress
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const progress = ((sessionLength * 60 - timeLeft) / (sessionLength * 60)) * 100;
      setTrees((prevTrees) =>
        prevTrees.map((tree) => ({
          ...tree,
          growth: Math.min(100, progress),
        }))
      );
    }
  }, [timeLeft, sessionLength, isActive]);

  const handleStart = () => {
    setTimeLeft(sessionLength * 60);
    setIsActive(true);
    setShowBreak(false);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleBreak = () => {
    setShowBreak(false);
    setIsActive(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8 ml-64 min-h-screen" style={{ background: theme.primary }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2" style={{ color: theme.text }}>
            <Trees className="w-8 h-8" />
            Focus Forest
          </h1>
          <p className="mt-2" style={{ color: theme.text }}>
            Grow your forest by staying focused! 🌲
          </p>
        </div>

        {/* Timer Controls */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Timer className="w-6 h-6" style={{ color: theme.secondary }} />
              <span className="text-2xl font-bold" style={{ color: theme.text }}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  soundEnabled ? 'bg-green-100' : 'bg-gray-100'
                }`}
              >
                🔊
              </button>
              <select
                value={sessionLength}
                onChange={(e) => setSessionLength(Number(e.target.value))}
                className="p-2 rounded-lg border border-gray-200 focus:outline-none"
                style={{ borderColor: theme.secondary }}
                disabled={isActive}
              >
                {[5, 10, 15, 20, 25].map((length) => (
                  <option key={length} value={length}>
                    {length} minutes
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            {!isActive ? (
              <button
                onClick={handleStart}
                className="px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200 flex items-center gap-2"
                style={{ background: theme.secondary }}
              >
                <Play className="w-5 h-5" />
                Start Focus
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200 flex items-center gap-2"
                style={{ background: theme.secondary }}
              >
                <Pause className="w-5 h-5" />
                Pause
              </button>
            )}
            {showBreak && (
              <button
                onClick={handleBreak}
                className="px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200 flex items-center gap-2"
                style={{ background: theme.accent }}
              >
                <Coffee className="w-5 h-5" />
                Take a Break
              </button>
            )}
          </div>

          {inactivityWarning && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-50 text-yellow-800 text-center">
              I notice you've been inactive. Would you like to take a break? 🌟
            </div>
          )}
        </div>

        {/* Forest Visualization */}
        <div className="bg-white rounded-xl p-6 shadow-lg relative" style={{ height: '400px' }}>
          {trees.map((tree) => (
            <div
              key={tree.id}
              className="absolute transition-all duration-500"
              style={{
                left: `${tree.x}%`,
                top: `${tree.y}%`,
                transform: `scale(${0.5 + (tree.growth / 100) * 0.5})`,
              }}
            >
              <Trees
                className="w-12 h-12 transition-colors duration-200"
                style={{
                  color: tree.growth === 100 ? theme.accent : theme.secondary,
                }}
              />
            </div>
          ))}
        </div>

        {/* Progress Ring */}
        <div className="mt-6 flex justify-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: `conic-gradient(${theme.secondary} ${(timeLeft / (sessionLength * 60)) * 100}%, transparent 0%)`,
            }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: theme.white }}
            >
              <span className="text-lg font-bold" style={{ color: theme.text }}>
                {Math.round((timeLeft / (sessionLength * 60)) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FocusForest; 