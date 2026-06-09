import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Github, Linkedin, Briefcase, Loader2 } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.docx'];

const ProfileUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 3000);
  };

  return (
    <div className="min-h-screen py-12 px-6 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Complete Your Profile</h1>
          <p className="text-slate-400 text-lg">Help AscendIQ understand your background to build your career OS.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
          {/* Target Role */}
          <section>
            <label className="block text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
              <Briefcase size={16} /> Target Career Role
            </label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500">
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
            <label className="block text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
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
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer bg-slate-800/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDragging
                  ? 'border-indigo-400 bg-indigo-500/10'
                  : selectedFile
                    ? 'border-emerald-500/70'
                    : 'border-slate-700 hover:border-indigo-500'
              }`}
            >
              <Upload className={`mx-auto mb-4 ${selectedFile ? 'text-emerald-400' : 'text-slate-500'}`} size={32} />
              <p className="text-slate-300">
                {selectedFile ? selectedFile.name : 'Drag and drop or click to upload'}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)}MB selected` : 'Maximum file size: 5MB'}
              </p>
            </div>
            {uploadError && <p className="text-sm text-rose-400 mt-3">{uploadError}</p>}
          </section>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section>
              <label className="block text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                <Github size={16} /> GitHub Profile
              </label>
              <input
                type="url"
                placeholder="https://github.com/yourusername"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </section>
            <section>
              <label className="block text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                <Linkedin size={16} /> LinkedIn Profile
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/yourusername"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </section>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 py-4 rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Analyzing Profile...
              </>
            ) : (
              "Initialize AI Analysis"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpload;
