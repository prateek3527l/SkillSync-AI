import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';

export default function AIInsights({ stats }) {
  // Generate dynamic insights based on stats (simplified logic for now)
  const generateInsights = () => {
    const insights = [];

    if (stats?.overview) {
      if (stats.overview.averageInterviewScore < 70) {
        insights.push({
          type: 'warning',
          text: "Your average interview score is below 70. Consider practicing more behavioral questions to boost confidence.",
          action: "Start Mock Interview",
          link: "/interview"
        });
      } else {
        insights.push({
          type: 'success',
          text: "Great job on your recent mock interviews! You perform exceptionally well in Technical rounds.",
          action: "View Feedback",
          link: "/interview?tab=history"
        });
      }

      if (stats.overview.resumeScore < 80) {
        insights.push({
          type: 'suggestion',
          text: "Your resume score is 75/100. Adding more measurable achievements (e.g. 'improved performance by 20%') could boost your ATS score.",
          action: "Analyze Resume",
          link: "/resume"
        });
      }

      if (stats.overview.totalProjects < 3) {
        insights.push({
          type: 'suggestion',
          text: "You have fewer than 3 projects. Adding another full-stack project to your portfolio will significantly increase your callback rate.",
          action: "Add Project",
          link: "/projects"
        });
      }
    }

    // Default insight if none trigger
    if (insights.length === 0) {
      insights.push({
        type: 'info',
        text: "Keep up the good work! Consistent practice is the key to landing your dream job.",
        action: "View Jobs",
        link: "/jobs"
      });
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 border-indigo-100 dark:border-indigo-900/30">
      <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-4 flex items-center">
        <Sparkles className="w-5 h-5 mr-2 text-indigo-500" /> AI Career Insights
      </h3>

      <div className="space-y-4">
        {insights.map((insight, idx) => (
          <div key={idx} className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                <Lightbulb className={`w-5 h-5 ${
                  insight.type === 'warning' ? 'text-amber-500' :
                  insight.type === 'success' ? 'text-emerald-500' : 'text-indigo-500'
                }`} />
              </div>
              <div>
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed mb-2">
                  {insight.text}
                </p>
                {insight.action && (
                  <a href={insight.link} className="inline-flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">
                    {insight.action} <ArrowRight className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
