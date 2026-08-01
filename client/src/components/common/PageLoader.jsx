/**
 * PageLoader – Full-page loading skeleton shown while lazy-loaded routes
 * are being fetched. Prevents flash of empty content.
 */
export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated logo pulse */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 animate-pulse" />
        {/* Loading bar */}
        <div className="w-48 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" 
               style={{ animation: 'loading 1.5s ease-in-out infinite' }} />
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Loading...</p>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
