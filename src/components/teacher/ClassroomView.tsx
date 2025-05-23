import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface Student {
  id: string;
  email: string;
  name?: string;
  current_emotion: string | null;
}

interface Journal {
  id: string;
  student_id: string;
  content: string;
  created_at: string;
}

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

interface Classroom {
  id: string;
  name: string;
  image_url: string | null;
  students: Student[];
}

interface Props {
  classroom: Classroom;
  onClose: () => void;
}

export default function ClassroomView({ classroom, onClose }: Props) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'students' | 'journals' | 'homework' | 'reminders'>('students');
  const [journals, setJournals] = useState<Journal[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newHomework, setNewHomework] = useState({ title: '', description: '', due_date: '' });
  const [newReminder, setNewReminder] = useState({ title: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (classroom) {
      fetchJournals();
      fetchHomework();
      fetchReminders();
    }
  }, [classroom]);

  const fetchJournals = async () => {
    try {
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .in('student_id', classroom.students.map(s => s.id))
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJournals(data || []);
    } catch (error) {
      console.error('Error fetching journals:', error);
      setError('Failed to load journals');
    }
  };

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

  const createHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('homework')
        .insert([
          {
            ...newHomework,
            classroom_id: classroom.id,
            teacher_id: currentUser?.id,
          },
        ]);

      if (error) throw error;
      setNewHomework({ title: '', description: '', due_date: '' });
      fetchHomework();
    } catch (error) {
      console.error('Error creating homework:', error);
      setError('Failed to create homework');
    }
  };

  const createReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('reminders')
        .insert([
          {
            ...newReminder,
            classroom_id: classroom.id,
            teacher_id: currentUser?.id,
          },
        ]);

      if (error) throw error;
      setNewReminder({ title: '', message: '' });
      fetchReminders();
    } catch (error) {
      console.error('Error creating reminder:', error);
      setError('Failed to create reminder');
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
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'students'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setActiveTab('journals')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'journals'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Journals
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

          {activeTab === 'students' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classroom.students.map((student) => (
                <div
                  key={student.id}
                  className="bg-white rounded-lg shadow p-4 border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{student.name || student.email}</h3>
                    {student.current_emotion && (
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                        {student.current_emotion}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{student.email}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'journals' && (
            <div className="space-y-4">
              {journals.map((journal) => (
                <div key={journal.id} className="bg-white rounded-lg shadow p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">
                      {classroom.students.find(s => s.id === journal.student_id)?.name || 
                       classroom.students.find(s => s.id === journal.student_id)?.email}
                    </h3>
                    <span className="text-gray-500 text-sm">
                      {new Date(journal.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{journal.content}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'homework' && (
            <div className="space-y-6">
              <form onSubmit={createHomework} className="bg-white rounded-lg shadow p-4 border">
                <h3 className="font-semibold mb-4">Assign New Homework</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={newHomework.title}
                    onChange={(e) => setNewHomework({ ...newHomework, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={newHomework.description}
                    onChange={(e) => setNewHomework({ ...newHomework, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    rows={3}
                    required
                  />
                  <input
                    type="datetime-local"
                    value={newHomework.due_date}
                    onChange={(e) => setNewHomework({ ...newHomework, due_date: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Assign Homework
                  </button>
                </div>
              </form>

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
              </div>
            </div>
          )}

          {activeTab === 'reminders' && (
            <div className="space-y-6">
              <form onSubmit={createReminder} className="bg-white rounded-lg shadow p-4 border">
                <h3 className="font-semibold mb-4">Send New Reminder</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    required
                  />
                  <textarea
                    placeholder="Message"
                    value={newReminder.message}
                    onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border"
                    rows={3}
                    required
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Send Reminder
                  </button>
                </div>
              </form>

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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 