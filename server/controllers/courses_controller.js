import Course from '../models/course.js';

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
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
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