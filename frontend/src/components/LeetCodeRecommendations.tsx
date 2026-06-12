import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, ExternalLink, Code2 } from 'lucide-react';
import { getLeetCodeRecommendations, markLeetCodeSolved } from '../api';
import { useAuth } from '../auth';

export default function LeetCodeRecommendations() {
  const [data, setData] = useState<{recommended: any[], solved: string[]}>({ recommended: [], solved: [] });
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;
        const responseData = await getLeetCodeRecommendations(token);
        setData(responseData);
      } catch (error) {
        console.error('Error fetching LeetCode recommendations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSolved = async (problemId: string) => {
    const isSolved = data.solved.includes(problemId);
    
    if (!isSolved) {
      setData(prev => ({ ...prev, solved: [...prev.solved, problemId] }));
      try {
        if (!token) return;
        await markLeetCodeSolved(token, problemId);
      } catch (error) {
        setData(prev => ({ ...prev, solved: prev.solved.filter(id => id !== problemId) }));
        console.error('Failed to mark as solved', error);
      }
    }
  };

  if (loading) {
    return <div className="animate-pulse h-64 glass-panel flex items-center justify-center"><Code2 className="w-8 h-8 text-white/20 animate-spin" /></div>;
  }

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg border border-white/10">
            <Code2 className="w-6 h-6 text-white/80" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Recommended LeetCode</h2>
            <p className="text-sm text-white/50">Tailored to your resume skills and target role</p>
          </div>
        </div>
        <div className="text-sm font-medium text-white/70">
          <span className="text-white">{data.solved.length}</span> / {data.recommended.length} Solved
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {data.recommended.map((problem) => {
          const problemId = String(problem['#'] || problem['ID']);
          const isSolved = data.solved.includes(problemId);
          const title = problem['Problem Name'] || problem['Title'];
          const link = problem['Link'] || `https://leetcode.com/problems/${title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}/`;
          const topics = problem['Topics'] || problem['Best Language(s)'];
          
          return (
            <div 
              key={problemId}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                isSolved 
                  ? 'bg-green-500/10 border-green-500/20' 
                  : 'bg-black/40 border-white/5 hover:bg-white/5 hover:border-white/10'
              }`}
            >
              <button 
                onClick={() => toggleSolved(problemId)}
                className="mt-0.5 transition-colors shrink-0"
              >
                {isSolved ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-white/30 hover:text-white/70" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-white/90 hover:text-white transition-colors flex items-center gap-2 group truncate mb-1"
                >
                  {title}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </a>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    problem['Difficulty'] === 'Easy' ? 'bg-green-500/20 text-green-300' :
                    problem['Difficulty'] === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {problem['Difficulty']}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 truncate max-w-[200px]" title={topics}>
                    {topics}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
