import { useEffect, useState } from "react";
import "./Counter.css";

const Counter = ({ date }) => {
  const [days, setDays] = useState([0, 0]);
  const [hours, setHours] = useState([0, 0]);
  const [minutes, setMinutes] = useState([0, 0]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = Date.parse(date) - Date.now();
      if (diff < 0) {
        return "Deadline passed";
      } else {
        setDays(
          String(Math.floor(diff / (1000 * 60 * 60 * 24)))
            .padStart(2, "0")
            .split("")
        );
        setHours(
          String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
            .padStart(2, "0")
            .split("")
        );

        setMinutes(
          String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)))
            .padStart(2, "0")
            .split("")
        );
        return [days, hours, minutes];
      }
    };

    calculateTimeLeft();

    // Calculate the time remaining until the next full minute
    const now = new Date();
    const secondsUntilNextMinute = 60 - now.getSeconds();
    const timeout = setTimeout(() => {
      calculateTimeLeft();

      // Set an interval to update the timer every minute
      const interval = setInterval(() => {
        calculateTimeLeft();
      }, 60000); // Update every minute

      // Clear the interval when the component unmounts
      return () => clearInterval(interval);
    }, secondsUntilNextMinute * 1000);

    // Clear the timeout if the component unmounts before the timeout completes
    return () => clearTimeout(timeout);
  }, [date]);

  return (
    <>
      <div className="counter">
        <div className="counter-item">
          <p className="counter-value counter-days">
            {days?.map((day, index) => {
              return <span key={index}>{day}</span>;
            })}
          </p>
          <p className="counter-label">Days</p>
        </div>
        <p className="counter-colon">:</p>
        <div className="counter-item">
          <p className="counter-value">
            <span>{hours[0]}</span> <span>{hours[1]}</span>
          </p>
          <p className="counter-label">Hours</p>
        </div>
        <p className="counter-colon">:</p>
        <div className="counter-item">
          <p className="counter-value">
            <span>{minutes[0]}</span> <span>{minutes[1]}</span>
          </p>
          <p className="counter-label">Minutes</p>
        </div>
      </div>
    </>
  );
};

export default Counter;
