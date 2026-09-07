import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KPICard({ title, value, icon: Icon, trend, trendValue, colorClass }) {
  const isPositive = trend === 'up';
  const isNeutral = trend === 'flat';

  return (
    <div className="card flex flex-col justify-between p-5 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>

        {trend && (
          <div className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full ${
            isPositive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
            isNeutral ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' :
            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> :
             isNeutral ? <Minus className="w-3 h-3" /> :
             <TrendingDown className="w-3 h-3" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
      </div>
    </div>
  );
}
