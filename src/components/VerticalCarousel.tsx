import React, { useRef, useState } from "react";
import "./VerticalCarousel.css";

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
          }}
        >
          <h2>{month.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default VerticalCarousel;