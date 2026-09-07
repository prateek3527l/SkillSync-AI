import { Briefcase, CheckCircle, Clock, Star, Edit, Trash2, ExternalLink, Github } from 'lucide-react';

export default function ProjectCard({ project, onEdit, onDelete }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'In Progress': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <Briefcase className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="card group relative flex flex-col h-full">
      {project.featured && (
        <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 p-1.5 rounded-full shadow-md z-10">
          <Star className="w-4 h-4 fill-current" />
        </div>
      )}

      {/* Action Buttons (Hover) */}
      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button
          onClick={() => onEdit(project)}
          className="p-1.5 bg-white text-gray-700 rounded-md shadow-sm hover:text-indigo-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:text-indigo-400"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(project._id)}
          className="p-1.5 bg-white text-gray-700 rounded-md shadow-sm hover:text-red-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:text-red-400"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-t-lg mb-4 flex items-center justify-center overflow-hidden relative group-hover:opacity-90 transition-opacity">
        {project.coverImage ? (
          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <Briefcase className="w-12 h-12 text-gray-400" />
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center space-x-2 mb-2">
          {getStatusIcon(project.status)}
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{project.status}</span>
          <span className="text-gray-300 dark:text-gray-600">&bull;</span>
          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{project.category}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 4).map((tech, i) => (
            <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs rounded-md">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex space-x-3">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            )}
            {project.liveDemoUrl && (
              <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>
          <span className="text-xs text-gray-400">
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
