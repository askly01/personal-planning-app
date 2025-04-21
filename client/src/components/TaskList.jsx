import React, { useEffect, useState } from 'react';
import { Spinner, Row, Col } from 'react-bootstrap';
import TaskCard from './TaskCard';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingDraft, setEditingDraft] = useState({});
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

  const handleEditChange = (field, value) => {
    setEditingDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setEditingDraft({ ...task });
  };

  const handleSave = async (id) => {
    try {
      await fetch(`/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingDraft),
      });
      fetchTasks();
      setEditingTaskId(null);
    } catch (err) {
      console.error('Failed to save edits:', err);
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

  if (loading) return <Spinner animation="border" />;

  if (tasks.length === 0) return <p>No tasks yet. Add one to get started!</p>;

  return (
    <div>
      <Row className="g-3">
        {tasks.map((task) => (
          <Col key={task.id} xs={12} sm={6} lg={4}>
            <TaskCard
              task={editingTaskId === task.id ? editingDraft : task}
              isEditing={editingTaskId === task.id}
              activeTimer={activeTimers[task.id]}
              onEditChange={handleEditChange}
              onStartTimer={() => startTimer(task.id)}
              onStopTimer={() => stopTimer(task.id)}
              onEditClick={() => handleEditClick(task)}
              onSave={() => handleSave(task.id)}
              onDeleteClick={() => handleDelete(task.id)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TaskList;
