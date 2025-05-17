import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import theme from '../../theme';

interface BreathingPhase {
  name: string;
  duration: number;
  instruction: string;
}

function BreatheWithMe() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState('box');

  const breathingPatterns = {
    box: [
      { name: 'Inhale', duration: 4, instruction: 'Breathe in slowly' },
      { name: 'Hold', duration: 4, instruction: 'Hold your breath' },
      { name: 'Exhale', duration: 4, instruction: 'Breathe out slowly' },
      { name: 'Hold', duration: 4, instruction: 'Hold your breath' },
    ],
    relax: [
      { name: 'Inhale', duration: 4, instruction: 'Breathe in deeply' },
      { name: 'Exhale', duration: 8, instruction: 'Breathe out slowly' },
    ],
    energize: [
      { name: 'Inhale', duration: 6, instruction: 'Breathe in deeply' },
      { name: 'Hold', duration: 2, instruction: 'Hold briefly' },
      { name: 'Exhale', duration: 4, instruction: 'Breathe out' },
    ],
  };

  const currentPattern = breathingPatterns[selectedPattern as keyof typeof breathingPatterns];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setCurrentPhase(prev => (prev + 1) % currentPattern.length);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, currentPattern.length]);

  useEffect(() => {
    setTimeLeft(currentPattern[currentPhase].duration);
  }, [currentPhase, currentPattern]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const resetExercise = () => {
    setIsPlaying(false);
    setCurrentPhase(0);
    setTimeLeft(currentPattern[0].duration);
  };

  const getCircleScale = () => {
    const phase = currentPattern[currentPhase];
    const progress = timeLeft / phase.duration;
    
    switch (phase.name) {
      case 'Inhale':
        return 1 + (1 - progress) * 0.5;
      case 'Exhale':
        return 1.5 - (1 - progress) * 0.5;
      default:
        return 1.5;
    }
  };

  return (
    <div className="p-8 ml-64 min-h-screen" style={{ background: theme.primary }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: theme.text }}>
            Breathe With Me
          </h1>
          <p className="mt-2" style={{ color: theme.text }}>
            Take a moment to breathe and relax 🌿
          </p>
        </div>

        {/* Breathing Pattern Selection */}
        <div className="bg-white rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Choose a Breathing Pattern</h2>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setSelectedPattern('box')}
              className={`p-4 rounded-lg text-center transition-colors ${
                selectedPattern === 'box'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <h3 className="font-medium">Box Breathing</h3>
              <p className="text-sm text-gray-600">4-4-4-4</p>
            </button>
            <button
              onClick={() => setSelectedPattern('relax')}
              className={`p-4 rounded-lg text-center transition-colors ${
                selectedPattern === 'relax'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <h3 className="font-medium">Relaxing Breath</h3>
              <p className="text-sm text-gray-600">4-8</p>
            </button>
            <button
              onClick={() => setSelectedPattern('energize')}
              className={`p-4 rounded-lg text-center transition-colors ${
                selectedPattern === 'energize'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <h3 className="font-medium">Energizing Breath</h3>
              <p className="text-sm text-gray-600">6-2-4</p>
            </button>
          </div>
        </div>

        {/* Breathing Animation */}
        <div className="bg-white rounded-xl p-8 mb-8 text-center">
          <div
            className="w-64 h-64 mx-auto rounded-full mb-6 transition-all duration-1000"
            style={{
              background: theme.secondary,
              transform: `scale(${getCircleScale()})`,
              opacity: 0.8,
            }}
          />
          <h2 className="text-2xl font-bold mb-2">
            {currentPattern[currentPhase].name}
          </h2>
          <p className="text-gray-600 mb-4">
            {currentPattern[currentPhase].instruction}
          </p>
          <p className="text-4xl font-mono">{timeLeft}</p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-lg bg-white hover:bg-gray-100"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-white hover:bg-gray-100"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </button>
          <button
            onClick={resetExercise}
            className="p-2 rounded-lg bg-white hover:bg-gray-100"
          >
            <RefreshCw className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BreatheWithMe; 