import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Student from '../models/student.js';
import Staff from '../models/staff.js';
import logger from '../utilities/logger.js';

export const registerUser = async (req, res) => {
    const { username, name, address, password, role, yearOfLearning } = req.body;

    logger.info(`Registration attempt: username=${username}, role=${role}`);

    try {
        const existingUser = await Student.findOne({ username }) || await Staff.findOne({ username });
        if (existingUser) {
            logger.warn(`Registration failed: Username already taken (username=${username})`);
            return res.status(400).json({ error: 'Username is already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (role === 'student') {
            const newStudent = new Student({ username, name, address, password: hashedPassword, yearOfLearning });
            await newStudent.save();
            logger.info(`Student registered successfully: username=${username}`);
            return res.status(201).json({ message: 'Student registered successfully' });
        } else if (role === 'staff') {
            const newStaff = new Staff({ username, name, address, password: hashedPassword });
            await newStaff.save();
            logger.info(`Staff registered successfully: username=${username}`);
            return res.status(201).json({ message: 'Staff registered successfully' });
        } else {
            logger.warn(`Registration failed: Invalid role specified (role=${role})`);
            return res.status(400).json({ error: 'Invalid role specified' });
        }
    } catch (err) {
        if (err.name === 'ValidationError') {
            logger.warn(`Validation error during registration: ${err.message}`);
            return res.status(400).json({ error: err.message });
        }
        logger.error(`Error during registration: ${err}`);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

export const loginUser = async (req, res) => {
    const { username, password} = req.body;

    logger.info(`Login attempt: username=${username}`);

    try {
        let user = await Student.findOne({ username });
        let role = 'student';
        if (!user) {user = await Staff.findOne({ username });role = 'staff';}
        if (!user) {
            logger.warn(`Login failed: User not found (username=${username})`);
            return res.status(400).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.warn(`Login failed: Invalid password (username=${username})`);
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id, role},process.env.JWT_SECRET,{ expiresIn: '10m' });
        logger.info(`Login successful: username=${username}`);
        res.status(200).json({ token });
    } catch (err) {
        logger.error(`Error during login: ${err.message}`);
        res.status(500).json({ error: 'Server error during login' });
    }
};
