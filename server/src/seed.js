import 'dotenv/config';
import connectDB from './config/db.js';
import User from './models/User.js';
import Resume from './models/Resume.js';
import Application from './models/Application.js';

const seed = async () => {
  await connectDB();

  await Promise.all([User.deleteMany({}), Resume.deleteMany({}), Application.deleteMany({})]);

  const demo = await User.create({
    name: 'Alex Morgan',
    email: 'demo@applyai.io',
    password: 'demo123',
    title: 'Software Engineer',
  });

  const resume = await Resume.create({
    user: demo._id,
    summary: 'Full-stack developer with 4+ years building scalable web applications using React, Node.js, and MongoDB.',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB', 'AWS', 'REST APIs', 'Agile'],
    experience: [
      {
        company: 'TechCorp Inc.',
        role: 'Senior Software Engineer',
        startDate: '2022',
        endDate: 'Present',
        bullets: [
          { text: 'Built customer-facing React dashboard serving 50K+ monthly users', order: 0 },
          { text: 'Designed REST APIs with Node.js and MongoDB, reducing response time by 35%', order: 1 },
          { text: 'Led Agile sprint planning with cross-functional teams of 8', order: 2 },
        ],
      },
      {
        company: 'StartupXYZ',
        role: 'Full Stack Developer',
        startDate: '2020',
        endDate: '2022',
        bullets: [
          { text: 'Developed MVP web app from scratch using React and Express', order: 0 },
          { text: 'Implemented JWT authentication and role-based access control', order: 1 },
        ],
      },
    ],
    education: [{ institution: 'State University', degree: 'B.S. Computer Science', year: '2020' }],
    rawText: `Alex Morgan - Software Engineer\n\nSummary: Full-stack developer with 4+ years...\n\nSkills: JavaScript, React, Node.js, MongoDB\n\nExperience:\n- Built customer-facing React dashboard serving 50K+ monthly users\n- Designed REST APIs with Node.js and MongoDB`,
  });

  const apps = [
    {
      company: 'Stripe',
      role: 'Frontend Engineer',
      status: 'interview',
      location: 'Remote',
      jobDescription: 'We are looking for a Frontend Engineer with strong React and TypeScript skills. Experience with payment systems, API design, and building performant UIs is required.',
      aiAnalysis: {
        matchScore: 78,
        strengths: ['Strong React experience', 'API design background', 'Scalable UI development'],
        gaps: ['TypeScript not prominently featured', 'Payment systems experience missing'],
        keywords: ['React', 'TypeScript', 'API', 'performance'],
        summary: 'Good match — your React and API experience aligns well. Highlight TypeScript and any fintech exposure.',
        suggestedBullets: [
          { original: 'Built customer-facing React dashboard', rewritten: 'Architected high-performance React dashboard with TypeScript serving 50K+ users with sub-100ms load times', reason: 'Adds TypeScript and performance metrics from JD' },
        ],
      },
    },
    {
      company: 'Vercel',
      role: 'Full Stack Engineer',
      status: 'applied',
      location: 'San Francisco, CA',
      jobDescription: 'Join our team building the future of web development. Requirements: Next.js, React, Node.js, serverless architecture, MongoDB.',
      aiAnalysis: {
        matchScore: 85,
        strengths: ['React and Node.js expertise', 'MongoDB experience', 'Full-stack background'],
        gaps: ['Next.js not mentioned', 'Serverless experience unclear'],
        keywords: ['Next.js', 'React', 'Node.js', 'serverless', 'MongoDB'],
        summary: 'Strong match. Your full-stack skills align closely — emphasize any Next.js or serverless work.',
        suggestedBullets: [],
      },
    },
    {
      company: 'Amazon',
      role: 'SDE II',
      status: 'saved',
      location: 'Seattle, WA',
      jobDescription: 'Amazon is seeking a Software Development Engineer with experience in distributed systems, AWS, and building scalable backend services.',
      aiAnalysis: {
        matchScore: 62,
        strengths: ['Backend API experience', 'Scalability focus'],
        gaps: ['AWS not highlighted', 'Distributed systems experience needed'],
        keywords: ['AWS', 'distributed systems', 'scalable', 'backend'],
        summary: 'Moderate match. Strengthen AWS and distributed systems keywords in your resume.',
        suggestedBullets: [],
      },
    },
    {
      company: 'Meta',
      role: 'React Engineer',
      status: 'rejected',
      location: 'Menlo Park, CA',
      jobDescription: 'Build world-class React applications at scale. 3+ years React, performance optimization, component architecture.',
      aiAnalysis: { matchScore: 72, strengths: ['React expertise'], gaps: ['Scale metrics needed'], keywords: ['React', 'performance'], summary: 'Decent match but competition was high.', suggestedBullets: [] },
      appliedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  ];

  for (let i = 0; i < apps.length; i++) {
    const a = apps[i];
    await Application.create({
      user: demo._id,
      company: a.company,
      role: a.role,
      jobDescription: a.jobDescription,
      resumeSnapshot: resume.rawText,
      status: a.status,
      location: a.location,
      aiAnalysis: a.aiAnalysis,
      order: i,
      appliedAt: a.appliedAt,
      history: [
        { action: 'created', note: `Application created for ${a.role} at ${a.company}` },
        { action: 'ai_analyzed', note: `AI match score: ${a.aiAnalysis.matchScore}%` },
        ...(a.status !== 'saved' ? [{ action: 'status_changed', from: 'saved', to: a.status, note: `Moved to ${a.status}` }] : []),
      ],
    });
  }

  console.log('Seed complete!');
  console.log('Login: demo@applyai.io / demo123');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
