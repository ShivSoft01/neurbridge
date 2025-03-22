import React, { useState } from 'react';
import { Brain, MemoryStick as Memory, Puzzle as PuzzlePiece, Wind, Music, Activity, BarChart, BookOpen, MessageSquare, Heart, Trophy } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const navItems = [
    { path: '/dashboard', icon: BarChart, label: 'Dashboard' },
    { path: '/learning', icon: BookOpen, label: 'Learning' },
    { path: '/communication', icon: MessageSquare, label: 'Communication' },
    { path: '/well-being', icon: Heart, label: 'Well-being' },
    { path: '/rewards', icon: Trophy, label: 'Rewards' },
    { path: '/games', icon: PuzzlePiece, label: 'Games' },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-[#0066ff]" />
            <span className="text-xl font-bold">NeuroSense</span>
          </Link>
          <div className="flex space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.path
                      ? 'bg-[#0066ff] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to NeuroSense</h1>
        <p className="text-xl text-gray-600 mb-8">Your personal companion for focus, learning, and well-being</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate('/learning')}
          >
            <Brain className="w-12 h-12 text-[#0066ff] mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Personalized Learning</h2>
            <p className="text-gray-600">Adaptive learning paths tailored to your unique needs and preferences.</p>
          </div>
          <div 
            className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate('/well-being')}
          >
            <Heart className="w-12 h-12 text-[#0066ff] mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Well-being Support</h2>
            <p className="text-gray-600">Tools and exercises to help you maintain balance and calm.</p>
          </div>
          <div 
            className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate('/rewards')}
          >
            <Trophy className="w-12 h-12 text-[#0066ff] mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Track Progress</h2>
            <p className="text-gray-600">Celebrate achievements and monitor your growth journey.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <BarChart className="w-8 h-8 text-[#0066ff]" />
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Daily Progress</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-700">Mood & Energy Check-in</h4>
                <div className="flex gap-4 mt-3">
                  {['😊', '😐', '😔', '😤'].map((emoji) => (
                    <button 
                      key={emoji} 
                      onClick={() => setSelectedMood(emoji)}
                      className={`text-2xl hover:scale-110 transition-transform p-2 rounded-lg ${
                        selectedMood === emoji ? 'bg-blue-100' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-700">Today's Achievements</h4>
                <div className="mt-2 text-gray-600">
                  <p>🎯 Completed 2 learning modules</p>
                  <p>⭐ 5-day streak maintained</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                onClick={() => navigate('/learning')}
              >
                <BookOpen className="w-6 h-6 text-[#0066ff] mb-2" />
                <span className="text-sm font-medium">Start Learning</span>
              </button>
              <button 
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                onClick={() => navigate('/well-being')}
              >
                <Heart className="w-6 h-6 text-[#0066ff] mb-2" />
                <span className="text-sm font-medium">Well-being Check</span>
              </button>
              <button 
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                onClick={() => navigate('/rewards')}
              >
                <Trophy className="w-6 h-6 text-[#0066ff] mb-2" />
                <span className="text-sm font-medium">View Rewards</span>
              </button>
              <button 
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                onClick={() => navigate('/activity')}
              >
                <Activity className="w-6 h-6 text-[#0066ff] mb-2" />
                <span className="text-sm font-medium">Activity Log</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Learning() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const modules = [
    {
      title: "Executive Functions",
      description: "Master focus, time management, and planning",
      progress: 60
    },
    {
      title: "Social Skills",
      description: "Learn conversation strategies and social scripts",
      progress: 40
    },
    {
      title: "Self-Advocacy",
      description: "Develop skills to express your needs effectively",
      progress: 25
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-8 h-8 text-[#0066ff]" />
          <h2 className="text-2xl font-bold text-gray-800">Learning Center</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((module) => (
            <div 
              key={module.title} 
              className={`bg-gray-50 rounded-lg p-6 ${
                selectedModule === module.title ? 'ring-2 ring-[#0066ff]' : ''
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
              <p className="text-gray-600 mb-4">{module.description}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#0066ff] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${module.progress}%` }}
                ></div>
              </div>
              <button 
                className="mt-4 px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors"
                onClick={() => setSelectedModule(module.title)}
              >
                Continue Learning
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Communication() {
  const [inputText, setInputText] = useState('');
  const [selectedStarter, setSelectedStarter] = useState<string | null>(null);

  const starters = [
    "How was your weekend?",
    "What's your favorite hobby?",
    "Have you seen any good movies lately?",
    "What do you like to do for fun?"
  ];

  const phrases = [
    "I need a break",
    "I'm feeling overwhelmed",
    "I don't understand",
    "Can you explain that?"
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-8 h-8 text-[#0066ff]" />
          <h2 className="text-2xl font-bold text-gray-800">Communication Tools</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Conversation Starters</h3>
            <div className="space-y-3">
              {starters.map((starter) => (
                <button 
                  key={starter}
                  onClick={() => setSelectedStarter(starter)}
                  className={`w-full text-left p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow ${
                    selectedStarter === starter ? 'ring-2 ring-[#0066ff]' : ''
                  }`}
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Emotion Translator</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="How are you feeling?"
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-[#0066ff] focus:ring focus:ring-[#0066ff] focus:ring-opacity-50"
              />
              <div className="grid grid-cols-2 gap-3">
                {phrases.map((phrase) => (
                  <button 
                    key={phrase}
                    onClick={() => setInputText(phrase)}
                    className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-sm"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Wellbeing() {
  const [journalEntry, setJournalEntry] = useState('');
  const [showBreathing, setShowBreathing] = useState(false);
  const [showSounds, setShowSounds] = useState(false);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-8 h-8 text-[#0066ff]" />
          <h2 className="text-2xl font-bold text-gray-800">Well-being Center</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Mood Journal</h3>
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="How are you feeling today?"
              className="w-full h-32 p-3 rounded-lg border border-gray-200 focus:border-[#0066ff] focus:ring focus:ring-[#0066ff] focus:ring-opacity-50"
            ></textarea>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Calming Tools</h3>
            <div className="space-y-3">
              <button 
                onClick={() => setShowBreathing(!showBreathing)}
                className="w-full p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-3"
              >
                <Wind className="w-5 h-5 text-[#0066ff]" />
                <span>Breathing Exercise</span>
              </button>
              <button 
                onClick={() => setShowSounds(!showSounds)}
                className="w-full p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-3"
              >
                <Music className="w-5 h-5 text-[#0066ff]" />
                <span>Calming Sounds</span>
              </button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Daily Tips</h3>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg shadow">
                <p className="text-gray-600">Remember to take regular breaks during focused work.</p>
              </div>
              <div className="p-3 bg-white rounded-lg shadow">
                <p className="text-gray-600">Stay hydrated throughout the day.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Rewards() {
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);

  const rewards = [
    { name: "Custom Theme", points: 1000 },
    { name: "New Avatar", points: 2000 },
    { name: "Special Badge", points: 3000 },
    { name: "Premium Features", points: 5000 }
  ];

  const handleClaimReward = (rewardName: string) => {
    if (!claimedRewards.includes(rewardName)) {
      setClaimedRewards([...claimedRewards, rewardName]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-8 h-8 text-[#0066ff]" />
          <h2 className="text-2xl font-bold text-gray-800">Rewards</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Your Progress</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Points</span>
                  <span className="text-[#0066ff] font-bold">2,450</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#0066ff] h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Current Streak</span>
                  <span className="text-[#0066ff] font-bold">5 days</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Available Rewards</h3>
            <div className="grid grid-cols-2 gap-4">
              {rewards.map((reward) => (
                <div key={reward.name} className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-medium mb-2">{reward.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{reward.points} points</p>
                  <button
                    onClick={() => handleClaimReward(reward.name)}
                    className={`w-full px-3 py-1 rounded-lg text-sm ${
                      claimedRewards.includes(reward.name)
                        ? 'bg-gray-200 text-gray-600'
                        : 'bg-[#0066ff] text-white hover:bg-[#0052cc]'
                    }`}
                    disabled={claimedRewards.includes(reward.name)}
                  >
                    {claimedRewards.includes(reward.name) ? 'Claimed' : 'Claim'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Games() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  
  const games = [
    {
      id: 'memory',
      title: 'Memory Match',
      icon: Memory,
      description: 'Test and improve your memory by matching pairs of cards.'
    },
    {
      id: 'focus',
      title: 'Focus Flow',
      icon: Activity,
      description: 'Stay focused and react quickly to visual cues.'
    },
    {
      id: 'puzzle',
      title: 'Pattern Puzzle',
      icon: PuzzlePiece,
      description: 'Complete patterns and improve cognitive flexibility.'
    }
  ];

  const handleStartGame = (gameId: string) => {
    setSelectedGame(gameId);
    setGameStarted(true);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white rounded-lg p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <PuzzlePiece className="w-8 h-8 text-[#0066ff]" />
          <h2 className="text-2xl font-bold text-gray-800">Focus Games</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                className={`bg-gray-50 rounded-lg p-6 cursor-pointer transition-all ${
                  selectedGame === game.id ? 'ring-2 ring-[#0066ff]' : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedGame(game.id)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-6 h-6 text-[#0066ff]" />
                  <h3 className="text-xl font-semibold">{game.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{game.description}</p>
                <button 
                  className="w-full px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors"
                  onClick={() => handleStartGame(game.id)}
                >
                  {gameStarted && selectedGame === game.id ? 'Playing...' : 'Play Now'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Period1() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-4">Period 1</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Content for Period 1</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f8f9fa]">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/well-being" element={<Wellbeing />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/games" element={<Games />} />
          <Route path="/period1" element={<Period1 />} />
          <Route path="/period2" element={<div className="container mx-auto px-4 py-12">Period 2 Content</div>} />
          <Route path="/period3" element={<div className="container mx-auto px-4 py-12">Period 3 Content</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;