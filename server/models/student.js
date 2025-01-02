import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    numOfPoints: { type: Number, default: 0, min: 0, max: 20 },
    yearOfLearning: { type: Number, min: 1, max: 4},
    password: { type: String, required: true },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;
