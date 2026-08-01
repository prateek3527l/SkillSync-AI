import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Animated 404 number */}
        <div className="mb-8 select-none">
          <span className="text-[10rem] font-black leading-none bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent opacity-20 block">
            404
          </span>
        </div>

        <div className="-mt-12 mb-8">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-indigo-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Page not found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            We couldn't find the page you were looking for. It might have been moved, deleted, or the URL may be incorrect.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-5 py-2.5 text-gray-700 dark:text-gray-300 font-semibold border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </button>
          <Link
            to="/dashboard"
            className="flex items-center px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}