import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import DailySummary from './components/DailySummary';

function App() {
  return (
    <div className="d-flex justify-content-center p-4" style={{ background: 'linear-gradient(to bottom, #b6c0f2, #d0c3e3)', minHeight: '100vh' }}>
      <Container style={{ maxWidth: '800px' }}>
        <Row>
          <Col>
            {/* Task Management Section */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h2 className="h4 fw-bold mb-3">Your Tasks</h2>
                <TaskForm />
                <TaskList />
              </Card.Body>
            </Card>
          </Col>
          <Col>
            {/* Daily Summary Section */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h3 className="h5 fw-semibold mb-3">Today’s Time Summary</h3>
                <DailySummary />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
