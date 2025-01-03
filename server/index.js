import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import logger from './utilities/logger.js';

import authRoutes from './routers/auth_routes.js';
import studentRoutes from './routers/student_routes.js';
import courseRoutes from './routers/courses_routes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

mongoose.connect(process.env.DB_HOST)
    .then(() => {
        logger.info('Connected to MongoDB');
    })
    .catch((err) => {
        logger.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1);
    });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);

app.use((err, req, res, next) => {
    logger.error(`Error: ${err.stack}`);
    res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});