import { Trophy, Star, Award, Zap, Code, FileText, CheckCircle } from 'lucide-react';

const BADGES = [
  { id: 'first_project', label: 'First Project', description: 'Created your first project', icon: Code, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { id: 'portfolio_builder', label: 'Portfolio Builder', description: 'Added 3 or more projects', icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  { id: 'resume_master', label: 'Resume Master', description: 'Achieved an ATS score of 90+', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { id: 'interview_expert', label: 'Interview Expert', description: 'Scored 85+ in a Mock Interview', icon: Award, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  { id: 'job_hunter', label: 'Job Hunter', description: 'Applied to 10+ jobs', icon: Target, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  { id: 'profile_complete', label: 'Profile Complete', description: 'Filled out all profile details', icon: CheckCircle, color: 'text-teal-500', bg: 'bg-teal-100 dark:bg-teal-900/30' },
];

// Helper to determine unlocked badges based on stats (simplified logic)
const getUnlockedBadges = (stats) => {
  if (!stats) return [];
  const unlocked = [];
  
  if (stats.overview?.totalProjects >= 1) unlocked.push('first_project');
  if (stats.overview?.totalProjects >= 3) unlocked.push('portfolio_builder');
  if (stats.overview?.resumeScore >= 90) unlocked.push('resume_master');
  if (stats.overview?.averageInterviewScore >= 85) unlocked.push('interview_expert');
  if (stats.overview?.applicationsSubmitted >= 10) unlocked.push('job_hunter');
  if (stats.overview?.profileCompletion === 100) unlocked.push('profile_complete');
  
  return unlocked;
};

import { Briefcase, Target } from 'lucide-react'; // Imports missed above

export default function Achievements({ stats }) {
  const unlockedIds = getUnlockedBadges(stats);

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <Trophy className="w-5 h-5 mr-2 text-yellow-500" /> Achievements
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {BADGES.map((badge) => {
          const isUnlocked = unlockedIds.includes(badge.id);
          const Icon = badge.icon;
          
          return (
            <div 
              key={badge.id}
              className={`p-4 rounded-xl border text-center transition-all ${
                isUnlocked 
                  ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm' 
                  : 'border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60 grayscale'
              }`}
            >
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${isUnlocked ? badge.bg : 'bg-gray-200 dark:bg-gray-700'}`}>
                <Icon className={`w-6 h-6 ${isUnlocked ? badge.color : 'text-gray-400'}`} />
              </div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-1">{badge.label}</h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                {isUnlocked ? badge.description : 'Locked'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
