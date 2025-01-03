import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
    username: { type: String, required: [true, 'Username is required'], unique: true },
    name: { type: String, required: [true, 'Name is required'] },
    address: { type: String, required: [true, 'Address is required'] },
    password: { type: String, required: [true, 'password is required'] },
}, { timestamps: true }
);

const Staff = mongoose.model('Staff', staffSchema);
export default Staff;
