import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  getStats,
} from '../controllers/application.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

router.use(protect);

router.get('/stats', getStats);
router.get('/', getApplications);
router.get('/:id', getApplication);

router.post(
  '/',
  [
    body('company').trim().notEmpty().withMessage('Company is required'),
    body('role').trim().notEmpty().withMessage('Role is required'),
    body('jobDescription').trim().notEmpty().withMessage('Job description is required'),
  ],
  validate,
  createApplication
);

router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
