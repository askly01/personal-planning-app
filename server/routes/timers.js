const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { startOfDay, endOfDay } = require('date-fns');


// Start a timer
router.post('/start', async (req, res) => {
  const { taskId } = req.body;

  try {
    const newTimer = await prisma.timer.create({
      data: {
        taskId: parseInt(taskId),
        start: new Date(),
      },
    });
    res.status(201).json(newTimer);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not start timer' });
  }
});

// Stop the most recent timer for a task
router.post('/stop', async (req, res) => {
  const { taskId } = req.body;

  try {
    const openTimer = await prisma.timer.findFirst({
      where: {
        taskId: parseInt(taskId),
        end: null,
      },
      orderBy: { start: 'desc' },
    });

    if (!openTimer) return res.status(404).json({ error: 'No active timer found' });

    const stoppedTimer = await prisma.timer.update({
      where: { id: openTimer.id },
      data: { end: new Date() },
    });

    res.json(stoppedTimer);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Could not stop timer' });
  }
});

// get all timer logs for today, grouped by task
router.get('/today', async (req, res) => {
	try {
		const todayTimers = await prisma.timer.findMany({
			where: {
				start: {
					gte: startOfDay(new Date()),
					lte: endOfDay(new Date()),
				},
			},
			include: { task: true },
		});

		const summary = {};

		todayTimers.forEach((timer) => {
			const taskId = timer.taskId;
			const duration = timer.end 
				? new Date(timer.end) - new Date(timer.start) 
				: 0;

			if (!summary[taskId]) {
				summary[taskId] = {
					taskTitle: timer.task.title,
					totalTimeMs: 0,
				};
			}

			summary[taskId].totalTimeMs += duration;
		});

		res.json(Object.values(summary));
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Could not fetch summary' });
	}
});

module.exports = router;
