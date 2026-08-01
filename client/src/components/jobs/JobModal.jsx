import { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';

const STATUS_OPTIONS = ['Saved','Applied','Assessment','Interview','HR Round','Final Round','Offer','Rejected','Accepted'];
const JOB_TYPES = ['Internship','Full Time','Part Time','Freelance'];
const WORK_MODES = ['Remote','Hybrid','On-site'];
const PRIORITIES = ['High','Medium','Low'];

const defaultForm = {
  companyName: '', jobTitle: '', jobType: 'Full Time', workMode: 'On-site',
  location: '', salaryRange: '', applicationDate: new Date().toISOString().split('T')[0],
  applicationDeadline: '', currentStage: '', applicationStatus: 'Saved', priority: 'Medium',
  source: '', jobUrl: '', recruiterName: '', recruiterEmail: '', notes: '', interviewDate: ''
};

export default function JobModal({ isOpen, onClose, onSave, job = null }) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) {
      setForm({
        ...defaultForm,
        ...job,
        applicationDate: job.applicationDate ? new Date(job.applicationDate).toISOString().split('T')[0] : '',
        applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
        interviewDate: job.interviewDate ? new Date(job.interviewDate).toISOString().split('T')[0] : '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [job, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent";
  const labelClass = "block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen px-4 pt-8 pb-20">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-10">
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {job ? 'Edit Application' : 'Add New Application'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Track your job application journey</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Company & Role */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
                <span className="w-5 h-5 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full text-xs flex items-center justify-center mr-2 font-bold">1</span>
                Company & Role
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Company Name *</label>
                  <input required type="text" name="companyName" value={form.companyName} onChange={handleChange} placeholder="e.g. Google" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Job Title *</label>
                  <input required type="text" name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="e.g. Software Engineer Intern" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Job Type</label>
                  <select name="jobType" value={form.jobType} onChange={handleChange} className={inputClass}>
                    {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Work Mode</label>
                  <select name="workMode" value={form.workMode} onChange={handleChange} className={inputClass}>
                    {WORK_MODES.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="e.g. San Francisco, CA" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Salary / Stipend</label>
                  <input type="text" name="salaryRange" value={form.salaryRange} onChange={handleChange} placeholder="e.g. $5,000/month" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Status & Priority */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
                <span className="w-5 h-5 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full text-xs flex items-center justify-center mr-2 font-bold">2</span>
                Status & Tracking
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Status</label>
                  <select name="applicationStatus" value={form.applicationStatus} onChange={handleChange} className={inputClass}>
                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Priority</label>
                  <select name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
                    {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Source</label>
                  <input type="text" name="source" value={form.source} onChange={handleChange} placeholder="LinkedIn, Referral..." className={inputClass} />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
                <span className="w-5 h-5 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full text-xs flex items-center justify-center mr-2 font-bold">3</span>
                Important Dates
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Application Date</label>
                  <input type="date" name="applicationDate" value={form.applicationDate} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Deadline</label>
                  <input type="date" name="applicationDeadline" value={form.applicationDeadline} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Interview Date</label>
                  <input type="date" name="interviewDate" value={form.interviewDate} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Contact & Links */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
                <span className="w-5 h-5 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full text-xs flex items-center justify-center mr-2 font-bold">4</span>
                Contact & Links
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Job URL</label>
                  <input type="url" name="jobUrl" value={form.jobUrl} onChange={handleChange} placeholder="https://..." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Recruiter Name</label>
                  <input type="text" name="recruiterName" value={form.recruiterName} onChange={handleChange} placeholder="Recruiter name" className={inputClass} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Recruiter Email</label>
                  <input type="email" name="recruiterEmail" value={form.recruiterEmail} onChange={handleChange} placeholder="recruiter@company.com" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className={labelClass}>Notes</label>
              <textarea rows="3" name="notes" value={form.notes} onChange={handleChange} placeholder="Any additional notes about this application..." className={inputClass}></textarea>
            </div>

            <div className="flex justify-end space-x-3 pt-2 border-t border-gray-100 dark:border-gray-700">
              <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary flex items-center">
                {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                {job ? 'Save Changes' : 'Add Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
