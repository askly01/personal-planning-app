import React, { useEffect, useState } from 'react';
import { Card, Button, Form, ProgressBar } from 'react-bootstrap';

const PomodoroTimer = ({ tasks }) => {
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [phase, setPhase] = useState('focus');
  const [duration, setDuration] = useState(25 * 60);
  const [breakLength, setBreakLength] = useState(5 * 60);
  const [remaining, setRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setRemaining(phase === 'focus' ? duration : breakLength);
  }, [phase, duration, breakLength]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          handlePhaseEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase]);

  const handlePhaseEnd = async () => {
    setIsRunning(false);

    if (phase === 'focus') {
      try {
        await fetch('/pomodoros', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId: parseInt(selectedTaskId),
            duration,
            breakLength,
          }),
        });
        alert('Focus session complete! Break time 🎉');
      } catch (err) {
        console.error('Failed to log pomodoro:', err);
      }
      setPhase('break');
    } else {
      alert('Break over! Ready to focus again 💪');
      setPhase('focus');
    }
  };

  const handleStart = () => {
    if (!selectedTaskId) {
      alert('Please select a task first.');
      return;
    }
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemaining(phase === 'focus' ? duration : breakLength);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const progress =
    ((phase === 'focus' ? duration : breakLength) - remaining) /
    (phase === 'focus' ? duration : breakLength) *
    100;

  return (
    <Card className="shadow-sm">
      <Card.Body className="p-3">
        <div className="mb-2 fw-semibold fs-6">Pomodoro Timer 🍅</div>

        <Form.Group className="mb-2">
          <Form.Label className="fw-normal fs-7 mb-1">Select Task</Form.Label>
          <Form.Select
            size="sm"
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            disabled={isRunning}
          >
            <option value="">-- Select a task --</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
          <div className="fs-3 fw-bold">{formatTime(remaining)}</div>
          <div className="text-muted small">
            {phase === 'focus' ? 'Focus time' : 'Break time'}
          </div>
        </div>


        <ProgressBar now={progress} className="mb-2" />

        <div className="d-flex gap-2 justify-content-center">
          {isRunning ? (
            <Button variant="danger" size="sm" onClick={() => setIsRunning(false)}>Pause</Button>
          ) : (
            <Button variant="primary" size="sm" onClick={handleStart}>Start</Button>
          )}
          <Button variant="secondary" size="sm" onClick={handleReset}>Reset</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PomodoroTimer;
