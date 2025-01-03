import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routers/auth_routes.js';
import studentRoutes from './routers/student_routes.js';
import courseRoutes from './routers/courses_routes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

// MongoDB connection
mongoose.connect(process.env.DB_HOST)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    });


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});


app.get('/', (req, res) => {
    res.status(200).send('Welcome to the API');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
