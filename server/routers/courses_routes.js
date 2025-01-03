import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/tokenValidation.js';
import {
    createCourse,
    getCourses,
    updateCourse,
    deleteCourse,
    getSingleCourse,
} from '../controllers/courses_controller.js';

const router = express.Router();

router.get('/', authenticateToken, getCourses);
router.get('/:course_id', authenticateToken, getSingleCourse);

router.post('/create', authenticateToken, authorizeRole(['staff']), createCourse);
router.put('/:id', authenticateToken, authorizeRole(['staff']), updateCourse);
router.delete('/:id', authenticateToken, authorizeRole(['staff']), deleteCourse);

export default router;
