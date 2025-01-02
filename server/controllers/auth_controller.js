import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Student from '../models/student.js';
import Staff from '../models/staff.js';

export const registerUser = async (req, res) => {
    const { username, name, address, password, role, yearOfLearning } = req.body;

    try {
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (role === 'student') {
            const newStudent = new Student({ username, name, address, password: hashedPassword, yearOfLearning });
            await newStudent.save();
            return res.status(201).json({ message: 'Student registered successfully' });
        } else if (role === 'staff') {
            const newStaff = new Staff({ username, name, address, password: hashedPassword });
            await newStaff.save();
            return res.status(201).json({ message: 'Staff registered successfully' });
        } else {
            return res.status(400).json({ error: 'Invalid role specified' });
        }
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Server error during registration' });
    }
};




export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log('Login attempt with:', { username, password });

        let user = await Student.findOne({ username }) || await Staff.findOne({ username });
        console.log('User found:', user);

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        console.log('Password from request:', password);
        console.log('Hashed password from DB:', user.password);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
        res.status(200).json({ token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Server error during login' });
    }
};
