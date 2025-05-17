import React, { useState } from 'react';
import { Plus, Check, Trash2, Edit2, Star, Clock } from 'lucide-react';
import theme from '../../theme';

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  estimatedTime: number;
  actualTime?: number;
}

function TaskTrackerQuest() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    estimatedTime: 30,
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      setTasks(tasks.map(task =>
        task.id === editingTask.id
          ? { ...task, ...newTask }
          : task
      ));
      setEditingTask(null);
    } else {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          title: newTask.title || '',
          description: newTask.description || '',
          dueDate: newTask.dueDate || '',
          priority: newTask.priority || 'medium',
          estimatedTime: newTask.estimatedTime || 30,
          completed: false,
        },
      ]);
    }
    setShowAddTask(false);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      estimatedTime: 30,
    });
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      estimatedTime: task.estimatedTime,
    });
    setShowAddTask(true);
  };

  const handleCompleteTask = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="p-8 ml-64 min-h-screen" style={{ background: theme.primary }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: theme.text }}>
            Task Tracker Quest
          </h1>
          <p className="mt-2" style={{ color: theme.text }}>
            Stay organized and track your progress! 📝
          </p>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Total Tasks</p>
            <p className="text-2xl font-bold">{tasks.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold">
              {tasks.filter(task => task.completed).length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-2xl font-bold">
              {tasks.filter(task => !task.completed).length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500">High Priority</p>
            <p className="text-2xl font-bold">
              {tasks.filter(task => task.priority === 'high').length}
            </p>
          </div>
        </div>

        {/* Add Task Button */}
        <button
          onClick={() => setShowAddTask(true)}
          className="w-full p-4 mb-8 bg-white rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <Plus className="w-6 h-6" />
          <span>Add New Task</span>
        </button>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.map(task => (
            <div
              key={task.id}
              className={`bg-white rounded-xl p-6 ${
                task.completed ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`text-lg font-medium ${
                      task.completed ? 'line-through text-gray-500' : ''
                    }`}>
                      {task.title}
                    </h3>
                    <Star className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
                  </div>
                  <p className="text-gray-600 mb-4">{task.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{task.estimatedTime} min</span>
                    </div>
                    <span>Due: {task.dueDate}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className={`p-2 rounded-lg ${
                      task.completed
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEditTask(task)}
                    className="p-2 rounded-lg bg-blue-100 text-blue-600"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 rounded-lg bg-red-100 text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Task Modal */}
        {showAddTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h2>
              <form onSubmit={handleAddTask}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={e => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                      className="w-full p-2 border border-gray-200 rounded-lg"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={newTask.estimatedTime}
                      onChange={e => setNewTask({ ...newTask, estimatedTime: Number(e.target.value) })}
                      className="w-full p-2 border border-gray-200 rounded-lg"
                      min="1"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTask(false);
                      setEditingTask(null);
                      setNewTask({
                        title: '',
                        description: '',
                        dueDate: '',
                        priority: 'medium',
                        estimatedTime: 30,
                      });
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200"
                    style={{ background: theme.secondary }}
                  >
                    {editingTask ? 'Save Changes' : 'Add Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskTrackerQuest; 