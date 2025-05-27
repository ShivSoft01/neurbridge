import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface Homework {
  id: string;
  title: string;
  description: string;
  due_date: string;
  created_at: string;
}

interface Reminder {
  id: string;
  title: string;
  message: string;
  created_at: string;
}

interface Journal {
  id: string;
  student_id: string;
  content: string;
  created_at: string;
}

interface Classroom {
  id: string;
  name: string;
  image_url: string | null;
}

interface Props {
  classroom: Classroom;
  onClose: () => void;
}

export default function StudentClassroomView({ classroom, onClose }: Props) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'journal' | 'homework' | 'reminders'>('journal');
  const [homework, setHomework] = useState<Homework[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [newJournal, setNewJournal] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (classroom) {
      fetchHomework();
      fetchReminders();
      fetchJournals();
    }
  }, [classroom]);

  const fetchHomework = async () => {
    try {
      const { data, error } = await supabase
        .from('homework')
        .select('*')
        .eq('classroom_id', classroom.id)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setHomework(data || []);
    } catch (error) {
      console.error('Error fetching homework:', error);
      setError('Failed to load homework');
    } finally {
      setLoading(false);
    }
  };

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('classroom_id', classroom.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      setError('Failed to load reminders');
    }
  };

  const fetchJournals = async () => {
    try {
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('student_id', currentUser?.id)
        .eq('classroom_id', classroom.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJournals(data || []);
    } catch (error) {
      console.error('Error fetching journals:', error);
      setError('Failed to load journals');
    }
  };

  const createJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJournal.trim()) return;

    try {
      const { error } = await supabase
        .from('journals')
        .insert([
          {
            content: newJournal,
            student_id: currentUser?.id,
            classroom_id: classroom.id,
          },
        ]);

      if (error) throw error;
      setNewJournal('');
      fetchJournals();
    } catch (error) {
      console.error('Error creating journal:', error);
      setError('Failed to create journal entry');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{classroom.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => setActiveTab('journal')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'journal'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Journal
            </button>
            <button
              onClick={() => setActiveTab('homework')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'homework'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Homework
            </button>
            <button
              onClick={() => setActiveTab('reminders')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'reminders'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reminders
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {activeTab === 'journal' && (
            <div className="space-y-6">
              <form onSubmit={createJournal} className="bg-white rounded-lg shadow p-4 border">
                <h3 className="font-semibold mb-4">Write in Your Journal</h3>
                <div className="space-y-4">
                  <textarea
                    value={newJournal}
                    onChange={(e) => setNewJournal(e.target.value)}
                    placeholder="How are you feeling today? What did you learn?"
                    className="w-full px-4 py-2 rounded-lg border"
                    rows={4}
                    required
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Save Journal Entry
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                {journals.map((journal) => (
                  <div key={journal.id} className="bg-white rounded-lg shadow p-4 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500 text-sm">
                        {new Date(journal.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{journal.content}</p>
                  </div>
                ))}
                {journals.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No journal entries yet. Start writing!
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'homework' && (
            <div className="space-y-4">
              {homework.map((hw) => (
                <div key={hw.id} className="bg-white rounded-lg shadow p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{hw.title}</h3>
                    <span className="text-gray-500 text-sm">
                      Due: {new Date(hw.due_date).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{hw.description}</p>
                </div>
              ))}
              {homework.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No homework assigned yet.
                </p>
              )}
            </div>
          )}

          {activeTab === 'reminders' && (
            <div className="space-y-4">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="bg-white rounded-lg shadow p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{reminder.title}</h3>
                    <span className="text-gray-500 text-sm">
                      {new Date(reminder.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{reminder.message}</p>
                </div>
              ))}
              {reminders.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No reminders yet.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 