import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, Download, ExternalLink, Globe, MapPin, Award, CheckCircle } from 'lucide-react';
import api from '../services/api';

export default function PublicPortfolio() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get(`/api/public/portfolio/${username}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Portfolio not found or is private.');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [username]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading portfolio...</div>;
  
  if (error || !data) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="card text-center max-w-md p-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <p className="text-gray-500 dark:text-gray-400">{error || 'Portfolio not found'}</p>
      </div>
    </div>
  );

  const { profile, about, skills, contact, codingProfiles, preferences, projects, stats, resumeUrl } = data;
  const isDark = preferences.theme === 'dark' || (preferences.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Set document title
  useEffect(() => {
    document.title = `${profile.name} | ${profile.headline}`;
  }, [profile]);

  return (
    <div className={`min-h-screen font-sans ${isDark ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
        
        {/* HERO SECTION */}
        <section className="text-center pt-10">
          <div className="relative inline-block mb-6">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt={profile.name} className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-4xl font-bold border-4 border-white dark:border-gray-800 shadow-xl">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full" title={profile.availabilityStatus}></span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-3">{profile.name}</h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 font-medium mb-4">{profile.headline}</p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-8">
            {profile.location && <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {profile.location}</span>}
            {profile.experienceYears > 0 && <span className="flex items-center"><Award className="w-4 h-4 mr-1" /> {profile.experienceYears} Years Exp.</span>}
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="btn-primary flex items-center">
                <Mail className="w-4 h-4 mr-2" /> Contact Me
              </a>
            )}
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noreferrer" className="px-6 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" /> Resume
              </a>
            )}
          </div>
          
          {/* Social Links */}
          <div className="flex items-center justify-center space-x-5 mt-8">
            {contact.github && <a href={contact.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><Github className="w-6 h-6" /></a>}
            {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Linkedin className="w-6 h-6" /></a>}
            {contact.twitter && <a href={contact.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors"><Twitter className="w-6 h-6" /></a>}
            {contact.website && <a href={contact.website} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"><Globe className="w-6 h-6" /></a>}
          </div>
        </section>

        {/* ABOUT SECTION */}
        {about && (
          <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 flex items-center">About Me</h2>
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
              <p className="text-lg leading-relaxed mb-6">{profile.bio}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {about.education && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Education</h3>
                    <p className="font-medium">{about.education}</p>
                  </div>
                )}
                {about.careerGoals && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Career Goals</h3>
                    <p className="font-medium">{about.careerGoals}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* SKILLS SECTION */}
        {skills && (
          <section>
            <h2 className="text-2xl font-bold mb-8">Technical Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(skills).filter(([_, list]) => list.length > 0).map(([category, list]) => (
                <div key={category} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 capitalize">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {list.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm font-medium rounded-lg text-gray-800 dark:text-gray-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS SECTION */}
        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-8">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map(project => (
                <div key={project._id} className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                  {project.coverImage ? (
                    <img src={project.coverImage} alt={project.title} className="w-full h-48 object-cover border-b border-gray-100 dark:border-gray-700" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-gray-100 dark:border-gray-700 flex items-center justify-center">
                      <Code className="w-12 h-12 text-indigo-200 dark:text-indigo-800" />
                    </div>
                  )}
                  <div className="p-6 sm:p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                      <div className="flex space-x-2">
                        {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white"><Github className="w-5 h-5" /></a>}
                        {project.liveDemoUrl && <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"><ExternalLink className="w-5 h-5" /></a>}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 4).map(tech => (
                        <span key={tech} className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-md">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-xs font-semibold px-2.5 py-1 text-gray-500">+{project.technologies.length - 4}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CAREER HIGHLIGHTS */}
        {stats && (
          <section className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-12 text-white text-center">
            <h2 className="text-2xl font-bold mb-10 text-white/90">Career Highlights</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-4xl font-black mb-2">{stats.projectsCompleted}</p>
                <p className="text-sm font-medium text-indigo-200">Projects Completed</p>
              </div>
              <div>
                <p className="text-4xl font-black mb-2">{stats.mockInterviewsCompleted}</p>
                <p className="text-sm font-medium text-indigo-200">Interviews Aced</p>
              </div>
              <div>
                <p className="text-4xl font-black mb-2">{stats.averageInterviewScore}</p>
                <p className="text-sm font-medium text-indigo-200">Avg Tech Score</p>
              </div>
              <div>
                <p className="text-4xl font-black mb-2 flex items-center justify-center">{stats.resumeScore || 'N/A'}</p>
                <p className="text-sm font-medium text-indigo-200">Resume ATS Score</p>
              </div>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="text-center pb-8 border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} {profile.name}. Built with SkillSync AI.</p>
        </footer>
      </main>
    </div>
  );
}
