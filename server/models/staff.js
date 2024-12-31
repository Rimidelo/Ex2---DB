import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required'] },
    address: { type: String, required: [true, 'Address is required'] }
}, { timestamps: true }
);

const Staff = mongoose.model('Staff', staffSchema);
export default Staff;
