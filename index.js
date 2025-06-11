import express from 'express';
import cors from 'cors';
import fileRoutes from './routes/fileRoutes.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api', fileRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 File Organizer Server running on http://localhost:${PORT}`);
    console.log(`📁 Upload endpoint: http://localhost:${PORT}/api/upload`);
    console.log(`📊 Stats endpoint: http://localhost:${PORT}/api/stats`);
  });
});