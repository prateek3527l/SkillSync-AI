import { useState, useEffect, useRef } from 'react';
import { UploadCloud, FileText, Trash2, Download, Eye, X, Loader, Sparkles, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function ResumePage() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  
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

  useEffect(() => {
    fetchResume();
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
      handleAnalyze();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (analyzing) return;
    setAnalyzing(true);
    try {
      const res = await api.post('/resume/analysis');
      setResume(prev => ({ ...prev, analysis: res.data, resumeScore: res.data.overallScore }));
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'AI Analysis failed. Make sure the API key is set.');
    } finally {
      setAnalyzing(false);
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

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
      e.dataTransfer.clearData();
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader className="w-8 h-8 animate-spin text-primary-500" /></div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resume AI Analysis</h1>
          <p className="text-gray-500 dark:text-gray-400">Upload your resume and get instant feedback from our AI engine.</p>
        </div>
      </div>

      {!resume ? (
        <div 
          className="card border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center py-20 text-center hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer relative"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center text-primary-600">
              <Loader className="w-12 h-12 mb-4 animate-spin" />
              <p className="font-medium">Uploading your resume...</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6 text-primary-600 dark:text-primary-400">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Upload your resume</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
                Drag and drop your PDF file here, or click to browse. Maximum file size is 5MB.
              </p>
              <button className="btn-primary">Browse Files</button>
            </>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" className="hidden" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="p-4 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{resume.originalFileName}</h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4 mt-1">
                    <span>{formatFileSize(resume.fileSize)}</span>
                    <span>&bull;</span>
                    <span>Uploaded {new Date(resume.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button onClick={() => setPreviewOpen(true)} className="p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors" title="Preview">
                  <Eye className="w-5 h-5" />
                </button>
                <button onClick={handleDownload} className="p-2 text-primary-600 bg-primary-50 hover:bg-primary-100 dark:text-primary-400 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 rounded-md transition-colors" title="Download">
                  <Download className="w-5 h-5" />
                </button>
                <button onClick={handleDelete} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-md transition-colors" title="Delete">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" className="hidden" />

            {analyzing ? (
              <div className="card p-12 flex flex-col items-center justify-center text-center">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 rounded-full border-t-4 border-primary-500 animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-b-4 border-indigo-400 animate-spin" style={{ animationDirection: 'reverse' }}></div>
                  <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary-500 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Analyzing Resume...</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">Our AI is reading your resume, checking ATS compatibility, and generating tailored feedback. This usually takes 10-20 seconds.</p>
              </div>
            ) : (resume.analysis && resume.analysis.lastAnalyzedAt) ? (
              <div className="space-y-6">
                <div className="card p-6 border-t-4 border-primary-500">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Overall Summary</h3>
                  <p className="text-gray-600 dark:text-gray-300">{resume.analysis.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="card p-6 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800">
                    <h4 className="flex items-center text-emerald-700 dark:text-emerald-400 font-bold mb-4">
                      <CheckCircle2 className="w-5 h-5 mr-2" /> Key Strengths
                    </h4>
                    <ul className="space-y-3">
                      {resume.analysis.strengths.map((item, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                          <span className="mr-2 text-emerald-500">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="card p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800">
                    <h4 className="flex items-center text-red-700 dark:text-red-400 font-bold mb-4">
                      <AlertTriangle className="w-5 h-5 mr-2" /> Areas for Improvement
                    </h4>
                    <ul className="space-y-3">
                      {resume.analysis.weaknesses.map((item, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                          <span className="mr-2 text-red-500">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Rewritten Bullets */}
                {resume.analysis.rewrittenBulletPoints && resume.analysis.rewrittenBulletPoints.length > 0 && (
                  <div className="card p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Bullet Point Makeovers</h3>
                    <div className="space-y-4">
                      {resume.analysis.rewrittenBulletPoints.map((item, i) => (
                        <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-800 dark:text-gray-200">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Suggestions & Missing Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card p-6">
                    <h4 className="flex items-center text-blue-700 dark:text-blue-400 font-bold mb-4">
                      <AlertCircle className="w-5 h-5 mr-2" /> Actionable Suggestions
                    </h4>
                    <ul className="space-y-3">
                      {resume.analysis.suggestedImprovements.map((item, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                          <span className="mr-2 text-blue-500">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="card p-6">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4">Missing Keywords / Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {resume.analysis.missingSkills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600 dark:text-primary-400">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready for AI Analysis</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                  Our AI will act as a senior technical recruiter to review your resume, score it, and provide actionable feedback to improve your ATS ranking.
                </p>
                <button onClick={handleAnalyze} className="btn-primary flex items-center mx-auto">
                  <Sparkles className="w-4 h-4 mr-2" /> Analyze Resume
                </button>
              </div>
            )}
          </div>

          {/* Sidebar / Scorecard */}
          <div className="space-y-6">
            <div className="card p-6 text-center">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Overall Score</h3>
              <div className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {resume.analysis && resume.analysis.lastAnalyzedAt ? resume.analysis.overallScore : '--'}
                <span className="text-2xl text-gray-400">/100</span>
              </div>
              <p className="text-xs text-gray-400">
                {resume.analysis && resume.analysis.lastAnalyzedAt ? `Last updated: ${new Date(resume.analysis.lastAnalyzedAt).toLocaleDateString()}` : 'Not yet analyzed'}
              </p>
            </div>

            {resume.analysis && resume.analysis.lastAnalyzedAt && (
              <div className="card p-6 space-y-5">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 dark:border-gray-700">Detailed Metrics</h3>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">ATS Compatibility</span>
                    <span className="font-bold text-gray-900 dark:text-white">{resume.analysis.atsScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${resume.analysis.atsScore}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Formatting</span>
                    <span className="font-bold text-gray-900 dark:text-white">{resume.analysis.formattingScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${resume.analysis.formattingScore}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Grammar & Impact</span>
                    <span className="font-bold text-gray-900 dark:text-white">{resume.analysis.grammarScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${resume.analysis.grammarScore}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Keyword Match</span>
                    <span className="font-bold text-gray-900 dark:text-white">{resume.analysis.keywordScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${resume.analysis.keywordScore}%` }}></div>
                  </div>
                </div>
              </div>
            )}

            <button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={uploading || analyzing}
              className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors flex justify-center items-center"
            >
              {uploading ? <Loader className="w-5 h-5 mr-2 animate-spin" /> : <RefreshCw className="w-5 h-5 mr-2" />}
              {uploading ? 'Uploading...' : 'Replace Resume'}
            </button>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{resume.originalFileName}</h3>
              <button onClick={() => setPreviewOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 bg-gray-100 dark:bg-gray-900">
              <object data={`${api.defaults.baseURL ? api.defaults.baseURL.replace('/api', '') : ''}${resume.fileUrl}`} type="application/pdf" className="w-full h-full">
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Your browser does not support embedded PDFs.</p>
                  <button onClick={handleDownload} className="btn-primary">Download PDF to View</button>
                </div>
              </object>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}