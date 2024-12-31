import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/tokenValidation.js';
import { createCourse,getCourses, updateCourse, deleteCourse} from '../controllers/courses_controller.js';

const router = express.Router();

router.post('/create', authenticateToken, authorizeRole(['staff']), createCourse);
router.get('/', authenticateToken, authorizeRole(['staff']), getCourses);
router.put('/:id', authenticateToken, authorizeRole(['staff']), updateCourse);
router.delete('/:id', authenticateToken, authorizeRole(['staff']), deleteCourse);

export default router;
