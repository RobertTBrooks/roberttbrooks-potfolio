import React, { useState, useEffect } from 'react';
import "./Clock.css";

function Clock() {
  const [dateTime, setDateTime] = useState(getFormattedDateTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(getFormattedDateTime());
    }, 1000); // update every second

    return () => clearInterval(timer); // cleanup when unmounted
  }, []);

  return (
    <div className="task-bar-clock">
      {dateTime}
    </div>
  );
}

function getFormattedDateTime() {
  const now = new Date();

  const month = String(now.getMonth() + 1).padStart(2, '0'); // 0-based months
  const day = String(now.getDate()).padStart(2, '0');
  const year = now.getFullYear();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12

  const time = `${hours}:${minutes} ${ampm}`;
  const date = `${month}/${day}/${year}`;

  return `${date} - ${time}`;
}

export default Clock;

