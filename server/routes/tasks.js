const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all tasks
router.get('/', async (req, res) => {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(tasks);
});

// POST create new task
router.post('/', async (req, res) => {
  const { title, description, priority, category, dueDate } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        category,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create task' });
  }
});

// PUT update task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated = await prisma.task.update({
      where: { id: parseInt(id) },
      data,
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update task' });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
