import Resume from '../models/Resume.js';
import { parseResumeText } from '../services/ai.service.js';

export const getResume = async (req, res, next) => {
  try {
    let resume = await Resume.findOne({ user: req.user._id });
    if (!resume) {
      resume = await Resume.create({ user: req.user._id });
    }
    res.json({ success: true, data: resume });
  } catch (err) {
    next(err);
  }
};

export const updateResume = async (req, res, next) => {
  try {
    const allowed = ['summary', 'skills', 'experience', 'education', 'rawText'];
    let resume = await Resume.findOne({ user: req.user._id });

    if (!resume) {
      resume = new Resume({ user: req.user._id });
    }

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) resume[field] = req.body[field];
    });
    resume.lastUpdated = new Date();
    await resume.save();

    res.json({ success: true, data: resume });
  } catch (err) {
    next(err);
  }
};

export const parseResume = async (req, res, next) => {
  try {
    const { rawText } = req.body;
    if (!rawText?.trim()) {
      return res.status(400).json({ success: false, message: 'Resume text is required' });
    }

    const parsed = await parseResumeText(rawText);
    let resume = await Resume.findOne({ user: req.user._id });
    if (!resume) resume = new Resume({ user: req.user._id });

    resume.rawText = rawText;
    if (parsed.summary) resume.summary = parsed.summary;
    if (parsed.skills) resume.skills = parsed.skills;
    if (parsed.experience) resume.experience = parsed.experience;
    if (parsed.education) resume.education = parsed.education;
    resume.lastUpdated = new Date();
    await resume.save();

    res.json({ success: true, data: resume, parsed });
  } catch (err) {
    next(err);
  }
};
