import React, { useEffect, useState } from 'react';
import { Card, Button, Form, Spinner } from 'react-bootstrap';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [activeTimers, setActiveTimers] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Update elapsed timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimers((prev) => {
        const updated = {};
        for (const taskId in prev) {
          const start = prev[taskId].start;
          updated[taskId] = {
            ...prev[taskId],
            elapsed: new Date() - new Date(start),
          };
        }
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleEdit = async (id, field, value) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, [field]: value } : task
    );
    setTasks(updated);

    try {
      await fetch(`/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const startTimer = async (taskId) => {
    try {
      const res = await fetch('/timers/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });

      const data = await res.json();

      if (res.ok) {
        const start = new Date(data.start);
        setActiveTimers((prev) => ({
          ...prev,
          [taskId]: { start, elapsed: 0 },
        }));
      }
    } catch (err) {
      console.error('Failed to start timer:', err);
    }
  };

  const stopTimer = async (taskId) => {
    try {
      const res = await fetch('/timers/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });

      if (res.ok) {
        setActiveTimers((prev) => {
          const copy = { ...prev };
          delete copy[taskId];
          return copy;
        });
      }
    } catch (err) {
      console.error('Failed to stop timer:', err);
    }
  };

  const formatElapsed = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      {tasks.length === 0 ? (
        <p>No tasks yet. Add one to get started!</p>
      ) : (
        tasks.map((task) => (
          <Card key={task.id} className="mb-3 shadow-sm">
            <Card.Body>
              {editingTaskId === task.id ? (
                <>
                  <Form.Control
                    type="text"
                    className="mb-2"
                    value={task.title}
                    onChange={(e) => handleEdit(task.id, 'title', e.target.value)}
                  />
                  <Form.Control
                    as="textarea"
                    rows={2}
                    className="mb-2"
                    value={task.description || ''}
                    onChange={(e) => handleEdit(task.id, 'description', e.target.value)}
                  />
                  <Form.Control
                    type="number"
                    min="1"
                    max="5"
                    className="mb-3"
                    value={task.priority || ''}
                    onChange={(e) => handleEdit(task.id, 'priority', e.target.value)}
                  />
                </>
              ) : (
                <>
                  <h5 className="mb-1">{task.title}</h5>
                  <div className="text-muted mb-2">{task.description || 'No description'}</div>
                  <div className="text-muted small">Priority: {task.priority || '-'}</div>
                </>
              )}

              <div className="d-flex flex-wrap gap-2 mt-3 align-items-center">
                {activeTimers[task.id] ? (
                  <>
                    <Button variant="outline-danger" size="sm" onClick={() => stopTimer(task.id)}>
                      Stop Timer
                    </Button>
                    <span className="text-muted small">
                      ⏱ {formatElapsed(activeTimers[task.id]?.elapsed || 0)}
                    </span>
                  </>
                ) : (
                  <Button variant="outline-primary" size="sm" onClick={() => startTimer(task.id)}>
                    Start Timer
                  </Button>
                )}

                {editingTaskId === task.id ? (
                  <Button variant="success" size="sm" onClick={() => setEditingTaskId(null)}>
                    Save
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => setEditingTaskId(task.id)}>
                    Edit
                  </Button>
                )}

                <Button variant="danger" size="sm" onClick={() => handleDelete(task.id)}>
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default TaskList;
