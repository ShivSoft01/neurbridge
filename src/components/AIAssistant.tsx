import React, { useState } from 'react';
import { Send, Sparkles, Brain, Clock, HelpCircle, Undo } from 'lucide-react';
import theme from '../theme';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface QuickAction {
  icon: React.ElementType;
  label: string;
  prompt: string;
}

const quickActions: QuickAction[] = [
  {
    icon: Sparkles,
    label: 'Explain This',
    prompt: 'Can you explain this in simpler terms?',
  },
  {
    icon: Brain,
    label: 'Study Tips',
    prompt: 'What are some study tips for this topic?',
  },
  {
    icon: Clock,
    label: 'Break It Down',
    prompt: 'Can you break this task into smaller steps?',
  },
  {
    icon: HelpCircle,
    label: 'I\'m Stuck',
    prompt: 'I\'m having trouble understanding this. Can you help?',
  },
  {
    icon: Undo,
    label: 'Remind Later',
    prompt: 'Please remind me about this later.',
  },
];

function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m your NeuroBridge AI assistant. How can I help you today? 🌟',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text,
          })),
          newMessage: text.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    handleSend(action.prompt);
  };

  return (
    <div className="p-8 ml-64 min-h-screen" style={{ background: theme.primary }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: theme.text }}>
            AI Assistant
          </h1>
          <p className="mt-2" style={{ color: theme.text }}>
            Your personal learning companion 🤖
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="p-3 rounded-xl transition-all duration-200 hover:shadow-md"
                  style={{ background: theme.primary }}
                  onClick={() => handleQuickAction(action)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon className="w-6 h-6" style={{ color: theme.secondary }} />
                    <span className="text-sm font-medium" style={{ color: theme.text }}>
                      {action.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 300px)' }}>
          {/* Messages */}
          <div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 80px)' }}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-4`}
                  style={{
                    background: message.sender === 'user' ? theme.secondary : theme.primary,
                    color: message.sender === 'user' ? theme.white : theme.text,
                  }}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="max-w-[80%] rounded-xl p-4"
                  style={{ background: theme.primary, color: theme.text }}
                >
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend(inputText)}
                placeholder="Type your message..."
                className="flex-1 p-2 rounded-lg border border-gray-200 focus:outline-none"
                style={{
                  borderColor: theme.secondary,
                }}
                disabled={isLoading}
              />
              <button
                onClick={() => !isLoading && handleSend(inputText)}
                className="p-2 rounded-lg transition-colors duration-200"
                style={{ background: theme.secondary }}
                disabled={!inputText.trim() || isLoading}
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant; 