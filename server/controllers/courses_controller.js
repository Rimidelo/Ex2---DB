import Course from '../models/course.js';
import Student from '../models/student.js';

export const createCourse = async (req, res) => {
    const { courseName, instructorName, creditPoints, maxStudents, lastDateRegistration } = req.body;

    try {
        const newCourse = new Course({ courseName, instructorName, creditPoints, maxStudents, lastDateRegistration });
        await newCourse.save();
        res.status(201).json({ message: 'Course created successfully' });
    } catch (err) {
        console.error('Error creating course:', err);
        res.status(500).json({ error: 'Server error while creating course' });
    }
};

export const getCourses = async (req, res) => {
    const userRole = req.user.role;
    const userId = req.user.id;

    try {
        if (userRole === 'staff') {
            const courses = await Course.find();
            return res.status(200).json(courses);
        } else if (userRole === 'student') {
            const student = await Student.findById(userId).populate('courses');
            if (!student) {
                return res.status(404).json({ error: 'Student not found' });
            }
            return res.status(200).json(student.courses);
        } else {
            return res.status(403).json({ error: 'Unauthorized access' });
        }
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ error: 'Server error while fetching courses' });
    }
};

export const updateCourse = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json({ message: 'Course updated successfully', updatedCourse });
    } catch (err) {
        console.error('Error updating course:', err);
        res.status(500).json({ error: 'Server error while updating course' });
    }
};

export const deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCourse = await Course.findByIdAndDelete(id);
        if (!deletedCourse) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted successfully', deletedCourse });
    } catch (err) {
        console.error('Error deleting course:', err);
        res.status(500).json({ error: 'Server error while deleting course' });
    }
};

export const getSingleCourse = async (req, res) => {
    const userRole = req.user.role;
    const userId = req.user.id;
    const { course_id } = req.params;

    try {
        const course = await Course.findById(course_id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        if (userRole === 'staff') {
            return res.status(200).json(course);
        } else if (userRole === 'student') {
            const student = await Student.findById(userId);
            if (!student || !student.courses.includes(course_id)) {
                return res.status(403).json({ error: 'Access denied: You are not enrolled in this course' });
            }
            return res.status(200).json(course);
        } else {
            return res.status(403).json({ error: 'Unauthorized access' });
        }
    } catch (err) {
        console.error('Error fetching course:', err);
        res.status(500).json({ error: 'Server error while fetching course' });
    }
};