import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Loader, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectModal from '../components/projects/ProjectModal';
import ProjectStats from '../components/projects/ProjectStats';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Searching State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSaveProject = async (projectData) => {
    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, projectData);
        toast.success('Project updated successfully');
      } else {
        await api.post('/projects', projectData);
        toast.success('Project created successfully');
      }
      setIsModalOpen(false);
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        toast.success('Project deleted');
        setProjects(projects.filter(p => p._id !== id));
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  // Filtering Logic
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'All' || project.status === filterStatus;
    const matchesCategory = filterCategory === 'All' || project.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'Oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'Alphabetical') return a.title.localeCompare(b.title);
    return 0;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader className="w-8 h-8 animate-spin text-primary-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage and showcase your portfolio.</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </button>
      </div>

      <ProjectStats projects={projects} />

      <div className="card mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search projects by title or tech..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-9 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Planning">Planning</option>
              </select>
            </div>
            
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="All">All Categories</option>
              <option value="Web Development">Web</option>
              <option value="Mobile App">Mobile</option>
              <option value="AI / ML">AI / ML</option>
              <option value="Backend">Backend</option>
              <option value="Full Stack">Full Stack</option>
              <option value="Open Source">Open Source</option>
              <option value="Other">Other</option>
            </select>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="Alphabetical">A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              onEdit={openEditModal}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      ) : (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
            {projects.length === 0 
              ? "You haven't added any projects yet. Get started by creating your first project showcase."
              : "No projects match your current search and filter criteria."}
          </p>
          {projects.length === 0 && (
            <button onClick={openCreateModal} className="btn-primary flex items-center">
              <Plus className="w-4 h-4 mr-2" /> Create Your First Project
            </button>
          )}
        </div>
      )}

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveProject} 
        project={editingProject} 
      />
    </div>
  );
}