import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, Loader, LayoutGrid, List, Trello, CalendarDays, BriefcaseBusiness } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import JobCard from '../components/jobs/JobCard';
import JobTable from '../components/jobs/JobTable';
import JobModal from '../components/jobs/JobModal';
import JobStats from '../components/jobs/JobStats';
import KanbanBoard from '../components/jobs/KanbanBoard';
import JobCalendar from '../components/jobs/JobCalendar';

const VIEW_MODES = [
  { key: 'grid',    icon: LayoutGrid,      label: 'Grid' },
  { key: 'table',   icon: List,            label: 'Table' },
  { key: 'kanban',  icon: Trello,          label: 'Kanban' },
  { key: 'calendar',icon: CalendarDays,    label: 'Calendar' },
];

const STATUS_OPTIONS = ['All','Saved','Applied','Assessment','Interview','HR Round','Final Round','Offer','Rejected','Accepted'];
const JOB_TYPE_OPTIONS = ['All','Internship','Full Time','Part Time','Freelance'];
const PRIORITY_OPTIONS = ['All','High','Medium','Low'];
const WORK_MODE_OPTIONS = ['All','Remote','Hybrid','On-site'];

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterJobType, setFilterJobType] = useState('All');
  const [filterWorkMode, setFilterWorkMode] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleSave = async (data) => {
    try {
      if (editingJob) {
        const res = await api.put(`/jobs/${editingJob._id}`, data);
        setJobs(prev => prev.map(j => j._id === editingJob._id ? res.data : j));
        toast.success('Application updated');
      } else {
        const res = await api.post('/jobs', data);
        setJobs(prev => [res.data, ...prev]);
        toast.success('Application added');
      }
      setIsModalOpen(false);
      setEditingJob(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(prev => prev.filter(j => j._id !== id));
      toast.success('Application deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.put(`/jobs/${id}`, { applicationStatus: newStatus });
      setJobs(prev => prev.map(j => j._id === id ? res.data : j));
      toast.success(`Moved to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const openCreate = () => { setEditingJob(null); setIsModalOpen(true); };
  const openEdit = (job) => { setEditingJob(job); setIsModalOpen(true); };

  const filtered = useMemo(() => {
    return jobs
      .filter(j => {
        const q = search.toLowerCase();
        const matchSearch = !q || j.companyName.toLowerCase().includes(q) ||
          j.jobTitle.toLowerCase().includes(q) ||
          (j.recruiterName && j.recruiterName.toLowerCase().includes(q));
        return matchSearch &&
          (filterStatus === 'All' || j.applicationStatus === filterStatus) &&
          (filterPriority === 'All' || j.priority === filterPriority) &&
          (filterJobType === 'All' || j.jobType === filterJobType) &&
          (filterWorkMode === 'All' || j.workMode === filterWorkMode);
      })
      .sort((a, b) => {
        if (sortBy === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'Oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === 'Company') return a.companyName.localeCompare(b.companyName);
        if (sortBy === 'Deadline') {
          if (!a.applicationDeadline) return 1;
          if (!b.applicationDeadline) return -1;
          return new Date(a.applicationDeadline) - new Date(b.applicationDeadline);
        }
        if (sortBy === 'Priority') {
          const p = { High: 0, Medium: 1, Low: 2 };
          return p[a.priority] - p[b.priority];
        }
        if (sortBy === 'Updated') return new Date(b.updatedAt) - new Date(a.updatedAt);
        return 0;
      });
  }, [jobs, search, filterStatus, filterPriority, filterJobType, filterWorkMode, sortBy]);

  const selectClass = "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 appearance-none";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage all your applications in one place.</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Add Application
        </button>
      </div>

      {/* Stats */}
      <JobStats jobs={jobs} />

      {/* View Switcher + Filters */}
      <div className="card p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search company, role, recruiter..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* View Mode Switcher */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {VIEW_MODES.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setViewMode(key)}
                title={label}
                className={`px-3 py-2 flex items-center justify-center transition-colors ${
                  viewMode === key
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-1">
            <Filter className="w-4 h-4 text-gray-400" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={selectClass}>
            {STATUS_OPTIONS.map(s => <option key={s}>{s === 'All' ? 'All Status' : s}</option>)}
          </select>
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className={selectClass}>
            {PRIORITY_OPTIONS.map(p => <option key={p}>{p === 'All' ? 'All Priority' : p}</option>)}
          </select>
          <select value={filterJobType} onChange={e => setFilterJobType(e.target.value)} className={selectClass}>
            {JOB_TYPE_OPTIONS.map(t => <option key={t}>{t === 'All' ? 'All Types' : t}</option>)}
          </select>
          <select value={filterWorkMode} onChange={e => setFilterWorkMode(e.target.value)} className={selectClass}>
            {WORK_MODE_OPTIONS.map(m => <option key={m}>{m === 'All' ? 'All Modes' : m}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={selectClass}>
            <option value="Newest">Newest First</option>
            <option value="Oldest">Oldest First</option>
            <option value="Company">Company A-Z</option>
            <option value="Deadline">By Deadline</option>
            <option value="Priority">By Priority</option>
            <option value="Updated">Recently Updated</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      {viewMode !== 'kanban' && viewMode !== 'calendar' && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-700 dark:text-gray-200">{filtered.length}</span> of {jobs.length} applications
        </p>
      )}

      {/* Views */}
      {viewMode === 'kanban' ? (
        <KanbanBoard jobs={filtered} onEdit={openEdit} onStatusChange={handleStatusChange} />
      ) : viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <JobCalendar jobs={jobs} />
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Upcoming Events</h3>
            {jobs
              .filter(j => (j.interviewDate || j.applicationDeadline))
              .sort((a, b) => {
                const dA = new Date(a.interviewDate || a.applicationDeadline);
                const dB = new Date(b.interviewDate || b.applicationDeadline);
                return dA - dB;
              })
              .slice(0, 8)
              .map(j => (
                <div key={j._id} className="card py-3 px-4 flex items-start space-x-3">
                  <div className="w-8 h-8 flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center text-xs font-bold">
                    {j.companyName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{j.companyName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{j.jobTitle}</p>
                    {j.interviewDate && (
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">📅 Interview: {new Date(j.interviewDate).toLocaleDateString()}</p>
                    )}
                    {j.applicationDeadline && (
                      <p className="text-xs text-red-500 mt-0.5">⏰ Deadline: {new Date(j.applicationDeadline).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <BriefcaseBusiness className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {jobs.length === 0 ? 'No applications yet' : 'No results found'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
            {jobs.length === 0
              ? "Start tracking your job search journey. Add your first application now!"
              : "Try adjusting your search or filters."}
          </p>
          {jobs.length === 0 && (
            <button onClick={openCreate} className="btn-primary flex items-center">
              <Plus className="w-4 h-4 mr-2" /> Add Your First Application
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(job => (
            <JobCard key={job._id} job={job} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <JobTable jobs={filtered} onEdit={openEdit} onDelete={handleDelete} />
      )}

      {/* Modal */}
      <JobModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingJob(null); }}
        onSave={handleSave}
        job={editingJob}
      />
    </div>
  );
}
