import mongoose from 'mongoose';

const bulletSchema = new mongoose.Schema({
  text: { type: String, required: true },
  section: { type: String, default: 'experience' },
  order: { type: Number, default: 0 },
});

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    summary: { type: String, default: '', maxlength: 2000 },
    skills: [{ type: String, trim: true }],
    experience: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        bullets: [bulletSchema],
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        year: String,
      },
    ],
    rawText: { type: String, default: '' },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Resume', resumeSchema);
