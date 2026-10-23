import Resume from '../models/Resume.js';
import Application from '../models/Application.js';
import { analyzeJobMatch, rewriteBullets } from '../services/ai.service.js';
import { isAIConfigured } from '../config/openai.js';

export const analyzeMatch = async (req, res, next) => {
  try {
    const { jobDescription, resumeText, applicationId } = req.body;

    if (!jobDescription?.trim()) {
      return res.status(400).json({ success: false, message: 'Job description is required' });
    }

    let resume;
    if (resumeText) {
      resume = resumeText;
    } else {
      resume = await Resume.findOne({ user: req.user._id });
      if (!resume?.rawText && !resume?.summary && !resume?.experience?.length) {
        return res.status(400).json({ success: false, message: 'Please add your resume first' });
      }
    }

    const analysis = await analyzeJobMatch(jobDescription, resume);

    if (applicationId) {
      const app = await Application.findOne({ _id: applicationId, user: req.user._id });
      if (app) {
        app.aiAnalysis = { ...analysis, analyzedAt: new Date() };
        app.history.push({
          action: 'ai_analyzed',
          note: `AI match score updated: ${analysis.matchScore}%`,
        });
        await app.save();
      }
    }

    res.json({
      success: true,
      data: analysis,
      aiConfigured: isAIConfigured(),
    });
  } catch (err) {
    next(err);
  }
};

export const rewriteResumeBullets = async (req, res, next) => {
  try {
    const { bullets, jobDescription } = req.body;

    if (!bullets?.length || !jobDescription?.trim()) {
      return res.status(400).json({ success: false, message: 'Bullets and job description are required' });
    }

    const rewritten = await rewriteBullets(bullets, jobDescription);
    res.json({ success: true, data: rewritten, aiConfigured: isAIConfigured() });
  } catch (err) {
    next(err);
  }
};

export const getAIStatus = async (_req, res) => {
  res.json({
    success: true,
    data: {
      configured: isAIConfigured(),
      message: isAIConfigured()
        ? 'OpenAI is configured and ready'
        : 'Running in mock mode — set OPENAI_API_KEY in server/.env for real AI',
    },
  });
};
