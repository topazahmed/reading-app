import React, { useRef, useState, useEffect } from "react";
import "./VerticalDaysCarousel.scss";

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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  // Define background colors for each day
  const dayColors = [
    "#2196F3", // Monday - Blue (Start of week)
    "#4CAF50", // Tuesday - Green
    "#FF9800", // Wednesday - Orange (Middle of week)
    "#9C27B0", // Thursday - Purple
    "#F44336", // Friday - Red (End of work week)
    "#00BCD4", // Saturday - Cyan (Weekend)
    "#FFC107", // Sunday - Yellow (Weekend)
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    setCurrentDayIndex((prev) => (prev + 1) % days.length);
  };

  const handlePrev = () => {
    setCurrentDayIndex((prev) => (prev - 1 + days.length) % days.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;

    // Determine if swipe is more horizontal or vertical
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(diffY) > 50) {
        if (diffY > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
  };

  const handleDayClick = (index: number) => {
    setCurrentDayIndex(index);
  };

  const getTransform = () => {
    if (isMobile) {
      return `translateX(-${currentDayIndex * 100}%)`;
    } else {
      return `translateY(-${currentDayIndex * 100}%)`;
    }
  };

  return (
    <div className="day-carousel-container">
      <div 
        className={`day-carousel ${isMobile ? 'mobile' : 'desktop'}`}
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {!isMobile && (
          <>
            <button className="nav-button prev" onClick={handlePrev}>
              ▲
            </button>
            <button className="nav-button next" onClick={handleNext}>
              ▼
            </button>
          </>
        )}
        
        <div 
          className="carousel-track"
          style={{ transform: getTransform() }}
        >
          {days.map((day, index) => (
            <div
              key={day.name}
              className={`carousel-slide ${index === currentDayIndex ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${day.background})`,
                backgroundColor: dayColors[index % dayColors.length],
              }}
            >
              <h2>{day.name}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="day-indicators">
        {days.map((day, index) => (
          <button
            key={day.name}
            className={`indicator ${index === currentDayIndex ? 'active' : ''}`}
            onClick={() => handleDayClick(index)}
            style={{
              backgroundColor: dayColors[index % dayColors.length],
            }}
            aria-label={`Go to ${day.name}`}
          />
        ))}
      </div>
    </div>
  );
};

export default VerticalDaysCarousel;