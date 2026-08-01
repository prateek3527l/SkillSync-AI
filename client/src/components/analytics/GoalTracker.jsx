import { Target, CheckCircle2, Circle } from 'lucide-react';

export default function GoalTracker({ goals }) {
  if (!goals || goals.length === 0) {
    return (
      <div className="card p-6 text-center">
        <Target className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400">No active goals. Set a goal to track your progress.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
          <Target className="w-5 h-5 mr-2 text-indigo-500" /> My Goals
        </h3>
        <button className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          Add Goal
        </button>
      </div>

      <div className="space-y-6">
        {goals.map(goal => {
          const progress = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
          const isComplete = progress >= 100;

          return (
            <div key={goal._id} className="relative">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center space-x-2">
                  {isComplete ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                  )}
                  <div>
                    <p className={`font-semibold ${isComplete ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                      {goal.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {goal.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{progress}%</p>
                  <p className="text-xs text-gray-500">{goal.currentValue} / {goal.targetValue}</p>
                </div>
              </div>
              
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${isComplete ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
