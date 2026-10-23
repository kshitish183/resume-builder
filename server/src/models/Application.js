import mongoose from 'mongoose';

const historyEntrySchema = new mongoose.Schema({
  action: { type: String, required: true },
  from: String,
  to: String,
  note: String,
  timestamp: { type: Date, default: Date.now },
});

const aiAnalysisSchema = new mongoose.Schema({
  matchScore: { type: Number, min: 0, max: 100 },
  strengths: [String],
  gaps: [String],
  keywords: [String],
  summary: String,
  suggestedBullets: [
    {
      original: String,
      rewritten: String,
      reason: String,
    },
  ],
  analyzedAt: { type: Date, default: Date.now },
});

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    jobDescription: { type: String, required: true },
    resumeSnapshot: { type: String, default: '' },
    status: {
      type: String,
      enum: ['saved', 'applied', 'interview', 'offer', 'rejected', 'withdrawn'],
      default: 'saved',
    },
    location: { type: String, default: '' },
    salary: { type: String, default: '' },
    url: { type: String, default: '' },
    notes: { type: String, default: '', maxlength: 5000 },
    aiAnalysis: aiAnalysisSchema,
    history: [historyEntrySchema],
    appliedAt: Date,
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Application', applicationSchema);
