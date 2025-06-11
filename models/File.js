import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  id: String,
  originalName: String,
  filename: String,
  size: Number,
  mimetype: String,
  path: String,
  extension: String,
  category: String,
  createdAt: String,
});

export default mongoose.model('File', fileSchema);