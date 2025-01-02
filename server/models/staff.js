import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required'] },
    address: { type: String, required: [true, 'Address is required'] },
    password: { type: String, required: true },
}, { timestamps: true }
);

const Staff = mongoose.model('Staff', staffSchema);
export default Staff;
