import Application from '../models/Application.js';

const STATUS_LABELS = {
  saved: 'Saved',
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

export const getApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .sort({ order: 1, updatedAt: -1 });
    res.json({ success: true, data: applications });
  } catch (err) {
    next(err);
  }
};

export const getApplication = async (req, res, next) => {
  try {
    const app = await Application.findOne({ _id: req.params.id, user: req.user._id });
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.json({ success: true, data: app });
  } catch (err) {
    next(err);
  }
};

export const createApplication = async (req, res, next) => {
  try {
    const { company, role, jobDescription, resumeSnapshot, location, salary, url, notes, aiAnalysis } = req.body;

    const count = await Application.countDocuments({ user: req.user._id, status: 'saved' });

    const application = await Application.create({
      user: req.user._id,
      company,
      role,
      jobDescription,
      resumeSnapshot: resumeSnapshot || '',
      location,
      salary,
      url,
      notes,
      aiAnalysis,
      order: count,
      history: [
        {
          action: 'created',
          note: `Application created for ${role} at ${company}`,
        },
        ...(aiAnalysis
          ? [{ action: 'ai_analyzed', note: `AI match score: ${aiAnalysis.matchScore}%` }]
          : []),
      ],
    });

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};

export const updateApplication = async (req, res, next) => {
  try {
    const app = await Application.findOne({ _id: req.params.id, user: req.user._id });
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const allowed = ['company', 'role', 'jobDescription', 'location', 'salary', 'url', 'notes', 'aiAnalysis', 'order'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) app[field] = req.body[field];
    });

    if (req.body.status && req.body.status !== app.status) {
      app.history.push({
        action: 'status_changed',
        from: app.status,
        to: req.body.status,
        note: `Moved from ${STATUS_LABELS[app.status]} to ${STATUS_LABELS[req.body.status]}`,
      });
      app.status = req.body.status;
      if (req.body.status === 'applied' && !app.appliedAt) {
        app.appliedAt = new Date();
      }
    }

    await app.save();
    res.json({ success: true, data: app });
  } catch (err) {
    next(err);
  }
};

export const deleteApplication = async (req, res, next) => {
  try {
    const app = await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    next(err);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const apps = await Application.find({ user: req.user._id });
    const byStatus = {};
    apps.forEach((a) => {
      byStatus[a.status] = (byStatus[a.status] || 0) + 1;
    });

    const scores = apps.filter((a) => a.aiAnalysis?.matchScore).map((a) => a.aiAnalysis.matchScore);
    const avgScore = scores.length ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;

    res.json({
      success: true,
      data: {
        total: apps.length,
        byStatus,
        avgMatchScore: avgScore,
        applied: byStatus.applied || 0,
        interviews: byStatus.interview || 0,
        offers: byStatus.offer || 0,
      },
    });
  } catch (err) {
    next(err);
  }
};
