import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Spinner, Container } from 'react-bootstrap';

const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

const DailySummary = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const res = await fetch('/timers/today');
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <Container className="my-4">
      <h3>Today’s Time Summary</h3>
      {loading ? (
        <Spinner animation="border" />
      ) : summary.length === 0 ? (
        <p>No time tracked yet today.</p>
      ) : (
        <ListGroup>
          {summary.map((item, index) => (
            <ListGroup.Item key={index}>
              <strong>{item.taskTitle}</strong> — {formatDuration(item.totalTimeMs)}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default DailySummary;
