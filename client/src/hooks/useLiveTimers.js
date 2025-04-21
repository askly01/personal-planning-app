// src/hooks/useLiveTimers.js
import { useState, useEffect } from 'react';

/**
 * Keeps track of elapsed time for multiple timers
 * @param {Object} runningTimers - Map of taskId to start time (Date or ISO string)
 * @returns {Object} - Map of taskId to { start, elapsed }
 */
const useLiveTimers = (runningTimers) => {
  const [elapsedTimes, setElapsedTimes] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updated = {};

      for (const [taskId, startTime] of Object.entries(runningTimers)) {
        updated[taskId] = {
          start: new Date(startTime),
          elapsed: now - new Date(startTime),
        };
      }

      setElapsedTimes(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [runningTimers]);

  return elapsedTimes;
};

export default useLiveTimers;
