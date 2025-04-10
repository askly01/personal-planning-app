import React, { useEffect, useState } from 'react';
import { Container, Card } from 'react-bootstrap';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import DailySummary from './components/DailySummary';
import PomodoroTimer from './components/PomodoroTimer';

function App() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await fetch('/tasks');
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="d-flex justify-content-center p-4" style={{ background: 'linear-gradient(to bottom, #b6c0f2, #d0c3e3)', minHeight: '100vh' }}>
      <Container style={{ maxWidth: '800px' }}>
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h2 className="h4 fw-bold mb-3">Your Tasks</h2>
            <TaskForm onTaskCreated={fetchTasks} />
            <TaskList />
          </Card.Body>
        </Card>

        <PomodoroTimer tasks={tasks} />

        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h3 className="h5 fw-semibold mb-3">Today’s Time Summary</h3>
            <DailySummary />
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default App;
