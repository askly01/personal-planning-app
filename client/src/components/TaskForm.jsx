import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      title,
      description,
      priority: priority ? parseInt(priority) : null,
    };

    try {
      const res = await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      const data = await res.json();
      onTaskCreated(data); // Notify parent
      setTitle('');
      setDescription('');
      setPriority('');
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  return (
    <Card className="my-4 p-3">
      <h4>Add a New Task</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Title</Form.Label>
          <Form.Control
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Description</Form.Label>
          <Form.Control
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            as="textarea"
            rows={2}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Priority (1–5)</Form.Label>
          <Form.Control
            type="number"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            min="1"
            max="5"
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Add Task
        </Button>
      </Form>
    </Card>
  );
};

export default TaskForm;
