import { Router } from 'express';
import { analyzeMatch, rewriteResumeBullets, getAIStatus } from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { aiRateLimit } from '../middleware/rateLimit.js';

const router = Router();

router.get('/status', getAIStatus);

router.use(protect);
router.use(aiRateLimit);

router.post('/analyze', analyzeMatch);
router.post('/rewrite', rewriteResumeBullets);

export default router;
