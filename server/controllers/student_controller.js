import Student from '../models/student.js';
import Course from '../models/course.js';
import logger from '../utilities/logger.js';

export const enrollInCourse = async (req, res) => {
    const studentId = req.user.id;
    const { course_id } = req.params;

    logger.info(`Enrollment attempt: studentId=${studentId}, courseId=${course_id}`);

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            logger.warn(`Enrollment failed: Student not found (studentId=${studentId})`);
            return res.status(404).json({ error: 'Student not found' });
        }

        const course = await Course.findOne({ _id: course_id });
        if (!course) {
            logger.warn(`Enrollment failed: Course not found (courseId=${course_id})`);
            return res.status(404).json({ error: 'Course not found' });
        }

        if (course.numOfStudents >= course.maxStudents) {
            logger.warn(`Enrollment failed: Course is full (courseId=${course_id})`);
            return res.status(400).json({ error: 'Course is full' });
        }

        if (student.courses.includes(course_id)) {
            logger.warn(`Enrollment failed: Student already enrolled (studentId=${studentId}, courseId=${course_id})`);
            return res.status(400).json({ error: 'Student is already enrolled in this course' });
        }

        const totalCredits = student.numOfPoints + course.creditPoints;
        if (totalCredits > 20) {
            logger.warn(`Enrollment failed: Credit limit exceeded (studentId=${studentId}, courseId=${course_id}, totalCredits=${totalCredits})`);
            return res.status(400).json({ error: 'Enrolling in this course exceeds the credit limit of 20 points' });
        }

        student.courses.push(course_id);
        student.numOfPoints = totalCredits;

        course.studentsList.push(student._id);
        course.numOfStudents += 1;

        await student.save();
        await course.save();

        logger.info(`Enrollment successful: studentId=${studentId}, courseId=${course_id}`);
        res.status(200).json({ message: 'Student successfully enrolled in the course', student });
    } catch (err) {
        logger.error(`Error enrolling student (studentId=${studentId}, courseId=${course_id}): ${err.message}`);
        res.status(500).json({ error: 'Server error during enrollment' });
    }
};

export const dropFromCourse = async (req, res) => {
    const studentId = req.user.id;
    const { course_id } = req.params;

    logger.info(`Unenrollment attempt: studentId=${studentId}, courseId=${course_id}`);

    try {
        const student = await Student.findById(studentId);
        const course = await Course.findById(course_id);

        if (!student || !course) {
            logger.warn(`Unenrollment failed: Student or course not found (studentId=${studentId}, courseId=${course_id})`);
            return res.status(404).json({ error: 'Student or course not found' });
        }

        if (!student.courses.includes(course_id)) {
            logger.warn(`Unenrollment failed: Student not enrolled (studentId=${studentId}, courseId=${course_id})`);
            return res.status(400).json({ error: 'Student is not enrolled in this course' });
        }

        student.courses.pull(course_id);
        student.numOfPoints -= course.creditPoints;

        course.studentsList.pull(studentId);
        course.numOfStudents -= 1;

        await student.save();
        await course.save();

        logger.info(`Unenrollment successful: studentId=${studentId}, courseId=${course_id}`);
        res.status(200).json({ message: 'Successfully unenrolled from the course' });
    } catch (err) {
        logger.error(`Error during unenrollment (studentId=${studentId}, courseId=${course_id}): ${err.message}`);
        res.status(500).json({ error: 'Server error during unenrollment' });
    }
};
