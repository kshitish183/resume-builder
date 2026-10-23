import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDBWithRetry, getDbStatus } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { requireDB } from './middleware/db.middleware.js';

import authRoutes from './routes/auth.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import applicationRoutes from './routes/application.routes.js';
import aiRoutes from './routes/ai.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  const db = getDbStatus();
  res.status(db.connected ? 200 : 503).json({
    success: db.connected,
    message: db.connected ? 'ApplyAI API is running' : 'API running but database is not connected',
    database: db.connected ? 'connected' : 'disconnected',
    ai: Boolean(process.env.OPENAI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', requireDB, authRoutes);
app.use('/api/resume', requireDB, resumeRoutes);
app.use('/api/applications', requireDB, applicationRoutes);
app.use('/api/ai', requireDB, aiRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectDBWithRetry();
});
