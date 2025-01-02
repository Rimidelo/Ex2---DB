import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/tokenValidation.js';
import { createCourse, getCourses, updateCourse, deleteCourse, getSingleCourse } from '../controllers/courses_controller.js';
import { enrollInCourse, dropFromCourse } from '../controllers/student_controller.js';

const router = express.Router();

router.post('/create', authenticateToken, authorizeRole(['staff']), createCourse);
router.get('/', authenticateToken, getCourses);
router.put('/:id', authenticateToken, authorizeRole(['staff']), updateCourse);
router.delete('/:id', authenticateToken, authorizeRole(['staff']), deleteCourse);

router.get('/:course_id', authenticateToken, getSingleCourse);

router.post('/:course_id', authenticateToken, authorizeRole(['student']), enrollInCourse);
router.delete('/:course_id', authenticateToken, authorizeRole(['student']), dropFromCourse);



export default router;
