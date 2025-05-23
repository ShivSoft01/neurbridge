import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import ClassroomView from './ClassroomView';

interface Classroom {
  id: string;
  name: string;
  image_url: string | null;
  students: Student[];
}

interface Student {
  id: string;
  email: string;
  name?: string;
  current_emotion: string | null;
}

type SupabaseClassroomResponse = {
  id: string;
  name: string;
  image_url: string | null;
  students: Array<{
    student: Student;
  }>;
}[];

export default function TeacherDashboard() {
  const { currentUser } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [newClassroom, setNewClassroom] = useState({ name: '', image_url: '' });
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.log('TeacherDashboard mounted, currentUser:', currentUser);
    if (currentUser) {
      fetchClassrooms();
      fetchStudents();
    }
  }, [currentUser]);

  const fetchClassrooms = async () => {
    try {
      console.log('Fetching classrooms for teacher:', currentUser?.id);
      const { data, error } = await supabase
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
        .eq('teacher_id', currentUser?.id);

      if (error) {
        console.error('Error fetching classrooms:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        setError(`Failed to load classrooms: ${error.message}`);
        throw error;
      }

      console.log('Raw classroom data:', data);
      
      // Transform the data to match our interface
      const transformedClassrooms = ((data as unknown as SupabaseClassroomResponse) || []).map(classroom => ({
        id: classroom.id,
        name: classroom.name,
        image_url: classroom.image_url,
        students: classroom.students
          ?.map(s => s.student)
          .filter((student): student is Student => student !== null) || []
      }));
      
      console.log('Transformed classrooms:', transformedClassrooms);
      setClassrooms(transformedClassrooms);
    } catch (error) {
      console.error('Error in fetchClassrooms:', error instanceof Error ? error.message : 'Unknown error');
      setError('Failed to load classrooms. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      console.log('Fetching all students');
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, current_emotion')
        .eq('user_type', 'student');

      if (error) {
        console.error('Error fetching students:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        setError(`Failed to load students: ${error.message}`);
        throw error;
      }

      console.log('Fetched students:', data);
      setStudents(data || []);
    } catch (error) {
      console.error('Error in fetchStudents:', error instanceof Error ? error.message : 'Unknown error');
      setError('Failed to load students. Please try again later.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadingImage(true);
      setError(null);

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `classroom-images/${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('classroom-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('classroom-images')
        .getPublicUrl(filePath);

      if (!data.publicUrl) {
        throw new Error('Failed to get public URL');
      }

      setNewClassroom(prev => ({ ...prev, image_url: data.publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const createClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Creating new classroom:', newClassroom);
      const { data, error } = await supabase
        .from('classrooms')
        .insert([
          {
            name: newClassroom.name,
            image_url: newClassroom.image_url || null,
            teacher_id: currentUser?.id,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating classroom:', error);
        setError('Failed to create classroom');
        throw error;
      }

      console.log('Created classroom:', data);
      setClassrooms([...classrooms, { ...data, students: [] }]);
      setNewClassroom({ name: '', image_url: '' });
    } catch (error) {
      console.error('Error in createClassroom:', error);
      setError('Failed to create classroom');
    }
  };

  const addStudentToClassroom = async (studentId: string) => {
    if (!selectedClassroom) return;

    try {
      console.log('Adding student to classroom:', { studentId, classroomId: selectedClassroom.id });
      const { error } = await supabase
        .from('classroom_students')
        .insert([
          {
            classroom_id: selectedClassroom.id,
            student_id: studentId,
          },
        ]);

      if (error) {
        console.error('Error adding student to classroom:', error);
        setError('Failed to add student to classroom');
        throw error;
      }

      console.log('Successfully added student to classroom');
      await fetchClassrooms();
    } catch (error) {
      console.error('Error in addStudentToClassroom:', error);
      setError('Failed to add student to classroom');
    }
  };

  const removeStudentFromClassroom = async (studentId: string) => {
    if (!selectedClassroom) return;

    try {
      console.log('Removing student from classroom:', { studentId, classroomId: selectedClassroom.id });
      const { error } = await supabase
        .from('classroom_students')
        .delete()
        .match({
          classroom_id: selectedClassroom.id,
          student_id: studentId
        });

      if (error) {
        console.error('Error removing student from classroom:', error);
        setError('Failed to remove student from classroom');
        throw error;
      }

      console.log('Successfully removed student from classroom');
      await fetchClassrooms();
    } catch (error) {
      console.error('Error in removeStudentFromClassroom:', error);
      setError('Failed to remove student from classroom');
    }
  };

  const filteredStudents = students.filter(student => {
    const searchLower = searchQuery.toLowerCase();
    return (
      student.email.toLowerCase().includes(searchLower) ||
      (student.name && student.name.toLowerCase().includes(searchLower))
    );
  });

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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Teacher Dashboard</h1>

      {/* Create Classroom Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Classroom</h2>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={createClassroom} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classroom Name
            </label>
            <input
              type="text"
              value={newClassroom.name}
              onChange={(e) => setNewClassroom({ ...newClassroom, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classroom Image (Optional)
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="classroom-image"
              />
              <label
                htmlFor="classroom-image"
                className="cursor-pointer bg-white px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                {uploadingImage ? 'Uploading...' : 'Select Image'}
              </label>
              {newClassroom.image_url && (
                <div className="relative w-20 h-20">
                  <img
                    src={newClassroom.image_url}
                    alt="Classroom preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setNewClassroom(prev => ({ ...prev, image_url: '' }))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Classroom'}
          </button>
        </form>
      </div>

      {/* Classrooms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classrooms.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 text-lg">
              You haven't created any classrooms yet. Create your first classroom above!
            </p>
          </div>
        ) : (
          classrooms.map((classroom) => (
            <div
              key={classroom.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setSelectedClassroom(classroom)}
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
                  {classroom.students?.length || 0} Students
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Classroom Details Modal */}
      {selectedClassroom && (
        <ClassroomView
          classroom={selectedClassroom}
          onClose={() => setSelectedClassroom(null)}
        />
      )}
    </div>
  );
} 