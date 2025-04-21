import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Container } from 'react-bootstrap';

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
      {loading ? (
        <Spinner animation="border" />
      ) : summary.length === 0 ? (
        <p>No time tracked yet today.</p>
      ) : (
        <Row className="g-3">
          {summary.map((item, index) => (
            <Col key={index} xs={12} sm={6} md={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="fs-6">{item.taskTitle}</Card.Title>
                  <Card.Text className="text-muted">
                    <strong>Total Time:</strong> {formatDuration(item.totalTimeMs)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default DailySummary;
