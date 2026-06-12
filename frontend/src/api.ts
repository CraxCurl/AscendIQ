import { API_BASE_URL } from './auth';

export type RadarPoint = {
  subject: string;
  score: number;
};

export type SkillGap = {
  skill: string;
  current: number;
  target: number;
};

export type Analysis = {
  user_summary: string;
  radar: RadarPoint[];
  skill_gaps: SkillGap[];
  stats: {
    career_health_score: number;
    roadmap_progress: number;
    ats_score: number;
    interview_readiness: number;
  };
  priorities: string[];
  strategic_plan: Array<{ title: string; description: string; impact: string }>;
  signals: {
    best_opportunity_match: string;
    resume_blocker: string;
    interview_focus: string;
    next_milestone: string;
    risk: string;
  };
  roadmap: Array<{ title: string; status: string; date: string; description: string }>;
  opportunities: Array<{ title: string; type: string; provider: string; match: number; focus: string; link?: string }>;
  resume_feedback: {
    ats_score: number;
    keyword_coverage: number;
    project_proof: number;
    missing_keywords: string[];
    suggestions: string[];
  };
  interview_prep: {
    ml_fundamentals: number;
    coding_readiness: number;
    story_bank: number;
    questions: Array<{ type: string; prompt: string }>;
  };
  leetcode_plan?: {
    dataset_size?: number;
    difficulty_mix?: Record<string, number>;
    starter_problems?: Array<{ id?: number; name: string; difficulty?: string; best_languages?: string }>;
    weekly_plan?: Array<{ week: number; topic: string; goal: string; problems?: Array<{ id?: number; name: string; difficulty?: string }> }>;
    practice_rules?: string[];
  };
  agent_reports?: Array<{
    agent_name: string;
    summary?: string;
    findings?: string[];
    recommendations?: string[];
  }>;
  agent_pipeline?: {
    specialists: string[];
    master: string;
    leetcode_dataset_size?: number;
  };
  master_summary?: string;
};

export type AnalysisRecord = {
  profile: {
    full_name: string;
    email: string;
    target_role: string;
    about_yourself?: string;
    skills?: string[];
  };
  analysis: Analysis;
  updated_at: string;
};

const parseError = async (response: Response) => {
  const error = await response.json().catch(() => null);
  return error?.detail ?? 'Something went wrong';
};

export const getAnalysis = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/profile/me/analysis`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as AnalysisRecord;
};

export const submitIntake = async (token: string, formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/profile/analyze-intake`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as AnalysisRecord & { status: string };
};

export const interviewChat = async (token: string, messages: { role: string; content: string }[]) => {
  const response = await fetch(`${API_BASE_URL}/api/interview/chat`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as { reply: string };
};

export const getLeetCodeRecommendations = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/leetcode/recommendations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(await parseError(response));
  return await response.json();
};

export const markLeetCodeSolved = async (token: string, problemId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/leetcode/solve`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ problem_id: problemId }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return await response.json();
};

export const generateCareerPath = async (token: string, mentorResume: File) => {
  const formData = new FormData();
  formData.append('mentor_resume', mentorResume);

  const response = await fetch(`${API_BASE_URL}/api/roadmap/career-path`, {
    method: 'POST',
    headers: { 
      Authorization: `Bearer ${token}` 
    },
    body: formData,
  });
  if (!response.ok) throw new Error(await parseError(response));
  return await response.json();
};
export const exploreMilestone = async (token: string, title: string, description: string) => {
  const response = await fetch(`${API_BASE_URL}/api/roadmap/explore-milestone`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ title, description }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return await response.json();
};

export const updateRoadmap = async (token: string, roadmap: any[]) => {
  const response = await fetch(`${API_BASE_URL}/api/roadmap/update-roadmap`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ roadmap }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return await response.json();
};

export const chatResumeBuilder = async (
  token: string,
  message: string,
  current_resume_text: string,
  target_role: string = "Software Engineer",
  missing_keywords: string[] = []
) => {
  const response = await fetch(`${API_BASE_URL}/api/resume_builder/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message,
      current_resume_text,
      target_role,
      missing_keywords,
    }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return await response.json() as { response_message: string; updated_resume_text: string };
};

export const generateDocx = async (token: string, resume_text: string) => {
  const response = await fetch(`${API_BASE_URL}/api/resume_builder/generate-docx`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ resume_text }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return await response.blob();
};
