import { useState, useEffect } from 'react';

export function useAmsterdamTime() {
  const [timeData, setTimeData] = useState(() => calculateAmsterdamTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeData(calculateAmsterdamTime());
    }, 10000); // update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return timeData;
}

function calculateAmsterdamTime() {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Amsterdam',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const timeString = formatter.format(now);
    const [hourStr] = timeString.split(':');
    const hour = parseInt(hourStr, 10);

    const isWorkingHours = hour >= 9 && hour < 18;

    return {
      timeString: `${timeString} CET`,
      isWorkingHours,
      hour,
      studioBadge: isWorkingHours
        ? "Studio Active in Amsterdam"
        : "Studio Queue Active",
      statusText: isWorkingHours
        ? "Active in Amsterdam (Replies < 1-2 hours)"
        : "Standby in Amsterdam (Next-morning review)",
    };
  } catch {
    return {
      timeString: "CET (Amsterdam)",
      isWorkingHours: true,
      hour: 12,
      studioBadge: "Studio Active in Amsterdam",
      statusText: "Active in Amsterdam",
    };
  }
}
