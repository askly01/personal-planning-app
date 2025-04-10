const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /pomodoros
router.post('/', async (req, res) => {
  const { taskId, duration, breakLength } = req.body;

  if (!taskId || !duration || !breakLength) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const pomodoro = await prisma.pomodoro.create({
      data: {
        taskId: parseInt(taskId),
        start: new Date(),
        duration,
        breakLength,
      },
    });

    res.status(201).json(pomodoro);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log Pomodoro' });
  }
});

module.exports = router;
