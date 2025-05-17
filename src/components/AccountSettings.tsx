import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Moon, Sun, Volume2, VolumeX, Text, ChevronLeft } from 'lucide-react';
import theme from '../theme';

interface AccessibilitySettings {
  darkMode: boolean;
  soundEnabled: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export default function AccountSettings() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [settings, setSettings] = useState<AccessibilitySettings>({
    darkMode: false,
    soundEnabled: true,
    highContrast: false,
    fontSize: 'medium',
  });

  const handleSettingChange = (setting: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
    // In a real app, you would save these settings to localStorage or a database
    localStorage.setItem('accessibilitySettings', JSON.stringify({ ...settings, [setting]: value }));
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
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold">Account Settings</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Accessibility Settings</h2>
        
        <div className="space-y-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {settings.darkMode ? <Moon className="w-5 h-5 mr-3" /> : <Sun className="w-5 h-5 mr-3" />}
              <span className="font-medium">Dark Mode</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.darkMode}
                onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {settings.soundEnabled ? <Volume2 className="w-5 h-5 mr-3" /> : <VolumeX className="w-5 h-5 mr-3" />}
              <span className="font-medium">Sound Effects</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.soundEnabled}
                onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* High Contrast Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Text className="w-5 h-5 mr-3" />
              <span className="font-medium">High Contrast</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.highContrast}
                onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Font Size Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Text className="w-5 h-5 mr-3" />
              <span className="font-medium">Font Size</span>
            </div>
            <select
              value={settings.fontSize}
              onChange={(e) => handleSettingChange('fontSize', e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Account Actions</h2>
        <button
          onClick={handleSignOut}
          className="w-full py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
} 