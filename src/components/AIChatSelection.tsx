import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, MessageSquare } from 'lucide-react';
import theme from '../theme';

function AIChatSelection() {
  const navigate = useNavigate();

  return (
    <div className="p-8 ml-64 min-h-screen" style={{ background: theme.primary }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8" style={{ color: theme.text }}>
          AI Learning Support
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Talk with Teacher Button */}
          <button
            onClick={() => navigate('/ai-chat/teacher')}
            className="p-8 rounded-xl transition-all duration-200 hover:shadow-lg flex flex-col items-center gap-4"
            style={{ background: theme.white }}
          >
            <GraduationCap className="w-16 h-16" style={{ color: theme.secondary }} />
            <div>
              <h2 className="text-xl font-bold" style={{ color: theme.text }}>
                Talk with Teacher
              </h2>
              <p className="mt-2" style={{ color: theme.text }}>
                Get personalized help from our virtual teacher
              </p>
            </div>
          </button>

          {/* Chat Support Button */}
          <button
            onClick={() => navigate('/ai-chat/support')}
            className="p-8 rounded-xl transition-all duration-200 hover:shadow-lg flex flex-col items-center gap-4"
            style={{ background: theme.white }}
          >
            <MessageSquare className="w-16 h-16" style={{ color: theme.secondary }} />
            <div>
              <h2 className="text-xl font-bold" style={{ color: theme.text }}>
                Chat Support
              </h2>
              <p className="mt-2" style={{ color: theme.text }}>
                Get help with tasks, organization, and more
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIChatSelection; 