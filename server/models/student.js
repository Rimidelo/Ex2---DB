import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    username: { type: String, required: [true, 'Username is required'], unique: true },
    name: { type: String, required: [true, 'Name is required'] },
    address: { type: String, required: [true, 'Address is required'] },
    password: { type: String, required: [true, 'password is required'] },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    numOfPoints: { type: Number, default: 0, min: 0, max: 20 },
    yearOfLearning: { type: Number, required: [true, 'Year of learning is required'], min: 1, max: 4 },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;
