import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import archiver from 'archiver';
import File from '../models/File.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'Uploads';
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 20, // Max 20 files
  },
});

const fileTypeMap = {
  jpg: { category: 'JPG', color: '#FF6B6B', icon: '🖼', folder: 'jpg' },
  jpeg: { category: 'JPEG', color: '#FF6B6B', icon: '🖼', folder: 'jpeg' },
  png: { category: 'PNG', color: '#FF6B6B', icon: '🖼', folder: 'png' },
  gif: { category: 'GIF', color: '#FF6B6B', icon: '🖼', folder: 'gif' },
  svg: { category: 'SVG', color: '#FF6B6B', icon: '🖼', folder: 'svg' },
  webp: { category: 'WEBP', color: '#FF6B6B', icon: '🖼', folder: 'webp' },
  pdf: { category: 'PDF', color: '#4ECDC4', icon: '📄', folder: 'pdf' },
  doc: { category: 'DOC', color: '#4ECDC4', icon: '📄', folder: 'doc' },
  docx: { category: 'DOCX', color: '#4ECDC4', icon: '📄', folder: 'docx' },
  txt: { category: 'TXT', color: '#4ECDC4', icon: '📄', folder: 'txt' },
  rtf: { category: 'RTF', color: '#4ECDC4', icon: '📄', folder: 'rtf' },
  xls: { category: 'XLS', color: '#45B7D1', icon: '📊', folder: 'xls' },
  xlsx: { category: 'XLSX', color: '#45B7D1', icon: '📊', folder: 'xlsx' },
  csv: { category: 'CSV', color: '#45B7D1', icon: '📊', folder: 'csv' },
  ppt: { category: 'PPT', color: '#F39C12', icon: '📽', folder: 'ppt' },
  pptx: { category: 'PPTX', color: '#F39C12', icon: '📽', folder: 'pptx' },
  mp4: { category: 'MP4', color: '#9B59B6', icon: '🎥', folder: 'mp4' },
  avi: { category: 'AVI', color: '#9B59B6', icon: '🎥', folder: 'avi' },
  mov: { category: 'MOV', color: '#9B59B6', icon: '🎥', folder: 'mov' },
  wmv: { category: 'WMV', color: '#9B59B6', icon: '🎥', folder: 'wmv' },
  mkv: { category: 'MKV', color: '#9B59B6', icon: '🎥', folder: 'mkv' },
  mp3: { category: 'MP3', color: '#E74C3C', icon: '🎵', folder: 'mp3' },
  wav: { category: 'WAV', color: '#E74C3C', icon: '🎵', folder: 'wav' },
  flac: { category: 'FLAC', color: '#E74C3C', icon: '🎵', folder: 'flac' },
  aac: { category: 'AAC', color: '#E74C3C', icon: '🎵', folder: 'aac' },
  zip: { category: 'ZIP', color: '#95A5A6', icon: '📦', folder: 'zip' },
  rar: { category: 'RAR', color: '#95A5A6', icon: '📦', folder: 'rar' },
  '7z': { category: '7Z', color: '#95A5A6', icon: '📦', folder: '7z' },
  tar: { category: 'TAR', color: '#95A5A6', icon: '📦', folder: 'tar' },
  js: { category: 'JS', color: '#2ECC71', icon: '💻', folder: 'js' },
  html: { category: 'HTML', color: '#2ECC71', icon: '💻', folder: 'html' },
  css: { category: 'CSS', color: '#2ECC71', icon: '💻', folder: 'css' },
  py: { category: 'PY', color: '#2ECC71', icon: '💻', folder: 'py' },
  java: { category: 'JAVA', color: '#2ECC71', icon: '💻', folder: 'java' },
  cpp: { category: 'CPP', color: '#2ECC71', icon: '💻', folder: 'cpp' },
  c: { category: 'C', color: '#2ECC71', icon: '💻', folder: 'c' },
};

const getFileCategory = (extension) => {
  return fileTypeMap[extension.toLowerCase()] || {
    category: extension.toUpperCase(),
    color: '#34495E',
    icon: '📄',
    folder: extension.toLowerCase(),
  };
};

router.post('/upload', upload.array('files'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const { sortBy = 'name', sortOrder = 'asc', minSize = 0, maxSize = Infinity } = req.body;
    const organized = {};
    const baseDir = 'organized';

    try {
      await fs.access(baseDir);
    } catch {
      await fs.mkdir(baseDir, { recursive: true });
    }

    for (const file of req.files) {
      const extension = path.extname(file.originalname).slice(1).toLowerCase();
      const categoryInfo = getFileCategory(extension);
      const categoryDir = path.join(baseDir, categoryInfo.folder);

      try {
        await fs.access(categoryDir);
      } catch {
        await fs.mkdir(categoryDir, { recursive: true });
      }

      const oldPath = file.path;
      const newPath = path.join(categoryDir, file.originalname);

      await fs.rename(oldPath, newPath);

      const fileDoc = {
        id: uuidv4(),
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        path: newPath,
        extension,
        category: categoryInfo.category,
        createdAt: new Date().toISOString(),
      };

      await File.create(fileDoc);

      if (!organized[categoryInfo.category]) {
        organized[categoryInfo.category] = {
          info: categoryInfo,
          files: [],
        };
      }

      organized[categoryInfo.category].files.push({
        ...fileDoc,
        lastModified: fileDoc.createdAt,
      });
    }

    for (const [category, data] of Object.entries(organized)) {
      let files = data.files;
      if (minSize || maxSize) {
        files = files.filter(file => file.size >= parseInt(minSize) * 1024 && file.size <= parseInt(maxSize) * 1024 * 1024);
      }
      files.sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case 'name':
            comparison = a.originalName.localeCompare(b.originalName);
            break;
          case 'size':
            comparison = a.size - b.size;
            break;
          case 'type':
            comparison = a.extension.localeCompare(b.extension);
            break;
          case 'date':
            comparison = new Date(a.lastModified) - new Date(b.lastModified);
            break;
        }
        return sortOrder === 'desc' ? -comparison : comparison;
      });
      organized[category].files = files;
    }

    const totalFiles = Object.values(organized).reduce((sum, cat) => sum + cat.files.length, 0);
    const totalSize = Object.values(organized).reduce((sum, cat) => sum + cat.files.reduce((catSum, file) => catSum + file.size, 0), 0);

    res.json({
      success: true,
      organized,
      statistics: {
        totalFiles,
        totalSize,
        categories: Object.keys(organized).length,
        categoriesDetail: Object.keys(organized),
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed: ' + error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totalFiles: 0,
      totalSize: 0,
      categories: {},
      lastOrganized: null,
    };

    const files = await File.find();
    stats.totalFiles = files.length;
    stats.totalSize = files.reduce((sum, file) => sum + file.size, 0);
    stats.lastOrganized = files.length > 0 ? new Date(Math.max(...files.map(f => new Date(f.createdAt)))).toISOString() : null;

    const categories = [...new Set(files.map(f => f.category))];
    for (const category of categories) {
      const categoryFiles = files.filter(f => f.category === category);
      stats.categories[category] = {
        count: categoryFiles.length,
        size: categoryFiles.reduce((sum, file) => sum + file.size, 0),
      };
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

router.get('/download', async (req, res) => {
  try {
    const archive = archiver('zip', { zlib: { level: 9 } });
    res.attachment('all-organized-files.zip');
    archive.pipe(res);

    const files = await File.find();

    for (const file of files) {
      const categoryInfo = getFileCategory(file.extension);
      archive.file(file.path, { name: `${categoryInfo.folder}/${file.originalName}` });
    }

    await archive.finalize();
  } catch (error) {
    res.status(500).json({ error: 'Download failed: ' + error.message });
  }
});

router.get('/download/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const archive = archiver('zip', { zlib: { level: 9 } });
    res.attachment(`${category}-files.zip`);
    archive.pipe(res);

    const files = await File.find({ category });

    for (const file of files) {
      const categoryInfo = getFileCategory(file.extension);
      archive.file(file.path, { name: `${categoryInfo.folder}/${file.originalName}` });
    }

    await archive.finalize();
  } catch (error) {
    res.status(500).json({ error: 'Download failed: ' + error.message });
  }
});

router.delete('/clear', async (req, res) => {
  try {
    const organizedDir = 'organized';
    const uploadsDir = 'Uploads';

    await File.deleteMany({});
    try {
      await fs.rm(organizedDir, { recursive: true, force: true });
      await fs.rm(uploadsDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Error clearing directories:', error);
    }

    res.json({ success: true, message: 'All files cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear files: ' + error.message });
  }
});

router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;