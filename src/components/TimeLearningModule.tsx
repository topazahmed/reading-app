import React, { useEffect, useRef } from "react";
import "./TimeLearningModule.css";

const TimeLearningModule: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [randomTime, setRandomTime] = React.useState<{ hours: number; minutes: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const radius = 140; // Adjusted radius to prevent cutting off edges

    const drawClock = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(radius, radius);

      drawFace(ctx, radius);
      drawNumbers(ctx, radius);
      if (randomTime) {
        drawRandomTime(ctx, radius, randomTime.hours, randomTime.minutes);
      } else {
        drawTime(ctx, radius);
      }

      ctx.restore();
    };

    const drawFace = (ctx: CanvasRenderingContext2D, radius: number) => {
      const grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
      grad.addColorStop(0, "#333");
      grad.addColorStop(0.5, "white");
      grad.addColorStop(1, "#333");
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.strokeStyle = grad;
      ctx.lineWidth = radius * 0.1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
      ctx.fillStyle = "#333";
      ctx.fill();
    };

    const drawNumbers = (ctx: CanvasRenderingContext2D, radius: number) => {
      ctx.font = radius * 0.15 + "px arial";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      for (let num = 1; num < 13; num++) {
        const ang = (num * Math.PI) / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.85);
        ctx.rotate(-ang);
      }
    };

    const drawTime = (ctx: CanvasRenderingContext2D, radius: number) => {
      const now = new Date();
      let hour = now.getHours();
      let minute = now.getMinutes();
      let second = now.getSeconds();
      // Hour
      hour = hour % 12;
      hour = (hour * Math.PI) / 6 + (minute * Math.PI) / (6 * 60) + (second * Math.PI) / (360 * 60);
      drawHand(ctx, hour, radius * 0.5, radius * 0.07);
      // Minute
      minute = (minute * Math.PI) / 30 + (second * Math.PI) / (30 * 60);
      drawHand(ctx, minute, radius * 0.8, radius * 0.07);
      // Second
      second = (second * Math.PI) / 30;
      drawHand(ctx, second, radius * 0.9, radius * 0.02);
    };

    const drawRandomTime = (ctx: CanvasRenderingContext2D, radius: number, hours: number, minutes: number) => {
      // Hour
      const hourAngle = (hours * Math.PI) / 6 + (minutes * Math.PI) / (6 * 60);
      drawHand(ctx, hourAngle, radius * 0.5, radius * 0.07);
      // Minute
      const minuteAngle = (minutes * Math.PI) / 30;
      drawHand(ctx, minuteAngle, radius * 0.8, radius * 0.07);
    };

    const drawHand = (ctx: CanvasRenderingContext2D, pos: number, length: number, width: number) => {
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.moveTo(0, 0);
      ctx.rotate(pos);
      ctx.lineTo(0, -length);
      ctx.stroke();
      ctx.rotate(-pos);
    };

    const interval = setInterval(drawClock, 1000);
    drawClock(); // Initial draw

    return () => clearInterval(interval);
  }, [randomTime]);

  const setRandomClockTime = () => {
    const hours = Math.floor(Math.random() * 12); // Random hour between 0-11
    const minutes = Math.floor(Math.random() * 60); // Random minute between 0-59
    setRandomTime({ hours, minutes });
  };

  const sayTime = () => {
    const hours = randomTime ? randomTime.hours : new Date().getHours();
    const minutes = randomTime ? randomTime.minutes : new Date().getMinutes();
    const timeString = `The time is ${hours} ${minutes === 0 ? "o'clock" : minutes}`;

    const utterance = new SpeechSynthesisUtterance(timeString);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <canvas
        ref={canvasRef}
        width="300"
        height="300"
        style={{ backgroundColor: "transparent", display: "block", margin: "0 auto" }}
      />
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={sayTime}
          style={{
            margin: "10px",
            padding: "15px 25px",
            fontSize: "18px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Say Time
        </button>
        <button
          onClick={setRandomClockTime}
          style={{
            margin: "10px",
            padding: "15px 25px",
            fontSize: "18px",
            backgroundColor: "#28A745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Set Random Time
        </button>
      </div>
    </div>
  );
};

export default TimeLearningModule;