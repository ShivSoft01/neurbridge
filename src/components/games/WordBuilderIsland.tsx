import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, HelpCircle, Volume2, RefreshCw, Lightbulb, Type } from 'lucide-react';
import theme from '../../theme';

interface Letter {
  id: string;
  char: string;
  isSelected: boolean;
  x: number;
  y: number;
}

interface Word {
  word: string;
  definition: string;
  hint: string;
  phonicsRule: string;
  audioUrl?: string;
}

// Word lists by phonics rules
const wordLists: { [key: string]: Word[] } = {
  'CVC Words': [
    { word: 'cat', definition: 'A small furry animal that says meow', hint: 'It purrs and has whiskers', phonicsRule: 'Consonant-Vowel-Consonant' },
    { word: 'dog', definition: 'A friendly pet that barks', hint: 'Man\'s best friend', phonicsRule: 'Consonant-Vowel-Consonant' },
    { word: 'pig', definition: 'A farm animal that says oink', hint: 'Pink and curly-tailed', phonicsRule: 'Consonant-Vowel-Consonant' },
  ],
  'Silent E': [
    { word: 'cake', definition: 'A sweet dessert for birthdays', hint: 'Blow out the candles!', phonicsRule: 'Magic E makes the vowel say its name' },
    { word: 'bike', definition: 'A two-wheeled vehicle you pedal', hint: 'Ride it with a helmet', phonicsRule: 'Magic E makes the vowel say its name' },
    { word: 'home', definition: 'Where you live', hint: 'Where your family stays', phonicsRule: 'Magic E makes the vowel say its name' },
  ],
  'Blends': [
    { word: 'stop', definition: 'To cease moving', hint: 'Red traffic light means...', phonicsRule: 'Two consonants blend together' },
    { word: 'frog', definition: 'A green jumping amphibian', hint: 'Hops and says ribbit', phonicsRule: 'Two consonants blend together' },
    { word: 'swim', definition: 'To move through water', hint: 'What fish do', phonicsRule: 'Two consonants blend together' },
  ],
};

const levels = Object.keys(wordLists);

function WordBuilderIsland() {
  const [currentLevel, setCurrentLevel] = useState(levels[0]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<Letter[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showDefinition, setShowDefinition] = useState(false);
  const [isDyslexicFont, setIsDyslexicFont] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [draggedLetter, setDraggedLetter] = useState<Letter | null>(null);

  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const correctSoundRef = useRef<HTMLAudioElement>(null);
  const wrongSoundRef = useRef<HTMLAudioElement>(null);

  const currentWord = wordLists[currentLevel][currentWordIndex];

  useEffect(() => {
    // Initialize speech synthesis
    speechSynthesisRef.current = new SpeechSynthesisUtterance();
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    resetGame();
  }, [currentLevel, currentWordIndex]);

  const resetGame = () => {
    const word = wordLists[currentLevel][currentWordIndex].word;
    const shuffledWord = word.split('')
      .map(char => ({
        id: Math.random().toString(36).substr(2, 9),
        char: char.toUpperCase(),
        isSelected: false,
        x: Math.random() * 80 + 10, // Random position between 10% and 90%
        y: Math.random() * 40 + 30, // Random position between 30% and 70%
      }))
      .sort(() => Math.random() - 0.5);

    setLetters(shuffledWord);
    setSelectedLetters([]);
    setShowHint(false);
    setShowDefinition(false);
    setMessage('');
  };

  const speakText = (text: string) => {
    if (!audioEnabled || !speechSynthesisRef.current) return;
    
    window.speechSynthesis.cancel();
    speechSynthesisRef.current.text = text;
    window.speechSynthesis.speak(speechSynthesisRef.current);
  };

  const playSound = (soundRef: React.RefObject<HTMLAudioElement>) => {
    if (audioEnabled && soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(e => console.error("Error playing sound:", e));
    }
  };

  const handleLetterDragStart = (letter: Letter) => {
    setDraggedLetter(letter);
  };

  const handleLetterDragEnd = () => {
    setDraggedLetter(null);
  };

  const handleLetterDrop = (e: React.DragEvent, dropZoneIndex: number) => {
    e.preventDefault();
    if (!draggedLetter) return;

    const newSelectedLetters = [...selectedLetters];
    newSelectedLetters[dropZoneIndex] = draggedLetter;
    setSelectedLetters(newSelectedLetters);

    setLetters(letters.filter(l => l.id !== draggedLetter.id));
    setDraggedLetter(null);

    // Check if word is complete
    if (newSelectedLetters.length === currentWord.word.length) {
      const builtWord = newSelectedLetters.map(l => l.char).join('').toLowerCase();
      if (builtWord === currentWord.word) {
        playSound(correctSoundRef);
        setScore(score + 10);
        setMessage('Correct! 🌟');
        speakText('Correct! Great job!');
        
        // Move to next word after delay
        setTimeout(() => {
          if (currentWordIndex < wordLists[currentLevel].length - 1) {
            setCurrentWordIndex(currentWordIndex + 1);
          } else if (levels.indexOf(currentLevel) < levels.length - 1) {
            setCurrentLevel(levels[levels.indexOf(currentLevel) + 1]);
            setCurrentWordIndex(0);
          }
        }, 2000);
      } else {
        playSound(wrongSoundRef);
        setMessage('Try again! 💪');
        speakText('Not quite right. Try again!');
        setTimeout(resetGame, 1500);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="p-8 ml-64 min-h-screen" style={{ background: theme.primary }}>
      <audio ref={correctSoundRef} src="/sounds/correct.mp3" preload="auto"></audio>
      <audio ref={wrongSoundRef} src="/sounds/wrong.mp3" preload="auto"></audio>

      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2" style={{ 
            color: theme.text,
            fontFamily: isDyslexicFont ? 'OpenDyslexic, sans-serif' : 'inherit'
          }}>
            <BookOpen className="w-8 h-8" />
            Word Builder Island
          </h1>
          <p className="mt-2" style={{ color: theme.text }}>Level: {currentLevel}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsDyslexicFont(!isDyslexicFont)}
            className="p-2"
            title={isDyslexicFont ? "Disable Dyslexic Font" : "Enable Dyslexic Font"}
          >
            <Type className={`w-6 h-6 ${isDyslexicFont ? '' : 'opacity-50'}`} style={{ color: theme.secondary }} />
          </button>
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2"
            title={audioEnabled ? "Mute Sounds" : "Unmute Sounds"}
          >
            <Volume2 className={`w-6 h-6 ${audioEnabled ? '' : 'opacity-50'}`} style={{ color: theme.secondary }} />
          </button>
        </div>
      </div>

      {/* Game Area */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        {/* Level Selection */}
        <div className="mb-6 flex gap-4">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => {
                setCurrentLevel(level);
                setCurrentWordIndex(0);
              }}
              className="px-4 py-2 rounded-lg transition-colors duration-200"
              style={{
                background: currentLevel === level ? theme.secondary : theme.primary,
                color: currentLevel === level ? theme.white : theme.text,
              }}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Score and Message */}
        <div className="mb-6 flex justify-between items-center">
          <span className="text-xl font-bold" style={{ color: theme.text }}>
            Score: {score}
          </span>
          {message && (
            <span className="text-xl animate-bounce" style={{ color: theme.secondary }}>
              {message}
            </span>
          )}
        </div>

        {/* Word Building Area */}
        <div className="relative min-h-[400px] border-2 rounded-xl p-4 mb-6" style={{ borderColor: theme.secondary }}>
          {/* Drop Zones */}
          <div className="flex justify-center gap-4 mb-8">
            {Array.from({ length: currentWord.word.length }).map((_, index) => (
              <div
                key={index}
                className="w-16 h-16 border-2 rounded-lg flex items-center justify-center"
                style={{ borderColor: theme.secondary }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleLetterDrop(e, index)}
              >
                {selectedLetters[index] && (
                  <span className="text-2xl font-bold" style={{ 
                    color: theme.text,
                    fontFamily: isDyslexicFont ? 'OpenDyslexic, sans-serif' : 'inherit'
                  }}>
                    {selectedLetters[index].char}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Available Letters */}
          {letters.map((letter) => (
            <div
              key={letter.id}
              className="absolute cursor-move"
              style={{
                left: `${letter.x}%`,
                top: `${letter.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              draggable
              onDragStart={() => handleLetterDragStart(letter)}
              onDragEnd={handleLetterDragEnd}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                style={{ background: theme.secondary, color: theme.white }}
              >
                <span className="text-xl font-bold" style={{ 
                  fontFamily: isDyslexicFont ? 'OpenDyslexic, sans-serif' : 'inherit'
                }}>
                  {letter.char}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Helper Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setShowHint(!showHint);
              if (!showHint) speakText(currentWord.hint);
            }}
            className="px-4 py-2 rounded-lg flex items-center gap-2"
            style={{ background: theme.primary, color: theme.text }}
          >
            <HelpCircle className="w-5 h-5" />
            Hint
          </button>
          <button
            onClick={() => {
              setShowDefinition(!showDefinition);
              if (!showDefinition) speakText(currentWord.definition);
            }}
            className="px-4 py-2 rounded-lg flex items-center gap-2"
            style={{ background: theme.primary, color: theme.text }}
          >
            <Lightbulb className="w-5 h-5" />
            Definition
          </button>
          <button
            onClick={() => speakText(currentWord.word)}
            className="px-4 py-2 rounded-lg flex items-center gap-2"
            style={{ background: theme.primary, color: theme.text }}
          >
            <Volume2 className="w-5 h-5" />
            Hear Word
          </button>
          <button
            onClick={resetGame}
            className="px-4 py-2 rounded-lg flex items-center gap-2"
            style={{ background: theme.primary, color: theme.text }}
          >
            <RefreshCw className="w-5 h-5" />
            Reset
          </button>
        </div>

        {/* Hint and Definition Display */}
        {(showHint || showDefinition) && (
          <div className="mt-6 p-4 rounded-lg" style={{ background: theme.primary }}>
            {showHint && (
              <p className="mb-2" style={{ color: theme.text }}>
                <strong>Hint:</strong> {currentWord.hint}
              </p>
            )}
            {showDefinition && (
              <p style={{ color: theme.text }}>
                <strong>Definition:</strong> {currentWord.definition}
              </p>
            )}
          </div>
        )}

        {/* Phonics Rule */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: theme.text }}>
            <strong>Phonics Rule:</strong> {currentWord.phonicsRule}
          </p>
        </div>
      </div>
    </div>
  );
}

export default WordBuilderIsland; 