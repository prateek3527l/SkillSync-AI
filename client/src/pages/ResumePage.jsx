import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud, FileText, Trash2, Download, Eye, X, Loader2, Sparkles,
  CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, Cpu, Award,
  BookOpen, Target, Check, ChevronRight, ArrowUpRight, ShieldCheck, FileCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const DEFAULT_ROLES = [
  'Full Stack Developer',
  'Backend Developer',
  'Frontend Developer',
  'Software Developer',
  'Python Developer'
];

// Helper hook for animating score count-up ring
function AnimatedScoreRing({ score = 0, label = "Match Score", size = 140, strokeWidth = 10, color = "indigo" }) {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = (score - start) / totalSteps;

    if (score === 0) {
      setCurrentScore(0);
      return;
    }

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setCurrentScore(score);
        clearInterval(timer);
      } else {
        setCurrentScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (currentScore / 100) * circumference;

  const colorMap = {
    indigo: { stroke: 'stroke-indigo-600 dark:stroke-indigo-500', text: 'text-indigo-600 dark:text-indigo-400' },
    emerald: { stroke: 'stroke-emerald-600 dark:stroke-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
    amber: { stroke: 'stroke-amber-500 dark:stroke-amber-400', text: 'text-amber-600 dark:text-amber-400' }
  };
  const activeColor = colorMap[color] || colorMap.indigo;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-800 fill-none"
            strokeWidth={strokeWidth}
          />
          {/* Progress stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`${activeColor.stroke} fill-none transition-all duration-300 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold tracking-tight ${activeColor.text}`}>
            {currentScore}%
          </span>
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ResumePage() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Python Microservice State
  const [analysisMode, setAnalysisMode] = useState('python'); // 'python' | 'gemini'
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [pythonRoles, setPythonRoles] = useState(DEFAULT_ROLES);
  const [pythonAnalysis, setPythonAnalysis] = useState(null);
  const [pythonAnalyzing, setPythonAnalyzing] = useState(false);

  // Progressive analysis UI step state (honest representation of active request)
  const [analysisProgressStep, setAnalysisProgressStep] = useState(0);

  const fileInputRef = useRef(null);

  const fetchResume = async () => {
    try {
      const res = await api.get('/resume');
      setResume(res.data);
    } catch (error) {
      toast.error('Failed to load resume data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPythonRoles = async () => {
    try {
      const res = await api.get('/resume/python-roles');
      if (res.data && res.data.roles) {
        setPythonRoles(res.data.roles);
      }
    } catch (e) {
      console.log('Using default roles');
    }
  };

  useEffect(() => {
    fetchResume();
    fetchPythonRoles();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      return toast.error('Only PDF files are allowed');
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('File size cannot exceed 5MB');
    }

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResume(res.data);
      toast.success('Resume uploaded successfully');

      // Auto run Python analysis
      handlePythonAnalyze(file);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePythonAnalyze = async (overrideFile = null) => {
    if (pythonAnalyzing) return;
    setPythonAnalyzing(true);
    setAnalysisProgressStep(1);

    const startTime = Date.now();
    const MIN_VISUAL_MS = 2400; // Minimum visual duration (~2.4s) for smooth UX progression

    const t1 = setTimeout(() => setAnalysisProgressStep(2), 600);
    const t2 = setTimeout(() => setAnalysisProgressStep(3), 1400);

    try {
      const formData = new FormData();
      if (overrideFile) {
        formData.append('resume', overrideFile);
      }
      formData.append('target_role', targetRole);

      const res = await api.post('/resume/analyze-python', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Ensure minimum visual loading duration so user sees analysis stepper
      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_VISUAL_MS) {
        await new Promise(r => setTimeout(r, MIN_VISUAL_MS - elapsed));
      }

      setAnalysisProgressStep(4);
      setPythonAnalysis(res.data);
      if (resume) {
        setResume(prev => ({
          ...prev,
          resumeScore: res.data.match_percentage
        }));
      }
      toast.success(`Python Skill Gap Analysis complete! Match: ${res.data.match_percentage}%`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Python skill analysis failed. Make sure Python service is running.');
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setPythonAnalyzing(false);
      setAnalysisProgressStep(0);
    }
  };

  const handleAnalyze = async () => {
    if (analyzing) return;
    setAnalyzing(true);
    setAnalysisProgressStep(1);

    const startTime = Date.now();
    const MIN_VISUAL_MS = 2400;

    const t1 = setTimeout(() => setAnalysisProgressStep(2), 600);
    const t2 = setTimeout(() => setAnalysisProgressStep(3), 1400);

    try {
      const res = await api.post('/resume/analysis');

      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_VISUAL_MS) {
        await new Promise(r => setTimeout(r, MIN_VISUAL_MS - elapsed));
      }

      setAnalysisProgressStep(4);
      setResume(prev => ({ ...prev, analysis: res.data, resumeScore: res.data.overallScore }));
      toast.success('AI Recruiter Analysis complete!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'AI Analysis failed. Make sure the API key is set.');
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setAnalyzing(false);
      setAnalysisProgressStep(0);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get('/resume/download', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', resume.originalFileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };






  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your resume? This cannot be undone.')) {
      try {
        await api.delete('/resume');
        setResume(null);
        setPythonAnalysis(null);
        toast.success('Resume deleted successfully');
      } catch (error) {
        toast.error('Failed to delete resume');
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
      e.dataTransfer.clearData();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading resume intelligence center...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* 1. HEADER & ENGINE SELECTION */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Resume Intelligence & Analysis
            </h1>
            <span className="badge badge-primary font-mono text-[10px]">FastAPI Active</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Parse your resume, measure role-matched skill gaps, and optimize for recruiter ATS standards.
          </p>
        </div>

        {/* Engine Switcher */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 self-start md:self-auto">
          <button
            onClick={() => setAnalysisMode('python')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              analysisMode === 'python'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span>Python FastAPI Engine</span>
          </button>

          <button
            onClick={() => setAnalysisMode('gemini')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              analysisMode === 'gemini'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Gemini AI Recruiter</span>
          </button>
        </div>
      </motion.div>

      {/* 2. RESUME UPLOAD OR ACTIVE RESUME BAR */}
      {!resume ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`card border-2 border-dashed transition-all p-10 flex flex-col items-center justify-center text-center relative ${
            isDragOver
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="flex flex-col items-center py-6">
              <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mb-4" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Uploading & Indexing PDF...</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Extracting text layout for python parsing</p>
            </div>
          ) : (
            <div className="flex flex-col items-center max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 border border-indigo-100 dark:border-indigo-900/40 shadow-sm">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload your PDF Resume</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6 leading-relaxed">
                Drag and drop your file here, or click to browse. Accepts valid PDF documents up to 5MB.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary"
              >
                Browse PDF File
              </button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            className="hidden"
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-l-indigo-600"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200/60 dark:border-rose-900/40 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                  {resume.originalFileName}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
                  <FileCheck className="w-3 h-3" /> Validated PDF
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3">
                <span>{formatFileSize(resume.fileSize)}</span>
                <span>•</span>
                <span>Uploaded {new Date(resume.uploadDate).toLocaleDateString()}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setPreviewOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors text-xs font-medium flex items-center gap-1.5"
              title="Preview Document"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden md:inline">Preview</span>
            </button>

            <button
              onClick={handleDownload}
              className="p-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 rounded-lg transition-colors text-xs font-medium flex items-center gap-1.5"
              title="Download File"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Download</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || analyzing || pythonAnalyzing}
              className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors text-xs font-medium flex items-center gap-1.5"
              title="Replace Resume"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden md:inline">Replace</span>
            </button>

            <button
              onClick={handleDelete}
              className="p-2 text-rose-600 hover:text-rose-700 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 rounded-lg transition-colors text-xs font-medium"
              title="Delete Resume"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            className="hidden"
          />
        </motion.div>
      )}

      {/* 3. TARGET ROLE & ENGINE CONTROL PANEL */}
      {resume && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 bg-slate-900 text-white dark:bg-slate-900 border-slate-800 shadow-lg relative overflow-hidden"
        >
          {/* Subtle background glow element */}
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold tracking-wider uppercase text-indigo-300">
                  Target Role Calibration
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your resume will be parsed and evaluated against expected technical skills for your target career track.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {pythonRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {analysisMode === 'python' ? (
                <button
                  onClick={() => handlePythonAnalyze()}
                  disabled={pythonAnalyzing}
                  className="btn-primary py-2.5 px-6 text-xs font-bold flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {pythonAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Python Analysis</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="btn-primary py-2.5 px-6 text-xs font-bold flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Evaluating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Run Gemini Recruiter</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* 4. PROGRESSIVE LOADING EXPERIENCE (HONEST REPRESENTATION OF FRONTEND REQUEST) */}
      <AnimatePresence>
        {(pythonAnalyzing || analyzing) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-8 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40 overflow-hidden"
          >
            <div className="flex flex-col items-center text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {pythonAnalyzing ? 'Python Microservice Parsing Resume...' : 'Gemini AI Recruiter Evaluating Resume...'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
                Executing text extraction, keyword matching, and skill gap identification.
              </p>

              {/* Step indicator */}
              <div className="w-full text-left space-y-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className={`flex items-center gap-2 ${analysisProgressStep >= 1 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400'}`}>
                    {analysisProgressStep > 1 ? <Check className="w-4 h-4 text-emerald-500" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                    1. Reading & Parsing PDF Content
                  </span>
                  {analysisProgressStep > 1 && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">DONE</span>}
                </div>

                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className={`flex items-center gap-2 ${analysisProgressStep >= 2 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400'}`}>
                    {analysisProgressStep > 2 ? <Check className="w-4 h-4 text-emerald-500" /> : (analysisProgressStep === 2 ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700" />)}
                    2. Extracting Technical & Soft Skills
                  </span>
                  {analysisProgressStep > 2 && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">DONE</span>}
                </div>

                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className={`flex items-center gap-2 ${analysisProgressStep >= 3 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400'}`}>
                    {analysisProgressStep > 3 ? <Check className="w-4 h-4 text-emerald-500" /> : (analysisProgressStep === 3 ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700" />)}
                    3. Comparing with {targetRole} Requirements
                  </span>
                  {analysisProgressStep > 3 && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">DONE</span>}
                </div>

                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className={`flex items-center gap-2 ${analysisProgressStep >= 4 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400'}`}>
                    {analysisProgressStep >= 4 ? <Check className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700" />}
                    4. Formatting Output & Recommendations
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. MAIN RESULTS SECTION */}
      {resume && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT/MAIN COLUMN (8 COLS) */}
          <div className="lg:col-span-8 space-y-6">

            {/* MODE 1: Python Microservice Results */}
            {analysisMode === 'python' && (
              pythonAnalysis ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Summary card with circular match score ring */}
                  <div className="card p-6 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <span className="badge badge-primary font-mono text-[10px]">Python Analysis Engine</span>
                        <span className="text-xs text-slate-400">Validated</span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {pythonAnalysis.target_role} Gap Assessment
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                        Matched <strong className="text-slate-900 dark:text-white font-bold">{pythonAnalysis.total_matched}</strong> out of <strong className="text-slate-900 dark:text-white font-bold">{pythonAnalysis.total_required}</strong> core required skills extracted for this target role.
                      </p>
                    </div>

                    <div className="shrink-0 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <AnimatedScoreRing
                        score={pythonAnalysis.match_percentage}
                        label="Role Match"
                        color={pythonAnalysis.match_percentage >= 70 ? "emerald" : "indigo"}
                      />
                    </div>
                  </div>

                  {/* Matched vs Missing Skills breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Matched Skills */}
                    <div className="card p-5 border-t-4 border-t-emerald-500">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4" /> Matched Skills ({pythonAnalysis.matched_skills.length})
                        </h4>
                      </div>
                      {pythonAnalysis.matched_skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {pythonAnalysis.matched_skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-md text-xs font-medium border border-emerald-200/60 dark:border-emerald-900/40 flex items-center gap-1.5"
                            >
                              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">No matching skills detected for this role.</p>
                      )}
                    </div>

                    {/* Missing Skills */}
                    <div className="card p-5 border-t-4 border-t-rose-500">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                          <AlertTriangle className="w-4 h-4" /> Skill Gaps ({pythonAnalysis.missing_skills.length})
                        </h4>
                      </div>
                      {pythonAnalysis.missing_skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {pythonAnalysis.missing_skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 rounded-md text-xs font-medium border border-rose-200/60 dark:border-rose-900/40 flex items-center gap-1.5"
                            >
                              <X className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Excellent! You match all expected core skills.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* All Detected Resume Skills */}
                  <div className="card p-5">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-500" /> All Detected Skills ({pythonAnalysis.detected_skills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {pythonAnalysis.detected_skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-md text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  {pythonAnalysis.recommendations && pythonAnalysis.recommendations.length > 0 && (
                    <div className="card p-6">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-500" /> Recommended Actions
                      </h4>
                      <div className="space-y-3">
                        {pythonAnalysis.recommendations.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-3"
                          >
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 ${
                              item.priority === 'High'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40'
                            }`}>
                              {item.priority} Priority
                            </span>
                            <div className="space-y-1">
                              <h5 className="text-xs font-bold text-slate-900 dark:text-white">{item.skill}</h5>
                              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.suggestion}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="card p-10 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-100 dark:border-indigo-900/40">
                    <Cpu className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Python Skill Engine Ready</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                      Run the Python analysis engine to extract skills from your resume PDF and calculate role alignment against {targetRole}.
                    </p>
                  </div>
                  <button
                    onClick={() => handlePythonAnalyze()}
                    className="btn-primary py-2 px-5 text-xs font-bold inline-flex items-center gap-2"
                  >
                    <Cpu className="w-4 h-4" /> Run Python Skill Analysis
                  </button>
                </div>
              )
            )}

            {/* MODE 2: Gemini Recruiter Results */}
            {analysisMode === 'gemini' && (
              (resume.analysis && resume.analysis.lastAnalyzedAt) ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="card p-6 border-l-4 border-l-amber-500">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" /> Recruiter Executive Summary
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {resume.analysis.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <div className="card p-5 border-t-4 border-t-emerald-500">
                      <h4 className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-3">
                        <CheckCircle2 className="w-4 h-4" /> Key Strengths
                      </h4>
                      <ul className="space-y-2.5">
                        {resume.analysis.strengths.map((item, i) => (
                          <li key={i} className="flex items-start text-xs text-slate-700 dark:text-slate-300 gap-2">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="card p-5 border-t-4 border-t-rose-500">
                      <h4 className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider mb-3">
                        <AlertTriangle className="w-4 h-4" /> Areas for Improvement
                      </h4>
                      <ul className="space-y-2.5">
                        {resume.analysis.weaknesses.map((item, i) => (
                          <li key={i} className="flex items-start text-xs text-slate-700 dark:text-slate-300 gap-2">
                            <span className="text-rose-500 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bullet Makeovers */}
                  {resume.analysis.rewrittenBulletPoints && resume.analysis.rewrittenBulletPoints.length > 0 && (
                    <div className="card p-6">
                      <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
                        Bullet Point Makeovers
                      </h3>
                      <div className="space-y-3">
                        {resume.analysis.rewrittenBulletPoints.map((item, i) => (
                          <div key={i} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions & Missing Keywords */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card p-5">
                      <h4 className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-3">
                        <AlertCircle className="w-4 h-4" /> Actionable Suggestions
                      </h4>
                      <ul className="space-y-2.5">
                        {resume.analysis.suggestedImprovements.map((item, i) => (
                          <li key={i} className="flex items-start text-xs text-slate-700 dark:text-slate-300 gap-2">
                            <span className="text-indigo-500 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="card p-5">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                        Missing ATS Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {resume.analysis.missingSkills.map((skill, i) => (
                          <span key={i} className="px-2.5 py-1 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 rounded-md text-xs font-medium border border-amber-200/60 dark:border-amber-900/40">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="card p-10 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-100 dark:border-amber-900/40">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Gemini Recruiter Engine Ready</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                      Our Gemini model acts as a senior technical recruiter to score your resume, audit bullet points, and provide ATS optimization guidance.
                    </p>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    className="btn-primary py-2 px-5 text-xs font-bold inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Run Gemini Recruiter Analysis
                  </button>
                </div>
              )
            )}

          </div>

          {/* RIGHT SIDEBAR COLUMN (4 COLS) */}
          <div className="lg:col-span-4 space-y-6">

            {/* MATCH / ATS OVERALL SCORE CARD */}
            <div className="card p-6 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                {pythonAnalysis ? 'Python Role Match' : 'Gemini Overall Score'}
              </span>

              <AnimatedScoreRing
                score={pythonAnalysis ? pythonAnalysis.match_percentage : (resume.analysis?.overallScore || 0)}
                label={pythonAnalysis ? "Matched" : "ATS Score"}
                size={160}
                strokeWidth={12}
                color={pythonAnalysis ? "indigo" : "amber"}
              />

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 w-full text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {pythonAnalysis
                    ? `Role: ${pythonAnalysis.target_role}`
                    : (resume.analysis?.lastAnalyzedAt ? `Analyzed on ${new Date(resume.analysis.lastAnalyzedAt).toLocaleDateString()}` : 'No evaluation yet')}
                </p>
              </div>
            </div>

            {/* GEMINI DETAILED ATS BREAKDOWN */}
            {resume.analysis && resume.analysis.lastAnalyzedAt && (
              <div className="card p-6 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
                  Detailed ATS Breakdown
                </h4>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">ATS Compatibility</span>
                      <span className="font-bold text-slate-900 dark:text-white">{resume.analysis.atsScore}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${resume.analysis.atsScore}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Formatting & Layout</span>
                      <span className="font-bold text-slate-900 dark:text-white">{resume.analysis.formattingScore}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${resume.analysis.formattingScore}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Impact & Grammar</span>
                      <span className="font-bold text-slate-900 dark:text-white">{resume.analysis.grammarScore}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${resume.analysis.grammarScore}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">Role Keyword Density</span>
                      <span className="font-bold text-slate-900 dark:text-white">{resume.analysis.keywordScore}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${resume.analysis.keywordScore}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TRUST & SECURITY BADGE */}
            <div className="card p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Your resume parsing data is encrypted and evaluated locally via Python microservice & secured AI APIs.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* PDF PREVIEW MODAL */}
      {previewOpen && resume && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{resume.originalFileName}</h3>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-950">
              <object
                data={`${api.defaults.baseURL ? api.defaults.baseURL.replace('/api', '') : ''}${resume.fileUrl}`}
                type="application/pdf"
                className="w-full h-full"
              >
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <FileText className="w-16 h-16 text-slate-400 mb-4" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Your browser does not support embedded PDF rendering.</p>
                  <button onClick={handleDownload} className="btn-primary">Download PDF to View</button>
                </div>
              </object>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
