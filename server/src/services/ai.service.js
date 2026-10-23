import { getOpenAIClient, isAIConfigured } from '../config/openai.js';

const MOCK_ANALYSIS = (jobDescription, resumeText) => {
  const jdLower = jobDescription.toLowerCase();
  const resumeLower = resumeText.toLowerCase();
  const keywords = ['react', 'node', 'javascript', 'python', 'aws', 'mongodb', 'typescript', 'api', 'agile'];
  const matched = keywords.filter((k) => jdLower.includes(k) && resumeLower.includes(k));
  const missing = keywords.filter((k) => jdLower.includes(k) && !resumeLower.includes(k));
  const score = Math.min(95, Math.max(35, 50 + matched.length * 8 - missing.length * 3));

  return {
    matchScore: score,
    strengths: matched.length
      ? matched.map((k) => `Strong alignment with ${k} requirements`)
      : ['Solid foundational experience relevant to the role'],
    gaps: missing.length
      ? missing.map((k) => `Job requires ${k} — not prominently featured in resume`)
      : ['Consider adding more quantified achievements'],
    keywords: [...matched, ...missing.slice(0, 3)],
    summary: `Your resume shows a ${score}% match with this role. ${
      matched.length ? `Key overlaps: ${matched.join(', ')}.` : ''
    } ${missing.length ? `Consider highlighting: ${missing.join(', ')}.` : ''}`,
    suggestedBullets: [
      {
        original: 'Worked on web applications',
        rewritten: 'Engineered scalable web applications using React and Node.js, improving load times by 40%',
        reason: 'Adds specific tech stack and quantified impact from the job description',
      },
      {
        original: 'Collaborated with team members',
        rewritten: 'Led cross-functional Agile sprints with product and design teams, shipping 3 features per quarter',
        reason: 'Aligns with teamwork and delivery expectations in the JD',
      },
      {
        original: 'Managed databases',
        rewritten: 'Designed MongoDB schemas and REST APIs handling 10K+ daily requests with 99.9% uptime',
        reason: 'Matches backend/database requirements with measurable outcomes',
      },
    ],
  };
};

const buildResumeText = (resume) => {
  if (resume.rawText) return resume.rawText;
  const parts = [];
  if (resume.summary) parts.push(`Summary: ${resume.summary}`);
  if (resume.skills?.length) parts.push(`Skills: ${resume.skills.join(', ')}`);
  resume.experience?.forEach((exp) => {
    parts.push(`${exp.role} at ${exp.company}`);
    exp.bullets?.forEach((b) => parts.push(`- ${b.text}`));
  });
  return parts.join('\n');
};

export const analyzeJobMatch = async (jobDescription, resume) => {
  const resumeText = typeof resume === 'string' ? resume : buildResumeText(resume);

  if (!isAIConfigured()) {
    return { ...MOCK_ANALYSIS(jobDescription, resumeText), mock: true };
  }

  const openai = getOpenAIClient();
  const prompt = `You are an expert career coach and ATS specialist. Analyze how well this resume matches the job description.

Return ONLY valid JSON with this exact structure:
{
  "matchScore": <number 0-100>,
  "strengths": [<string array, 3-5 items>],
  "gaps": [<string array, 3-5 items>],
  "keywords": [<string array of important JD keywords>],
  "summary": "<2-3 sentence overview>",
  "suggestedBullets": [
    {
      "original": "<existing or generic bullet>",
      "rewritten": "<improved bullet aligned to JD>",
      "reason": "<why this change helps>"
    }
  ]
}

Provide 3-5 suggestedBullets. Be specific and use metrics where possible.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  return JSON.parse(content);
};

export const rewriteBullets = async (bullets, jobDescription) => {
  if (!isAIConfigured()) {
    return bullets.map((b) => ({
      original: b,
      rewritten: b.replace(/^Worked on/i, 'Engineered').replace(/^Helped/i, 'Led'),
      reason: 'Mock rewrite — set OPENAI_API_KEY for real AI suggestions',
    }));
  }

  const openai = getOpenAIClient();
  const prompt = `Rewrite these resume bullet points to better align with the job description. Return ONLY valid JSON:
{
  "bullets": [
    { "original": "...", "rewritten": "...", "reason": "..." }
  ]
}

JOB DESCRIPTION:
${jobDescription}

BULLETS:
${bullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    response_format: { type: 'json_object' },
  });

  const parsed = JSON.parse(response.choices[0]?.message?.content);
  return parsed.bullets;
};

export const parseResumeText = async (rawText) => {
  if (!isAIConfigured()) {
    return {
      summary: rawText.split('\n')[0] || '',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      experience: [
        {
          company: 'Previous Company',
          role: 'Software Engineer',
          startDate: '2022',
          endDate: 'Present',
          bullets: rawText
            .split('\n')
            .filter((l) => l.trim().startsWith('-') || l.trim().startsWith('•'))
            .map((l, i) => ({ text: l.replace(/^[-•]\s*/, ''), order: i })),
        },
      ],
      education: [],
      mock: true,
    };
  }

  const openai = getOpenAIClient();
  const prompt = `Parse this resume text into structured JSON. Return ONLY valid JSON:
{
  "summary": "<professional summary>",
  "skills": [<string array>],
  "experience": [
    {
      "company": "...",
      "role": "...",
      "startDate": "...",
      "endDate": "...",
      "bullets": [{ "text": "...", "order": 0 }]
    }
  ],
  "education": [
    { "institution": "...", "degree": "...", "year": "..." }
  ]
}

RESUME TEXT:
${rawText}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0]?.message?.content);
};
