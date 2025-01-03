import mongoose from 'mongoose';
const courseSchema = new mongoose.Schema({
    courseName: { type: String, required: [true, 'Course name is required'] },
    instructorName: { type: String, required: false },
    creditPoints: { type: Number, required: true, min: [3, 'Must be at least 3 credits'], max: [5, 'Cannot exceed 5 credits'] },
    maxStudents: { type: Number, required: true, default: 30 },
    numOfStudents: {
        type: Number,
        default: 0,
        min: 0,
        validate: {validator: function (value) {return value <= this.maxStudents;},
        message: 'numOfStudents cannot exceed maxStudents'
        }
    },
    studentsList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    lastDateRegistration: { type: Date, required: true }
}, { timestamps: true });
const Course=mongoose.model('Course',courseSchema);
export default Course;
