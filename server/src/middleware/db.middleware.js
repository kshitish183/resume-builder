import { isDbReady } from '../config/db.js';

export const requireDB = (req, res, next) => {
  if (!isDbReady()) {
    return res.status(503).json({
      success: false,
      message: 'Database unavailable. Please ensure MongoDB is running (docker compose up -d).',
    });
  }
  next();
};
