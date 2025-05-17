import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Wind, Trees, Waves, Cloud } from 'lucide-react';
import theme from '../theme';

interface Exercise {
  id: number;
  title: string;
  description: string;
  duration: number;
  audioUrl: string;
}

interface SoundOption {
  id: string;
  name: string;
  icon: React.ElementType;
  audioUrl: string;
}

const soundOptions: SoundOption[] = [
  {
    id: 'ocean',
    name: 'Ocean Waves',
    icon: Waves,
    audioUrl: '/audio/ocean-waves.mp3'
  },
  {
    id: 'forest',
    name: 'Forest',
    icon: Trees,
    audioUrl: '/audio/forest.mp3'
  },
  {
    id: 'wind',
    name: 'Wind',
    icon: Wind,
    audioUrl: '/audio/wind.mp3'
  },
  {
    id: 'rain',
    name: 'Rain',
    icon: Cloud,
    audioUrl: '/audio/rain.mp3'
  }
];

const exercises: Exercise[] = [
  {
    id: 1,
    title: 'Box Breathing',
    description: 'Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat.',
    duration: 120,
    audioUrl: '/audio/box-breathing.mp3'
  },
  {
    id: 2,
    title: 'Body Scan',
    description: 'Focus on each part of your body, releasing tension as you go.',
    duration: 180,
    audioUrl: '/audio/body-scan.mp3'
  },
  {
    id: 3,
    title: 'Mindful Walking',
    description: 'Pay attention to each step and your surroundings.',
    duration: 300,
    audioUrl: '/audio/mindful-walking.mp3'
  }
];

function CalmZone() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [audio] = useState(new Audio());
  const [selectedSound, setSelectedSound] = useState<string>('ocean');
  const [volume, setVolume] = useState<number>(50);
  const [isBreathing, setIsBreathing] = useState<boolean>(false);

  useEffect(() => {
    if (selectedExercise) {
      audio.src = selectedExercise.audioUrl;
      setTimeLeft(selectedExercise.duration);
    }
  }, [selectedExercise]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      audio.pause();
      audio.currentTime = 0;
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  return (
    <div className="p-8 ml-64 min-h-screen" style={{ background: theme.primary }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: theme.text }}>
            Calm Zone
          </h1>
          <p className="mt-2" style={{ color: theme.text }}>
            Take a moment to breathe and relax 🌿
          </p>
        </div>

        {/* Exercise Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Exercise Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Choose an Exercise</h2>
            {exercises.map(exercise => (
              <button
                key={exercise.id}
                onClick={() => setSelectedExercise(exercise)}
                className={`w-full p-4 rounded-lg text-left transition-colors ${
                  selectedExercise?.id === exercise.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <h3 className="font-medium">{exercise.title}</h3>
                <p className="text-sm text-gray-600">{exercise.description}</p>
                <span className="text-sm text-gray-500">
                  Duration: {formatTime(exercise.duration)}
                </span>
              </button>
            ))}
          </div>

          {/* Exercise Player */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {selectedExercise ? (
              <>
                <h2 className="text-xl font-semibold mb-4">{selectedExercise.title}</h2>
                <p className="text-gray-600 mb-6">{selectedExercise.description}</p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl font-mono">{formatTime(timeLeft)}</div>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleMuteToggle}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      {isMuted ? (
                        <VolumeX className="w-6 h-6" />
                      ) : (
                        <Volume2 className="w-6 h-6" />
                      )}
                    </button>
                    <button
                      onClick={handlePlayPause}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${(timeLeft / selectedExercise.duration) * 100}%`
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <p>Select an exercise to begin</p>
              </div>
            )}
          </div>
        </div>

        {/* Ambient Sounds */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-6" style={{ color: theme.text }}>
            Ambient Sounds
          </h2>
          
          {/* Sound Options */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {soundOptions.map((sound: SoundOption) => {
              const Icon = sound.icon;
              return (
                <button
                  key={sound.id}
                  className={`p-4 rounded-xl transition-all duration-200 ${
                    selectedSound === sound.id ? 'shadow-md' : ''
                  }`}
                  style={{
                    background: selectedSound === sound.id ? theme.primary : theme.white,
                    color: theme.text,
                  }}
                  onClick={() => setSelectedSound(sound.id)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon className="w-8 h-8" />
                    <span className="text-sm font-medium">{sound.name}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-4">
            <Volume2 className="w-6 h-6" style={{ color: theme.text }} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${theme.secondary} ${volume}%, #e2e8f0 ${volume}%)`,
              }}
            />
            <span style={{ color: theme.text }}>{volume}%</span>
          </div>
        </div>

        {/* Breathing Guide */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8 text-center">
          <div
            className={`w-32 h-32 mx-auto rounded-full mb-6 transition-all duration-4000 transform ${
              isBreathing ? 'scale-150' : 'scale-100'
            }`}
            style={{
              background: theme.secondary,
              opacity: 0.8,
            }}
          />
          <button
            className="px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200"
            style={{ background: theme.secondary }}
            onClick={() => setIsBreathing(!isBreathing)}
          >
            {isBreathing ? 'Pause Breathing Guide' : 'Start Breathing Guide'}
          </button>
          <p className="mt-4" style={{ color: theme.text }}>
            {isBreathing ? 'Breathe in... and out...' : 'Click to start a guided breathing exercise'}
          </p>
        </div>

        {/* Visual Elements */}
        <div
          className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-30 z-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${theme.secondary} 0%, transparent 70%)`,
          }}
        />
      </div>
    </div>
  );
}

export default CalmZone; 