import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import StudentClassroomView from './StudentClassroomView';

interface Classroom {
  id: string;
  name: string;
  image_url: string | null;
  teacher: {
    email: string;
  };
}

type RawClassroomData = {
  classroom: Classroom;
}[];

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
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
          classroom:classrooms(
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
      const transformedClassrooms = (data as unknown as RawClassroomData)
        .map(item => item.classroom)
        .filter((classroom): classroom is Classroom => {
          if (!classroom) return false;
          if (typeof classroom.id !== 'string') return false;
          if (typeof classroom.name !== 'string') return false;
          if (classroom.image_url !== null && typeof classroom.image_url !== 'string') return false;
          if (!classroom.teacher || typeof classroom.teacher.email !== 'string') return false;
          return true;
        });
      
      console.log('Transformed classrooms:', transformedClassrooms);
      setClassrooms(transformedClassrooms);
    } catch (error) {
      console.error('Error in fetchClassrooms:', error instanceof Error ? error.message : 'Unknown error');
      setError('Failed to load classrooms. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Classrooms</h1>

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
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{classroom.name}</h3>
                <p className="text-gray-600 mb-4">
                  Teacher: {classroom.teacher?.email || 'Unknown'}
                </p>
                <button
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={() => setSelectedClassroom(classroom)}
                >
                  Enter Classroom
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedClassroom && (
        <StudentClassroomView
          classroom={selectedClassroom}
          onClose={() => setSelectedClassroom(null)}
        />
      )}
    </div>
  );
} 