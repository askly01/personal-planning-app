import React, { useEffect, useState } from 'react';
import { Card, Button, Form, ProgressBar } from 'react-bootstrap';

const PomodoroTimer = ({ tasks }) => {
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [phase, setPhase] = useState('focus'); // 'focus' or 'break'
  const [duration, setDuration] = useState(25 * 60); // seconds
  const [breakLength, setBreakLength] = useState(5 * 60); // seconds
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

  const progress = ((phase === 'focus' ? duration : breakLength) - remaining) /
                   (phase === 'focus' ? duration : breakLength) * 100;

  return (
    <Card className="my-4 shadow-sm">
      <Card.Body>
        <h4 className="mb-3">Pomodoro Timer 🍅</h4>

        <Form.Group className="mb-3">
          <Form.Label>Select Task</Form.Label>
          <Form.Select
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

        <div className="text-center mb-3">
          <h1>{formatTime(remaining)}</h1>
          <div className="text-muted">{phase === 'focus' ? 'Focus time' : 'Break time'}</div>
        </div>

        <ProgressBar now={progress} className="mb-3" />

        <div className="d-flex gap-2 justify-content-center">
          {isRunning ? (
            <Button variant="danger" onClick={() => setIsRunning(false)}>Pause</Button>
          ) : (
            <Button variant="primary" onClick={handleStart}>Start</Button>
          )}
          <Button variant="secondary" onClick={handleReset}>Reset</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PomodoroTimer;
