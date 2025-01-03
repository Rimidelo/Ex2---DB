import Course from '../models/course.js';
import Student from '../models/student.js';
import logger from '../utilities/logger.js';

export const createCourse = async (req, res) => {
    const { courseName, instructorName, creditPoints, maxStudents, lastDateRegistration } = req.body;

    logger.info(`Create course attempt: courseName=${courseName}, instructor=${instructorName}`);

    try {
        const newCourse = new Course({ courseName, instructorName, creditPoints, maxStudents, lastDateRegistration });
        await newCourse.save();
        logger.info(`Course created successfully: courseName=${courseName}`);
        res.status(201).json({ message: 'Course created successfully' });
    } catch (err) {
        logger.error(`Error creating course: ${err.message}`);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: 'Server error while creating course' });
    }
};

export const getCourses = async (req, res) => {
    const userRole = req.user.role;
    const userId = req.user.id;

    logger.info(`Fetching courses: userRole=${userRole}, userId=${userId}`);

    try {
        if (userRole === 'staff') {
            const courses = await Course.find();
            logger.info(`Courses fetched for staff: totalCourses=${courses.length}`);
            return res.status(200).json(courses);
        } else if (userRole === 'student') {
            const student = await Student.findById(userId).populate('courses');
            if (!student) {
                logger.warn(`Student not found: userId=${userId}`);
                return res.status(404).json({ error: 'Student not found' });
            }
            logger.info(`Courses fetched for student: userId=${userId}, totalCourses=${student.courses.length}`);
            return res.status(200).json(student.courses);
        } else {
            logger.warn(`Unauthorized access attempt: userRole=${userRole}`);
            return res.status(403).json({ error: 'Unauthorized access' });
        }
    } catch (err) {
        logger.error(`Error fetching courses: ${err.message}`);
        res.status(500).json({ error: 'Server error while fetching courses' });
    }
};

export const updateCourse = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    logger.info(`Update course attempt: courseId=${id}, updateData=${JSON.stringify(updateData)}`);

    try {
        const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedCourse) {
            logger.warn(`Course not found: courseId=${id}`);
            return res.status(404).json({ error: 'Course not found' });
        }
        logger.info(`Course updated successfully: courseId=${id}`);
        res.status(200).json({ message: 'Course updated successfully', updatedCourse });
    } catch (err) {
        logger.error(`Error updating course: ${err.message}`);
        res.status(500).json({ error: 'Server error while updating course' });
    }
};

export const deleteCourse = async (req, res) => {
    const { id } = req.params;

    logger.info(`Delete course attempt: courseId=${id}`);

    try {
        const deletedCourse = await Course.findByIdAndDelete(id);
        if (!deletedCourse) {
            logger.warn(`Course not found: courseId=${id}`);
            return res.status(404).json({ error: 'Course not found' });
        }
        logger.info(`Course deleted successfully: courseId=${id}`);
        res.status(200).json({ message: 'Course deleted successfully', deletedCourse });
    } catch (err) {
        logger.error(`Error deleting course: ${err.message}`);
        res.status(500).json({ error: 'Server error while deleting course' });
    }
};

export const getSingleCourse = async (req, res) => {
    const userRole = req.user.role;
    const userId = req.user.id;
    const { course_id } = req.params;

    logger.info(`Fetching single course: courseId=${course_id}, userRole=${userRole}, userId=${userId}`);

    try {
        const course = await Course.findById(course_id);
        if (!course) {
            logger.warn(`Course not found: courseId=${course_id}`);
            return res.status(404).json({ error: 'Course not found' });
        }

        if (userRole === 'staff') {
            logger.info(`Course fetched for staff: courseId=${course_id}`);
            return res.status(200).json(course);
        } else if (userRole === 'student') {
            const student = await Student.findById(userId);
            if (!student || !student.courses.includes(course_id)) {
                logger.warn(`Access denied: studentId=${userId} not enrolled in courseId=${course_id}`);
                return res.status(403).json({ error: 'Access denied: You are not enrolled in this course' });
            }
            logger.info(`Course fetched for student: studentId=${userId}, courseId=${course_id}`);
            return res.status(200).json(course);
        } else {
            logger.warn(`Unauthorized access attempt: userRole=${userRole}`);
            return res.status(403).json({ error: 'Unauthorized access' });
        }
    } catch (err) {
        logger.error(`Error fetching course: ${err.message}`);
        res.status(500).json({ error: 'Server error while fetching course' });
    }
};
