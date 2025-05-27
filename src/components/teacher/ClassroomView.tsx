import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface Student {
  id: string;
  email: string;
  full_name?: string;
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

type SupabaseStudentResponse = {
  student: Student;
}[];

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
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  useEffect(() => {
    if (classroom) {
      fetchJournals();
      fetchHomework();
      fetchReminders();
      fetchAvailableStudents();
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

  const fetchAvailableStudents = async () => {
    try {
      console.log('Fetching available students...');
      console.log('Current classroom students:', classroom.students);

      // First get all students
      const { data: allStudents, error: studentsError } = await supabase
        .from('profiles')
        .select('id, email, full_name, current_emotion')
        .eq('role', 'student');

      if (studentsError) {
        console.error('Error fetching all students:', studentsError);
        throw studentsError;
      }

      console.log('All students:', allStudents);

      // Filter out students who are already in the classroom
      const availableStudents = allStudents?.filter(
        student => !classroom.students.some(s => s.id === student.id)
      ) || [];

      console.log('Available students:', availableStudents);
      setAvailableStudents(availableStudents);
    } catch (error) {
      console.error('Error fetching available students:', error);
      setError('Failed to load available students');
    }
  };

  const addStudentToClassroom = async () => {
    if (!selectedStudentId) return;

    try {
      const { error } = await supabase
        .from('classroom_students')
        .insert([
          {
            classroom_id: classroom.id,
            student_id: selectedStudentId,
          },
        ]);

      if (error) throw error;

      // Refresh the classroom data
      const { data: updatedClassroom, error: classroomError } = await supabase
        .from('classrooms')
        .select(`
          id,
          name,
          image_url,
          students:classroom_students(
            student:profiles(
              id,
              email,
              current_emotion
            )
          )
        `)
        .eq('id', classroom.id)
        .single();

      if (classroomError) throw classroomError;

      // Update the classroom state
      const transformedStudents = (updatedClassroom.students as unknown as SupabaseStudentResponse)
        .map(s => s.student)
        .filter((student): student is Student => student !== null);
      
      classroom.students = transformedStudents;

      // Update available students
      setAvailableStudents(prev => prev.filter(s => s.id !== selectedStudentId));
      setSelectedStudentId('');
    } catch (error) {
      console.error('Error adding student to classroom:', error);
      setError('Failed to add student to classroom');
    }
  };

  const removeStudentFromClassroom = async (studentId: string) => {
    try {
      const { error } = await supabase
        .from('classroom_students')
        .delete()
        .match({
          classroom_id: classroom.id,
          student_id: studentId
        });

      if (error) throw error;

      // Refresh the classroom data
      const { data: updatedClassroom, error: classroomError } = await supabase
        .from('classrooms')
        .select(`
          id,
          name,
          image_url,
          students:classroom_students(
            student:profiles(
              id,
              email,
              current_emotion
            )
          )
        `)
        .eq('id', classroom.id)
        .single();

      if (classroomError) throw classroomError;

      // Update the classroom state
      const transformedStudents = (updatedClassroom.students as unknown as SupabaseStudentResponse)
        .map(s => s.student)
        .filter((student): student is Student => student !== null);
      
      classroom.students = transformedStudents;

      // Update available students
      const removedStudent = classroom.students.find(s => s.id === studentId);
      if (removedStudent) {
        setAvailableStudents(prev => [...prev, removedStudent]);
      }
    } catch (error) {
      console.error('Error removing student from classroom:', error);
      setError('Failed to remove student from classroom');
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
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-4 border">
                <h3 className="font-semibold mb-4">Add Student to Classroom</h3>
                <div className="flex gap-4">
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border"
                  >
                    <option value="">Select a student...</option>
                    {availableStudents && availableStudents.length > 0 ? (
                      availableStudents.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.full_name || student.email}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No available students</option>
                    )}
                  </select>
                  <button
                    onClick={addStudentToClassroom}
                    disabled={!selectedStudentId}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Add Student
                  </button>
                </div>
                {availableStudents.length === 0 && (
                  <p className="text-gray-500 text-sm mt-2">
                    No students available to add to this classroom.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classroom.students && classroom.students.length > 0 ? (
                  classroom.students.map((student) => (
                    <div
                      key={student.id}
                      className="bg-white rounded-lg shadow p-4 border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{student.full_name || student.email}</h3>
                        <button
                          onClick={() => removeStudentFromClassroom(student.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm">{student.email}</p>
                      {student.current_emotion && (
                        <span className="inline-block mt-2 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                          {student.current_emotion}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 col-span-full text-center py-4">
                    No students in this classroom yet.
                  </p>
                )}
              </div>
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