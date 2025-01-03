import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/tokenValidation.js';
import { enrollInCourse, dropFromCourse } from '../controllers/student_controller.js';

const router = express.Router();

router.post('/:course_id', authenticateToken, authorizeRole(['student']), enrollInCourse);
router.delete('/:course_id', authenticateToken, authorizeRole(['student']), dropFromCourse);

export default router;
