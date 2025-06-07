import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description?: string;
  urgency: 1 | 2 | 3 | 4 | 5;
  importance: 1 | 2 | 3 | 4 | 5;
  quadrant: 'do-first' | 'schedule' | 'delegate' | 'eliminate';
  estimatedHours: number;
  deadline?: Date;
  completed: boolean;
  automatable: boolean;
}

interface PrioritySuggestion {
  taskId: string;
  suggestion: string;
  reasoning: string;
  confidence: number;
  potentialTimeSaved: number;
}

export const PriorityMatrix: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [suggestions, setSuggestions] = useState<PrioritySuggestion[]>([]);
  const [selectedQuadrant, setSelectedQuadrant] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const quadrants = {
    'do-first': {
      name: 'Do First',
      description: 'Urgent & Important',
      color: 'red',
      icon: '🔥'
    },
    'schedule': {
      name: 'Schedule',
      description: 'Not Urgent & Important',
      color: 'blue',
      icon: '📅'
    },
    'delegate': {
      name: 'Delegate',
      description: 'Urgent & Not Important',
      color: 'yellow',
      icon: '👥'
    },
    'eliminate': {
      name: 'Eliminate',
      description: 'Not Urgent & Not Important',
      color: 'gray',
      icon: '🗑️'
    }
  };

  useEffect(() => {
    loadPriorityMatrix();
  }, []);

  const loadPriorityMatrix = async () => {
    try {
      const response = await fetch('/api/automation/priority/matrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'current-user', tasks: [] })
      });
      const { matrix } = await response.json();
      setTasks(matrix.tasks);
      setSuggestions(matrix.aiSuggestions);
    } catch (error) {
      console.error('Failed to load priority matrix:', error);
    }
  };

  const addTask = async (taskData: Partial<Task>) => {
    const newTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      completed: false
    } as Task;

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    
    // Re-analyze with new task
    try {
      const response = await fetch('/api/automation/priority/matrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'current-user', tasks: updatedTasks })
      });
      const { matrix } = await response.json();
      setTasks(matrix.tasks);
      setSuggestions(matrix.aiSuggestions);
    } catch (error) {
      console.error('Failed to update matrix:', error);
    }
  };

  const getTasksForQuadrant = (quadrant: string) => {
    return tasks.filter(task => task.quadrant === quadrant && !task.completed);
  };

  const getSuggestionForTask = (taskId: string) => {
    return suggestions.find(s => s.taskId === taskId);
  };

  const getQuadrantColor = (quadrant: string) => {
    const colors = {
      'do-first': 'bg-red-100 border-red-300',
      'schedule': 'bg-blue-100 border-blue-300',
      'delegate': 'bg-yellow-100 border-yellow-300',
      'eliminate': 'bg-gray-100 border-gray-300'
    };
    return colors[quadrant as keyof typeof colors] || 'bg-gray-100 border-gray-300';
  };

  return (
    <div className="priority-matrix">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Priority Matrix
        </h2>
        <p className="text-lg text-gray-600">
          Organize your tasks using the Eisenhower Matrix to focus on what truly matters.
        </p>
      </div>

      {/* Matrix Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {Object.entries(quadrants).map(([key, quadrant]) => {
          const quadrantTasks = getTasksForQuadrant(key);
          const totalHours = quadrantTasks.reduce((sum, task) => sum + task.estimatedHours, 0);
          
          return (
            <div
              key={key}
              className={`${getQuadrantColor(key)} border-2 rounded-lg p-6 min-h-[300px] cursor-pointer hover:shadow-lg transition-shadow`}
              onClick={() => setSelectedQuadrant(key)}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="text-2xl">{quadrant.icon}</span>
                    {quadrant.name}
                  </h3>
                  <p className="text-sm text-gray-600">{quadrant.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{quadrantTasks.length}</p>
                  <p className="text-sm text-gray-600">{totalHours}h total</p>
                </div>
              </div>

              <div className="space-y-2">
                {quadrantTasks.slice(0, 3).map(task => {
                  const suggestion = getSuggestionForTask(task.id);
                  return (
                    <div key={task.id} className="bg-white bg-opacity-70 rounded p-3">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                        <span>{task.estimatedHours}h</span>
                        {task.automatable && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                            Automatable
                          </span>
                        )}
                      </div>
                      {suggestion && (
                        <div className="mt-2 text-xs bg-blue-50 p-2 rounded">
                          💡 {suggestion.suggestion}
                        </div>
                      )}
                    </div>
                  );
                })}
                {quadrantTasks.length > 3 && (
                  <p className="text-sm text-gray-600 text-center">
                    +{quadrantTasks.length - 3} more tasks
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Insights */}
      {suggestions.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            AI Recommendations
          </h3>
          <div className="space-y-3">
            {suggestions.slice(0, 3).map((suggestion, index) => {
              const task = tasks.find(t => t.id === suggestion.taskId);
              return (
                <div key={index} className="bg-white rounded p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {task?.title}: {suggestion.suggestion}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {suggestion.reasoning}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-green-600 font-semibold">
                        Save {suggestion.potentialTimeSaved}h
                      </p>
                      <p className="text-xs text-gray-500">
                        {(suggestion.confidence * 100).toFixed(0)}% confidence
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Task Button */}
      <div className="text-center">
        <button
          onClick={() => setIsAddingTask(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Add New Task
        </button>
      </div>

      {/* Capacity Analysis */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Capacity Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(quadrants).map(([key, quadrant]) => {
            const quadrantTasks = getTasksForQuadrant(key);
            const hours = quadrantTasks.reduce((sum, task) => sum + task.estimatedHours, 0);
            const percentage = tasks.length > 0 ? (quadrantTasks.length / tasks.length * 100) : 0;
            
            return (
              <div key={key} className="text-center">
                <p className="text-3xl font-bold">{hours}h</p>
                <p className="text-sm text-gray-600">{quadrant.name}</p>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      key === 'do-first' ? 'bg-red-500' :
                      key === 'schedule' ? 'bg-blue-500' :
                      key === 'delegate' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};