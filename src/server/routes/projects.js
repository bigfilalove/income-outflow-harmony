
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const mongoose = require('mongoose');

// Временная схема для проектов (до создания отдельного файла модели)
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

// GET /api/projects - Получить список всех проектов
router.get('/', authenticate, async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/projects - Добавить новый проект
router.post('/', authenticate, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const existingProject = await Project.findOne({ name });
    if (existingProject) {
      return res.status(409).json({ message: 'Project already exists' });
    }

    const project = new Project({ name });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: 'Invalid project data' });
  }
});

// DELETE /api/projects/:id - Удалить проект
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
