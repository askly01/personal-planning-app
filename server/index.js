const express = require('express');
const { PrismaClient } = require('@prisma/client');
const taskRoutes = require('./routes/tasks');
const timerRoutes = require('./routes/timers');

const app = express();
const prisma = new PrismaClient();


app.use(express.json());
app.use('/tasks', taskRoutes);
app.use('/timers', timerRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Personal Planning API is running 🚀');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
