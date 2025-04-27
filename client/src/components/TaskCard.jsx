import React from 'react';
import { Card, Button, Form } from 'react-bootstrap';

const TaskCard = ({
  task,
  isEditing,
  activeTimer,
  onEditChange,
  onStartTimer,
  onStopTimer,
  onSave,
  onEditClick,
  onDeleteClick,
  onToggleComplete,
}) => {
  const formatElapsed = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min.toString().padStart(2, '0')}:${sec
      .toString()
      .padStart(2, '0')}`;
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return '-';
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="h-100 mb-3 shadow-sm">
      <Card.Body>
        {isEditing ? (
          <>
            <Form.Control
              type="text"
              className="mb-2"
              value={task.title}
              onChange={(e) => onEditChange('title', e.target.value)}
            />
            <Form.Control
              as="textarea"
              rows={2}
              className="mb-2"
              value={task.description || ''}
              onChange={(e) => onEditChange('description', e.target.value)}
            />
            <Form.Control
              type="number"
              min="1"
              max="5"
              className="mb-2"
              value={task.priority || ''}
              onChange={(e) => onEditChange('priority', e.target.value)}
            />
            <Form.Control
              type="date"
              className="mb-2"
              value={task.dueDate ? task.dueDate.substring(0, 10) : ''}
              onChange={(e) => onEditChange('dueDate', e.target.value)}
            />
            <Form.Select
              className="mb-2"
              value={task.category || ''}
              onChange={(e) => onEditChange('category', e.target.value)}
            >
              <option value="">Select a category</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="School">School</option>
              <option value="Health">Health</option>
            </Form.Select>
          </>
        ) : (
          <>
            <Card.Title className="h5">{task.title}</Card.Title>
            <Card.Text className="text-muted mb-2">
              {task.description || 'No description'}
            </Card.Text>
            <div className="text-muted small">
              <div>📌 Priority: {task.priority || '-'}</div>
              <div>📅 Due: {formatDate(task.dueDate)}</div>
              <div>📂 Category: {task.category || '-'}</div>
            </div>
          </>
        )}
      </Card.Body>

      <Card.Footer className="d-flex flex-wrap gap-2 justify-content-between">
        <div className="d-flex gap-2 align-items-center">
          <Form.Check
            type="checkbox"
            label="Done"
            checked={task.completed}
            onChange={(e) => onToggleComplete(e.target.checked)}
            className="me-2"
          />
          {activeTimer ? (
            <>
              <Button variant="outline-danger" size="sm" onClick={onStopTimer}>
                Stop
              </Button>
              <span className="text-muted small">
                ⏱ {formatElapsed(activeTimer.elapsed)}
              </span>
            </>
          ) : (
            <Button variant="outline-primary" size="sm" onClick={onStartTimer}>
              Start 
            </Button>
          )}
        </div>
        <div className="d-flex gap-2">
          <Button
            variant={isEditing ? 'success' : 'secondary'}
            size="sm"
            onClick={isEditing ? onSave : onEditClick}
          >
            {isEditing ? 'Save' : 'Edit'}
          </Button>
          <Button variant="danger" size="sm" onClick={onDeleteClick}>
             🗑️
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default TaskCard;
