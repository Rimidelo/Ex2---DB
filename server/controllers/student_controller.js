import Student from '../models/student.js';
import Course from '../models/course.js';

export const enrollInCourse = async (req, res) => {
    const studentId = req.user.id;
    const { course_id } = req.params;
    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        const course = await Course.findOne({ _id: course_id });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        if (course.numOfStudents >= course.maxStudents) {
            return res.status(400).json({ error: 'Course is full' });
        }

        if (student.courses.includes(course_id)) {
            return res.status(400).json({ error: 'Student is already enrolled in this course' });
        }

        const totalCredits = student.numOfPoints + course.creditPoints;
        if (totalCredits > 20) {
            return res.status(400).json({ error: 'Enrolling in this course exceeds the credit limit of 20 points' });
        }

        student.courses.push(course_id);
        student.numOfPoints = totalCredits;

        course.studentsList.push(student._id);
        course.numOfStudents += 1;

        await student.save();
        await course.save();

        res.status(200).json({ message: 'Student successfully enrolled in the course', student });
    } catch (err) {
        console.error('Error enrolling student:', err);
        res.status(500).json({ error: 'Server error during enrollment' });
    }
};

export const dropFromCourse = async (req, res) => {
    const studentId = req.user.id;
    const { course_id } = req.params;

    try {
        const student = await Student.findById(studentId);
        const course = await Course.findById(course_id);

        if (!student || !course) {
            return res.status(404).json({ error: 'Student or course not found' });
        }

        if (!student.courses.includes(course_id)) {
            return res.status(400).json({ error: 'Student is not enrolled in this course' });
        }

        student.courses.pull(course_id);
        student.numOfPoints -= course.creditPoints;

        course.studentsList.pull(studentId);
        course.numOfStudents -= 1;

        await student.save();
        await course.save();

        res.status(200).json({ message: 'Successfully unenrolled from the course' });
    } catch (err) {
        console.error('Error during unenrollment:', err);
        res.status(500).json({ error: 'Server error during unenrollment' });
    }
};

