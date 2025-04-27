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

// toggle complete task
router.patch('/:id/toggle', async (req, res) => {
  // coerce the route param to an integer
  const idParam = req.params.id;
  const taskId = parseInt(idParam, 10);

  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  try {
    // find the task by integer ID
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // flip completed and persist
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { completed: !task.completed },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Error toggling task completion', error);
    res.status(500).json({ error: 'Error toggling task completion' });
  }
});



module.exports = router;
