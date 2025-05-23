import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface Classroom {
  id: string;
  name: string;
  image_url: string | null;
  teacher: {
    email: string;
  };
}

type ClassroomResponse = {
  classroom: {
    id: string;
    name: string;
    image_url: string | null;
    teacher: {
      email: string;
    };
  };
}[];

const emotions = [
  'Happy',
  'Excited',
  'Calm',
  'Focused',
  'Confused',
  'Frustrated',
  'Anxious',
  'Tired',
];

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      fetchClassrooms();
    }
  }, [currentUser]);

  const fetchClassrooms = async () => {
    try {
      console.log('Fetching classrooms for student:', currentUser?.id);
      const { data, error } = await supabase
        .from('classroom_students')
        .select(`
          classroom:classrooms!inner(
            id,
            name,
            image_url,
            teacher:profiles!classrooms_teacher_id_fkey(
              email
            )
          )
        `)
        .eq('student_id', currentUser?.id);

      if (error) {
        console.error('Error fetching classrooms:', error);
        setError(`Failed to load classrooms: ${error.message}`);
        return;
      }

      if (!data) {
        setClassrooms([]);
        return;
      }

      console.log('Raw classroom data:', data);
      
      // Transform the data to match our interface
      const transformedClassrooms = ((data || []) as unknown as ClassroomResponse)
        .map(item => item.classroom)
        .filter((classroom): classroom is Classroom => classroom !== null);
      
      console.log('Transformed classrooms:', transformedClassrooms);
      setClassrooms(transformedClassrooms);
    } catch (error) {
      console.error('Error in fetchClassrooms:', error instanceof Error ? error.message : 'Unknown error');
      setError('Failed to load classrooms. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const updateEmotion = async (emotion: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ current_emotion: emotion })
        .eq('id', currentUser?.id);

      if (error) throw error;
      setSelectedEmotion(emotion);
    } catch (error) {
      console.error('Error updating emotion:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Classrooms</h1>

      {/* Emotion Tracker */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {emotions.map((emotion) => (
            <button
              key={emotion}
              onClick={() => updateEmotion(emotion)}
              className={`p-4 rounded-lg text-center transition-all duration-200 ${
                selectedEmotion === emotion
                  ? 'bg-indigo-600 text-white transform scale-105'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {emotion}
            </button>
          ))}
        </div>
      </div>

      {/* Classrooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classrooms.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 text-lg">
              You haven't been added to any classrooms yet.
            </p>
          </div>
        ) : (
          classrooms.map((classroom) => (
            <div
              key={classroom.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {classroom.image_url ? (
                <img
                  src={classroom.image_url}
                  alt={classroom.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <span className="text-4xl">🏫</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{classroom.name}</h3>
                <p className="text-gray-600">
                  Teacher: {classroom.teacher.email}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 