import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import categoryRoutes from './routes/categoryRoutes.js';
import subcatRoutes from './routes/subcatRoutes.js';
import itemRoutes from './routes/itemRoutes.js';

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.json({ strict: false }));

app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcatRoutes);
app.use('/api/items', itemRoutes);

const MONGO_URL = process.env.MONGO_URI;

mongoose.connect(MONGO_URL)
.then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));
})
.catch(err=>console.error('MongoDB connection error:', err));
