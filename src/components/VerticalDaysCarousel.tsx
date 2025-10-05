import React, { useRef, useState } from "react";
import "./VerticalCarousel.css";

const days = [
  { name: "Monday", background: "monday.jpg" },
  { name: "Tuesday", background: "tuesday.jpg" },
  { name: "Wednesday", background: "wednesday.jpg" },
  { name: "Thursday", background: "thursday.jpg" },
  { name: "Friday", background: "friday.jpg" },
  { name: "Saturday", background: "saturday.jpg" },
  { name: "Sunday", background: "sunday.jpg" },
];

const VerticalDaysCarousel: React.FC = () => {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      setCurrentDayIndex((prev) => (prev + 1) % days.length);
    } else {
      setCurrentDayIndex((prev) => (prev - 1 + days.length) % days.length);
    }
  };

  const getCarouselClass = (index: number) => {
    const totalDays = days.length;
    const relativeIndex = (index - currentDayIndex + totalDays) % totalDays;

    if (relativeIndex === 0) return "carousel-slide current";
    if (relativeIndex === 1 || relativeIndex === totalDays - 1) return "carousel-slide partial";
    return "carousel-slide hidden";
  };

  return (
    <div
      className="vertical-carousel"
      ref={carouselRef}
      onWheel={handleWheel}
    >
      {days.map((day, index) => (
        <div
          key={day.name}
          className={getCarouselClass(index)}
          style={{
            backgroundImage: `url(${day.background})`,
          }}
        >
          <h2>{day.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default VerticalDaysCarousel;