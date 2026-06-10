import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Upload, FileText, Github, Linkedin, Briefcase, Loader2, MessageSquareText, Sparkles, UserRound } from 'lucide-react';
import { submitIntake } from '../api';
import { useAnalysis } from '../analysis';
import { useAuth } from '../auth';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.docx'];

const ProfileUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useAuth();
  const { setRecord } = useAnalysis();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [banner, setBanner] = useState((location.state as { banner?: string } | null)?.banner ?? '');
  const [fullName, setFullName] = useState('');
  const [targetRole, setTargetRole] = useState('AI Engineer');
  const [skills, setSkills] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [aboutYourself, setAboutYourself] = useState('');

  const validateAndSetFile = (file?: File) => {
    if (!file) return;
    const hasAllowedType = ALLOWED_FILE_TYPES.includes(file.type);
    const hasAllowedExtension = ALLOWED_FILE_EXTENSIONS.some((extension) =>
      file.name.toLowerCase().endsWith(extension)
    );

    if (!hasAllowedType && !hasAllowedExtension) {
      setSelectedFile(null);
      setUploadError('Please upload a PDF or DOCX resume.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      setUploadError('Resume must be 5MB or smaller.');
      return;
    }

    setSelectedFile(file);
    setUploadError('');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');

    if (!selectedFile && !aboutYourself.trim()) {
      setUploadError('Upload a resume or describe yourself before generating analytics.');
      setBanner('AscendIQ needs at least one strong signal: your resume or your own story.');
      return;
    }

    if (!token) {
      setUploadError('Please log in again before starting analysis.');
      return;
    }

    setLoading(true);
    setBanner('Reading your profile signals and preparing the AI analysis...');

    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('target_role', targetRole);
    formData.append('about_yourself', aboutYourself);
    formData.append('github_url', githubUrl);
    formData.append('linkedin_url', linkedinUrl);
    formData.append(
      'skills',
      JSON.stringify(skills.split(',').map((skill) => skill.trim()).filter(Boolean))
    );
    if (selectedFile) {
      formData.append('resume', selectedFile);
    }

    try {
      const record = await submitIntake(token, formData);
      setRecord(record);
      setBanner('Analysis complete. Your dashboard is ready.');
      navigate('/dashboard');
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Could not generate analytics.');
      setBanner('The analysis did not finish. Review the details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 flex flex-col items-center bg-black relative selection:bg-white/30 selection:text-white">
      <div className="absolute top-0 left-1/4 w-1/2 h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="max-w-3xl w-full z-10 animate-fade-in">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white glow-text">Complete Your Profile</h1>
          <p className="text-white/50 text-lg">Help AscendIQ understand your background to build your live career OS.</p>
        </header>

        {banner && (
          <div className="mb-6 flex gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-white backdrop-blur-md">
            {loading ? <Loader2 className="mt-0.5 shrink-0 animate-spin text-white" size={18} /> : <Sparkles className="mt-0.5 shrink-0 text-white" size={18} />}
            <p>{banner}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 glass-panel p-8">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block">
              <span className="text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
                <UserRound size={16} /> Full Name
              </span>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder={user?.email?.split('@')[0] ?? 'Your name'}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
                <Sparkles size={16} /> Skills
              </span>
              <input
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                placeholder="Python, React, SQL, Figma"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors"
              />
            </label>
          </section>

          {/* Target Role */}
          <section>
            <label className="block text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
              <Briefcase size={16} /> Target Career Role
            </label>
            <select
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none"
            >
              <option>AI Engineer</option>
              <option>Data Scientist</option>
              <option>Software Engineer</option>
              <option>Robotics Engineer</option>
              <option>Product Manager</option>
              <option>Cybersecurity Analyst</option>
            </select>
          </section>

          {/* Resume Upload */}
          <section>
            <label className="block text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
              <FileText size={16} /> Upload Resume (PDF/DOCX)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={(e) => validateAndSetFile(e.target.files?.[0])}
            />
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer focus:outline-none ${
                isDragging
                  ? 'border-white bg-white/10'
                  : selectedFile
                    ? 'border-white/50 bg-white/5'
                    : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <Upload className={`mx-auto mb-4 ${selectedFile ? 'text-white' : 'text-white/40'}`} size={32} />
              <p className="text-white/80 font-medium">
                {selectedFile ? selectedFile.name : 'Drag and drop or click to upload'}
              </p>
              <p className="text-xs text-white/40 mt-2">
                {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)}MB selected` : 'Maximum file size: 5MB'}
              </p>
            </div>
          </section>

          <section>
            <label className="block text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
              <MessageSquareText size={16} /> Describe Yourself
            </label>
            <textarea
              value={aboutYourself}
              onChange={(event) => setAboutYourself(event.target.value)}
              rows={7}
              placeholder="Tell AscendIQ about your background, projects, goals, strengths, doubts, preferred roles, or anything your resume misses."
              className="w-full resize-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors placeholder:text-white/20"
            />
            <p className="mt-2 text-xs text-white/40">Resume or this section is compulsory. Adding both produces better analytics.</p>
          </section>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section>
              <label className="block text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
                <Github size={16} /> GitHub Profile
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(event) => setGithubUrl(event.target.value)}
                placeholder="https://github.com/yourusername"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors placeholder:text-white/20"
              />
            </section>
            <section>
              <label className="block text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
                <Linkedin size={16} /> LinkedIn Profile
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(event) => setLinkedinUrl(event.target.value)}
                placeholder="https://linkedin.com/in/yourusername"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors placeholder:text-white/20"
              />
            </section>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-full text-lg font-bold transition-all flex items-center justify-center gap-2 hover:bg-white/90 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Generating AI Analytics...
              </>
            ) : (
              <>
                <CheckCircle2 size={20} /> Initialize AI Analysis
              </>
            )}
          </button>

          {uploadError && (
            <div className="flex gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 backdrop-blur-sm">
              <AlertCircle className="mt-0.5 shrink-0 text-red-400" size={16} />
              <p>{uploadError}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileUpload;
