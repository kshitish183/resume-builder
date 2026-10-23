import rateLimit from 'express-rate-limit';

export const aiRateLimit = rateLimit({
  windowMs: parseInt(process.env.AI_RATE_LIMIT_WINDOW_MS || '3600000', 10),
  max: parseInt(process.env.AI_RATE_LIMIT_MAX || '20', 10),
  message: {
    success: false,
    message: 'AI rate limit exceeded. Try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
});
