import React, { useRef, useState } from "react";
import "./VerticalCarousel.scss";

interface Month {
  name: string;
  background: string;
}

interface VerticalCarouselProps {
  months: Month[];
}

const VerticalCarousel: React.FC<VerticalCarouselProps> = ({ months }) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Define background colors for each month
  const monthColors = [
    "#4A90E2", // January - Winter Blue
    "#E91E63", // February - Valentine Pink
    "#8BC34A", // March - Spring Green
    "#FFC107", // April - Sunshine Yellow
    "#66BB6A", // May - Fresh Green
    "#FF9800", // June - Summer Orange
    "#F44336", // July - Hot Red
    "#FFB300", // August - Golden Yellow
    "#FF6F00", // September - Autumn Orange
    "#9C27B0", // October - Purple (Halloween)
    "#795548", // November - Brown (Thanksgiving)
    "#D32F2F", // December - Christmas Red
  ];

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      setCurrentMonthIndex((prev) => (prev + 1) % months.length);
    } else {
      setCurrentMonthIndex((prev) => (prev - 1 + months.length) % months.length);
    }
  };

  const getCarouselClass = (index: number) => {
    const totalMonths = months.length;
    const relativeIndex = (index - currentMonthIndex + totalMonths) % totalMonths;

    if (relativeIndex === 0) return "carousel-slide current";
    if (relativeIndex === 1 || relativeIndex === totalMonths - 1) return "carousel-slide partial";
    return "carousel-slide hidden";
  };

  return (
    <div
      className="vertical-carousel"
      ref={carouselRef}
      onWheel={handleWheel}
    >
      {months.map((month, index) => (
        <div
          key={month.name}
          className={getCarouselClass(index)}
          style={{
            backgroundImage: `url(${month.background})`,
            backgroundColor: monthColors[index % monthColors.length],
          }}
        >
          <h2>{month.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default VerticalCarousel;