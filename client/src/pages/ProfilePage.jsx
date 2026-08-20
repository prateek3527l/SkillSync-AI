import { useState, useContext, useEffect } from 'react';
import { 
  Camera, 
  Save, 
  Github, 
  Linkedin, 
  Globe, 
  Loader, 
  MapPin, 
  Briefcase, 
  BookOpen, 
  Award,
  Sparkles,
  Link as LinkIcon,
  CheckCircle,
  FileText,
  User as UserIcon,
  Edit3,
  X,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, loadUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit form states matching backend settingsController
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [headline, setHeadline] = useState('Software Developer');
  const [location, setLocation] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [careerGoals, setCareerGoals] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    github: '',
    linkedin: '',
    website: ''
  });

  // Display states
  const [skills, setSkills] = useState({
    frontend: [],
    backend: [],
    database: [],
    tools: []
  });
  const [projects, setProjects] = useState([]);
  const [editTab, setEditTab] = useState('personal');

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // Parallel fetch settings & projects
      const [settingsRes, projectsRes] = await Promise.all([
        api.get('/api/settings'),
        api.get('/projects')
      ]);

      if (settingsRes.data?.profile) {
        const p = settingsRes.data.profile;
        setName(p.name || '');
        setBio(p.bio || '');
        setHeadline(p.headline || 'Software Developer');
        setLocation(p.location || '');
        setEducation(p.about?.education || '');
        setExperience(p.about?.experience || '');
        setCareerGoals(p.about?.careerGoals || '');
        setSkills(p.skills || { frontend: [], backend: [], database: [], tools: [] });
      }

      if (projectsRes.data) {
        setProjects(projectsRes.data);
      }
    } catch (err) {
      console.error('Error loading profile data:', err);
      toast.error('Failed to load full profile details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Construct payload matching settingsController.js
      const payload = {
        name,
        bio,
        headline,
        location,
        about: {
          education,
          experience,
          careerGoals
        }
      };

      await api.put('/api/settings/profile', payload);
      await loadUser(); // Reload context user
      toast.success('Profile saved successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile settings:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  // Calculate dynamic profile strength percentage
  const calculateProfileStrength = () => {
    let score = 0;
    if (name) score += 20;
    if (bio) score += 20;
    if (headline) score += 15;
    if (location) score += 15;
    if (education) score += 15;
    if (experience) score += 15;
    return Math.min(score, 100);
  };

  const strength = calculateProfileStrength();
  const totalSkillsCount = skills.frontend.length + skills.backend.length + skills.database.length + skills.tools.length;

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-xs text-slate-400">Loading career profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      {/* PROFILE HEADER BANNERS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Abstract design top header */}
        <div className="h-32 bg-gradient-to-r from-indigo-900 via-indigo-950 to-indigo-900 relative">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
        </div>
        
        {/* Editorial composition avatar & tags info */}
        <div className="px-6 pb-6 relative flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 text-center md:text-left">
            <div className="w-24 h-24 rounded-2xl bg-slate-200 dark:bg-slate-850 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-900 shadow-md">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center font-bold text-2xl text-indigo-600 dark:text-indigo-400">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{name}</h1>
                <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                  VERIFIED CV
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">{headline}</p>
              {location && (
                <div className="flex items-center justify-center md:justify-start text-[10px] text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  <span>{location}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center">
            {isEditing ? (
              <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl text-xs font-bold transition-all"
              >
                <X className="w-3.5 h-3.5 mr-1.5" /> Cancel
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-indigo-600/10"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TWO-COLUMN EDIT VS CV PREVIEW DISPLAY */}
      {isEditing ? (
        /* EDIT PROFILE LAYOUT FORM */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden p-6 sm:p-8 animate-fadeIn">
          
          <div className="flex border-b border-slate-100 dark:border-slate-800 mb-6 text-xs font-bold gap-6">
            <button 
              onClick={() => setEditTab('personal')}
              className={`pb-3 border-b-2 transition-all ${editTab === 'personal' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-400'}`}
            >
              Personal Details
            </button>
            <button 
              onClick={() => setEditTab('statement')}
              className={`pb-3 border-b-2 transition-all ${editTab === 'statement' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-400'}`}
            >
              Professional Bio
            </button>
            <button 
              onClick={() => setEditTab('milestones')}
              className={`pb-3 border-b-2 transition-all ${editTab === 'milestones' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-400'}`}
            >
              Education & Experience
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            {editTab === 'personal' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="Pradeep Pathania"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Headline</label>
                  <input 
                    type="text" 
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="Full Stack Developer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Location</label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>
            )}

            {editTab === 'statement' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Short Biography Summary</label>
                  <textarea 
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="Enter a brief, professional bio description..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Career Goals</label>
                  <textarea 
                    rows="3"
                    value={careerGoals}
                    onChange={(e) => setCareerGoals(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="E.g. Lead backend architecture development on React/Node microservice infrastructures..."
                  />
                </div>
              </div>
            )}

            {editTab === 'milestones' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Education Details</label>
                  <textarea 
                    rows="4"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="E.g. BS in Computer Science - Stanford University (GPA: 3.8/4.0)"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Work Experience Details</label>
                  <textarea 
                    rows="4"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="E.g. Senior Software Engineer at TechCorp (2023 - Present)"
                  />
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button 
                type="submit"
                disabled={saving}
                className="flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                {saving ? (
                  <>
                    <Loader className="w-3.5 h-3.5 mr-2 animate-spin" />
                    <span>Saving changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 mr-2" />
                    <span>Save Profile</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      ) : (
        /* CV EDITORIAL READ PREVIEW STATE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT PANEL: Strengths, Info, Skills */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* PROFILE STRENGTH METER */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                <span>Profile strength</span>
                <span className="text-indigo-600 dark:text-indigo-400">{strength}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${strength}%` }} />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Complete education, experience, location, and biography values to reach 100%.
              </p>
            </div>

            {/* SOCIAL / INTERNET CHANNELS */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Internet Channels</h3>
              <div className="space-y-2">
                <a href={user?.githubUrl || "https://github.com"} target="_blank" rel="noreferrer" className="flex items-center text-xs text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                  <Github className="w-4 h-4 mr-2.5 text-slate-400" />
                  <span>GitHub Profile</span>
                </a>
                <a href={user?.linkedinUrl || "https://linkedin.com"} target="_blank" rel="noreferrer" className="flex items-center text-xs text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
                  <Linkedin className="w-4 h-4 mr-2.5 text-slate-400" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </div>

            {/* SKILLS MATRICES */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Skills Matrix</h3>
                <span className="text-[9px] text-slate-400 font-bold">{totalSkillsCount} Skills</span>
              </div>

              {totalSkillsCount > 0 ? (
                <div className="space-y-4">
                  {skills.frontend.length > 0 && (
                    <div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Frontend Stack</div>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.frontend.map((s, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-200/50 dark:border-slate-850">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {skills.backend.length > 0 && (
                    <div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Backend Logic</div>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.backend.map((s, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-200/50 dark:border-slate-850">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-slate-500">Configure your professional tech skills in your settings.</p>
                  <Link to="/settings" className="inline-flex items-center text-xs font-bold text-indigo-600 mt-2 hover:underline">
                    Manage Skills <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT PANEL: Editorial Bio, Projects, Timeline Milestones */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* BIO PANEL */}
            {bio && (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">About Me</h3>
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans font-medium">
                  {bio}
                </p>
              </div>
            )}

            {/* CAREER GOALS */}
            {careerGoals && (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Career Objectives</h3>
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                  {careerGoals}
                </p>
              </div>
            )}

            {/* PROJECTS SHOWCASE */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Showcase</h3>
                <span className="text-[10px] text-slate-400">{projects.length} Works</span>
              </div>

              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.map((proj, idx) => (
                    <div key={proj._id || idx} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 hover:border-indigo-500/30 transition-all">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{proj.title}</h4>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{proj.description}</p>
                        </div>
                        {proj.liveDemoUrl && (
                          <a href={proj.liveDemoUrl} target="_blank" rel="noreferrer" className="p-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                            <LinkIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {proj.technologies.map((t, tidx) => (
                            <span key={tidx} className="text-[8px] font-bold bg-slate-200/60 dark:bg-slate-900 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-slate-250 dark:border-slate-800 rounded-2xl">
                  <p className="text-xs text-slate-500">Showcase your coding work to improve your career profile.</p>
                  <Link to="/projects" className="inline-flex items-center text-xs font-bold text-indigo-600 mt-3 hover:underline">
                    Add first project <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* MILESTONES / TIMELINE (EXPERIENCE & EDUCATION) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* EXPERIENCE LOG */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Professional Experience</h3>
                </div>
                {experience ? (
                  <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed whitespace-pre-line">
                    {experience}
                  </p>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-[10px] text-slate-500">No experience milestones configured yet.</p>
                  </div>
                )}
              </div>

              {/* EDUCATION LOG */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Education Timeline</h3>
                </div>
                {education ? (
                  <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed whitespace-pre-line">
                    {education}
                  </p>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-[10px] text-slate-500">No education milestones configured yet.</p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}