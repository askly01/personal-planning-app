import React, { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import PomodoroTimer from './components/PomodoroTimer';
import DailySummary from './components/DailySummary';
import { Col, Container, Row } from 'react-bootstrap';

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
    <Container fluid className="p-0" style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #b6c0f2, #d0c3e3)'
    }}>
      <Row className="gx-4 gy-4 p-4 align-items-start">
        <Col md={3} lg={3}>
          <TaskForm onTaskCreated={fetchTasks} />
          <PomodoroTimer tasks={tasks} />
        </Col>

        <Col md={9} lg={9}>
          <h4 className="h5 fw-bold mb-3">All Tasks</h4>
          <TaskList horizontalView />
          <div className="mt-4">
            <h4 className="h5 fw-bold mb-2">Today’s Time Summary</h4>
            <DailySummary />
          </div>
        </Col>
      </Row>
    </Container>

  );
}

export default App;
