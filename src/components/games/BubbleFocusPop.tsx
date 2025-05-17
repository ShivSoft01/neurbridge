import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Target, Circle, Square, Triangle, RefreshCw, Volume2, EyeOff } from 'lucide-react';
import theme from '../../theme';

interface Bubble {
  id: number;
  x: number;
  y: number;
  color: string;
  pattern: 'solid' | 'striped';
  shape: 'circle' | 'square' | 'triangle';
  isTarget: boolean;
  popped: boolean;
}

type Rule = {
  type: 'color' | 'shape' | 'pattern';
  value: string;
  description: string;
};

const colors = [theme.secondary, theme.accent, '#FBBF24', '#F87171']; // Yellow, Red
const shapes: Bubble['shape'][] = ['circle', 'square', 'triangle'];
const patterns: Bubble['pattern'][] = ['solid', 'striped'];

const generateRule = (): Rule => {
  const ruleType = Math.random() < 0.33 ? 'color' : Math.random() < 0.66 ? 'shape' : 'pattern';
  let value: string;
  let description: string;

  switch (ruleType) {
    case 'color':
      value = colors[Math.floor(Math.random() * colors.length)];
      description = `Pop only the bubbles with color ${value}`;
      break;
    case 'shape':
      value = shapes[Math.floor(Math.random() * shapes.length)];
      description = `Pop only the ${value} bubbles`;
      break;
    case 'pattern':
      value = patterns[Math.floor(Math.random() * patterns.length)];
      description = `Pop only the ${value} bubbles`;
      break;
  }
  return { type: ruleType, value, description };
};

const generateBubble = (id: number, rule: Rule, difficulty: number): Bubble => {
  const isTarget = Math.random() < (0.4 + difficulty * 0.1); // Increase target probability with difficulty
  let color = colors[Math.floor(Math.random() * colors.length)];
  let shape = shapes[Math.floor(Math.random() * shapes.length)];
  let pattern = patterns[Math.floor(Math.random() * patterns.length)];

  if (isTarget) {
    switch (rule.type) {
      case 'color': color = rule.value; break;
      case 'shape': shape = rule.value as Bubble['shape']; break;
      case 'pattern': pattern = rule.value as Bubble['pattern']; break;
    }
  } else {
    // Ensure non-target bubbles don't match the rule
    if (rule.type === 'color' && color === rule.value) color = colors.find(c => c !== rule.value) || colors[0];
    if (rule.type === 'shape' && shape === rule.value) shape = shapes.find(s => s !== rule.value) || shapes[0];
    if (rule.type === 'pattern' && pattern === rule.value) pattern = patterns.find(p => p !== rule.value) || patterns[0];
  }

  return {
    id,
    x: Math.random() * 90 + 5, // 5% to 95%
    y: 110, // Start below the screen
    color,
    shape,
    pattern,
    isTarget,
    popped: false,
  };
};

function BubbleFocusPop() {
  const [gameState, setGameState] = useState<'idle' | 'running' | 'paused' | 'finished'>('idle');
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [rule, setRule] = useState<Rule>(generateRule());
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [difficulty, setDifficulty] = useState(1); // 1-5
  const [timeLeft, setTimeLeft] = useState(30); // Seconds per round
  const [colorblindMode, setColorblindMode] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bubbleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const popSoundRef = useRef<HTMLAudioElement>(null);
  const missSoundRef = useRef<HTMLAudioElement>(null);

  const playSound = (soundRef: React.RefObject<HTMLAudioElement>) => {
    if (audioEnabled && soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(e => console.error("Error playing sound:", e));
    }
  };

  const startGame = useCallback(() => {
    setScore(0);
    setAccuracy(100);
    setTimeLeft(30);
    setBubbles([]);
    setRule(generateRule());
    setGameState('running');
    setDifficulty(prev => Math.max(1, Math.min(5, prev))); // Keep difficulty within bounds
  }, []);

  const popBubble = (id: number) => {
    setBubbles((prevBubbles) => {
      const poppedBubble = prevBubbles.find(b => b.id === id);
      if (!poppedBubble || poppedBubble.popped) return prevBubbles;

      const newScore = score + (poppedBubble.isTarget ? 10 : -5);
      const newAccuracy = accuracy - (poppedBubble.isTarget ? 0 : 5); // Simple accuracy adjustment
      setScore(Math.max(0, newScore));
      setAccuracy(Math.max(0, newAccuracy));

      if (poppedBubble.isTarget) {
        playSound(popSoundRef);
      } else {
        playSound(missSoundRef);
      }

      return prevBubbles.map((bubble) =>
        bubble.id === id ? { ...bubble, popped: true } : bubble
      );
    });
  };

  // Game Timer
  useEffect(() => {
    if (gameState === 'running' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0 && gameState === 'running') {
      setGameState('finished');
      // AI Difficulty Adjustment
      if (accuracy > 90 && score > 50) setDifficulty(prev => Math.min(5, prev + 1));
      else if (accuracy < 70 || score < 20) setDifficulty(prev => Math.max(1, prev - 1));
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timeLeft, accuracy, score]);

  // Bubble Generation and Movement
  useEffect(() => {
    if (gameState === 'running') {
      bubbleIntervalRef.current = setInterval(() => {
        setBubbles(prevBubbles => {
          const newBubble = generateBubble(Date.now(), rule, difficulty);
          const updatedBubbles = prevBubbles
            .map(b => ({ ...b, y: b.y - (0.5 + difficulty * 0.1) })) // Move faster with difficulty
            .filter(b => b.y > -10 && !b.popped); // Remove bubbles off-screen or popped

          return [...updatedBubbles, newBubble];
        });
      }, 2000 / difficulty); // Generate faster with difficulty
    }

    return () => {
      if (bubbleIntervalRef.current) clearInterval(bubbleIntervalRef.current);
    };
  }, [gameState, rule, difficulty]);


  const renderBubbleShape = (bubble: Bubble) => {
    const size = 50; // Base size
    const style = {
      fill: bubble.color,
      stroke: colorblindMode ? 'black' : 'none',
      strokeWidth: colorblindMode ? 2 : 0,
    };

    const patternId = `pattern-${bubble.id}`;

    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        {bubble.pattern === 'striped' && (
          <defs>
            <pattern id={patternId} patternUnits="userSpaceOnUse" width="10" height="10">
              <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke={colorblindMode ? 'black' : 'white'} strokeWidth="2"/>
            </pattern>
          </defs>
        )}
        {bubble.shape === 'circle' && <circle cx="50" cy="50" r="45" style={style} fill={bubble.pattern === 'striped' ? `url(#${patternId})` : style.fill} />}
        {bubble.shape === 'square' && <rect x="5" y="5" width="90" height="90" style={style} fill={bubble.pattern === 'striped' ? `url(#${patternId})` : style.fill} />}
        {bubble.shape === 'triangle' && <polygon points="50,5 95,95 5,95" style={style} fill={bubble.pattern === 'striped' ? `url(#${patternId})` : style.fill} />}
      </svg>
    );
  };

  return (
    <div className="p-8 ml-64 min-h-screen flex flex-col" style={{ background: theme.primary }}>
       <audio ref={popSoundRef} src="/sounds/pop.mp3" preload="auto"></audio>
       <audio ref={missSoundRef} src="/sounds/miss.mp3" preload="auto"></audio>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2" style={{ color: theme.text }}>
          <Target className="w-8 h-8" />
          Bubble Focus Pop
        </h1>
        <div className="flex gap-4">
           <button onClick={() => setAudioEnabled(!audioEnabled)} className="p-2" title={audioEnabled ? "Mute Sounds" : "Unmute Sounds"}>
             <Volume2 className={`w-6 h-6 ${audioEnabled ? '' : 'opacity-50'}`} style={{ color: theme.secondary }}/>
           </button>
           <button onClick={() => setColorblindMode(!colorblindMode)} className="p-2" title={colorblindMode ? "Disable Colorblind Mode" : "Enable Colorblind Mode"}>
             <EyeOff className={`w-6 h-6 ${colorblindMode ? '' : 'opacity-50'}`} style={{ color: theme.secondary }}/>
           </button>
        </div>
      </div>

      {/* Game Info Bar */}
      <div className="bg-white rounded-xl p-4 shadow-lg mb-4 flex justify-between items-center">
        <div>
          <span className="font-semibold" style={{ color: theme.text }}>Rule: </span>
          <span style={{ color: theme.secondary }}>{rule.description}</span>
        </div>
        <div className="flex gap-6">
          <span style={{ color: theme.text }}>Score: <span className="font-bold">{score}</span></span>
          <span style={{ color: theme.text }}>Accuracy: <span className="font-bold">{accuracy}%</span></span>
          <span style={{ color: theme.text }}>Time: <span className="font-bold">{timeLeft}s</span></span>
          <span style={{ color: theme.text }}>Difficulty: <span className="font-bold">{difficulty}</span></span>
        </div>
      </div>

      {/* Game Area */}
      <div ref={gameAreaRef} className="flex-grow bg-white rounded-xl shadow-lg relative overflow-hidden" style={{ minHeight: '500px' }}>
        {gameState === 'running' && bubbles.map((bubble) => (
          !bubble.popped && (
            <div
              key={bubble.id}
              className="absolute cursor-pointer transition-transform duration-100 ease-out hover:scale-110"
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => popBubble(bubble.id)}
            >
              {renderBubbleShape(bubble)}
            </div>
          )
        ))}

        {/* Game State Overlays */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50">
            <button
              onClick={startGame}
              className="px-8 py-4 rounded-lg text-white text-xl font-bold transition-colors duration-200 flex items-center gap-2"
              style={{ background: theme.secondary }}
            >
              Start Game
            </button>
          </div>
        )}
        {gameState === 'finished' && (
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 text-white">
            <h2 className="text-3xl font-bold mb-4">Round Over!</h2>
            <p className="text-xl mb-2">Final Score: {score}</p>
            <p className="text-xl mb-6">Accuracy: {accuracy}%</p>
            <button
              onClick={startGame}
              className="px-8 py-4 rounded-lg text-white text-xl font-bold transition-colors duration-200 flex items-center gap-2"
              style={{ background: theme.secondary }}
            >
             <RefreshCw className="w-6 h-6" /> Play Again (Difficulty: {difficulty})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BubbleFocusPop; 