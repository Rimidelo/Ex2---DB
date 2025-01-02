import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Student from '../models/student.js';
import Staff from '../models/staff.js';

export const registerUser = async (req, res) => {
    const { name, address, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        if (role === 'student') {
            const newStudent = new Student({ name, address, password: hashedPassword });
            await newStudent.save();
            return res.status(201).json({ message: 'Student registered successfully' });
        } else if (role === 'staff') {
            const newStaff = new Staff({ name, address, password: hashedPassword }); // Hash the password
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
    const { name, password, role } = req.body;

    try {
        let user;
        if (role === 'student') {
            user = await Student.findOne({ name });
        } else if (role === 'staff') {
            user = await Staff.findOne({ name });
        } else {
            return res.status(400).json({ error: 'Invalid role specified' });
        }

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '10m' });
        res.status(200).json({ token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Server error during login' });
    }
};
