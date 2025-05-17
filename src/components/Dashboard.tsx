import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Smile, 
  Meh, 
  Frown, 
  Plus, 
  CheckCircle, 
  Clock,
  Calendar,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme';

interface Task {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
}

const Dashboard = () => {
  const [mood, setMood] = useState<'happy' | 'neutral' | 'sad' | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Complete Math Homework', dueDate: '2024-03-20', completed: false },
    { id: 2, title: 'Read Chapter 5', dueDate: '2024-03-21', completed: true },
    { id: 3, title: 'Practice Spelling Words', dueDate: '2024-03-22', completed: false },
  ]);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleMoodSelect = (selectedMood: 'happy' | 'neutral' | 'sad') => {
    setMood(selectedMood);
  };

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto" style={{ background: theme.primary }}>
      {/* Header with Account Menu */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: theme.text }}>Welcome to NeuroBridge</h1>
        
        <div className="relative">
          <button 
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <User className="w-6 h-6" style={{ color: theme.secondary }} />
          </button>
          
          {showAccountMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
              <Link 
                to="/account-settings" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowAccountMenu(false)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </Link>
              <button 
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mood Tracker */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text }}>How are you feeling today?</h2>
        <div className="flex justify-center space-x-8">
          <button 
            onClick={() => handleMoodSelect('happy')}
            className={`p-4 rounded-full transition-transform ${mood === 'happy' ? 'scale-110' : 'hover:scale-105'}`}
            style={{ backgroundColor: mood === 'happy' ? '#F0FDF4' : '#F9FAFB' }}
          >
            <Smile className="w-8 h-8" style={{ color: mood === 'happy' ? '#22C55E' : '#6B7280' }} />
          </button>
          <button 
            onClick={() => handleMoodSelect('neutral')}
            className={`p-4 rounded-full transition-transform ${mood === 'neutral' ? 'scale-110' : 'hover:scale-105'}`}
            style={{ backgroundColor: mood === 'neutral' ? '#FEFCE8' : '#F9FAFB' }}
          >
            <Meh className="w-8 h-8" style={{ color: mood === 'neutral' ? '#EAB308' : '#6B7280' }} />
          </button>
          <button 
            onClick={() => handleMoodSelect('sad')}
            className={`p-4 rounded-full transition-transform ${mood === 'sad' ? 'scale-110' : 'hover:scale-105'}`}
            style={{ backgroundColor: mood === 'sad' ? '#FEF2F2' : '#F9FAFB' }}
          >
            <Frown className="w-8 h-8" style={{ color: mood === 'sad' ? '#EF4444' : '#6B7280' }} />
          </button>
        </div>
      </div>
      
      {/* Tasks */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold" style={{ color: theme.text }}>Your Tasks</h2>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Plus className="w-5 h-5" style={{ color: theme.secondary }} />
          </button>
        </div>
        
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <button 
                  onClick={() => toggleTaskCompletion(task.id)}
                  className="mr-3"
                >
                  {task.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                  )}
                </button>
                <div>
                  <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`} style={{ color: task.completed ? '#9CA3AF' : theme.text }}>
                    {task.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Due: {task.dueDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {task.completed ? (
                  <span className="text-sm text-green-500">Completed</span>
                ) : (
                  <div className="flex items-center text-sm text-amber-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>In Progress</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 