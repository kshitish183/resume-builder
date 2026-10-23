import { Router } from 'express';
import { getResume, updateResume, parseResume } from '../controllers/resume.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { aiRateLimit } from '../middleware/rateLimit.js';

const router = Router();

router.use(protect);

router.get('/', getResume);
router.put('/', updateResume);
router.post('/parse', aiRateLimit, parseResume);

export default router;
