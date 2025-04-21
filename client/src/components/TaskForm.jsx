import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      title,
      description,
      priority: priority ? parseInt(priority) : null,
      dueDate,
      category,
    };

    try {
      const res = await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      const data = await res.json();
      onTaskCreated(data);
      setTitle('');
      setDescription('');
      setPriority('');
      setDueDate('');
      setCategory('');
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body className='p-3'>
        <Card.Title className="h5 mb-2">Add a New Task</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title" className="mb-2">
            <Form.Label className="fw-semibold fs-7">Title</Form.Label>
            <Form.Control size="sm"
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="description" className="mb-2">
            <Form.Label className="fw-semibold fs-7">Description</Form.Label>
            <Form.Control size="sm"
              as="textarea"
              rows={1}
              placeholder="Optional details"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="priority" className="mb-2">
            <Form.Label className="fw-semibold fs-7">Priority (1–5)</Form.Label>
            <Form.Control size="sm"
              type="number"
              min="1"
              max="5"
              placeholder="e.g. 3"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="dueDate" className="mb-2">
            <Form.Label className="fw-semibold fs-7">Due Date</Form.Label>
            <Form.Control size="sm"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="category" className="mb-2">
            <Form.Label className="fw-semibold fs-7">Category</Form.Label>
            <Form.Select size='sm'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="School">School</option>
              <option value="Health">Health</option>
            </Form.Select>
          </Form.Group>

          <Button type="submit" variant="primary">
            Add Task
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default TaskForm;
