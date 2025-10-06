import React, { useRef, useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

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

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop: Mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (isMobile) return;
    
    e.preventDefault();
    if (e.deltaY > 0) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  // Mobile: Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchStartX.current - touchEndX;
    const deltaY = touchStartY.current - touchEndY;
    
    // Determine if swipe was horizontal or vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 50) {
        handleNext();
      } else if (deltaX < -50) {
        handlePrev();
      }
    }
  };

  const handleNext = () => {
    setCurrentMonthIndex((prev) => (prev + 1) % months.length);
  };

  const handlePrev = () => {
    setCurrentMonthIndex((prev) => (prev - 1 + months.length) % months.length);
  };

  const handleMonthClick = (index: number) => {
    setCurrentMonthIndex(index);
  };

  return (
    <div className="month-carousel-container">
      <div
        className={`month-carousel ${isMobile ? 'mobile' : 'desktop'}`}
        ref={carouselRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="carousel-track"
          style={{
            transform: isMobile 
              ? `translateX(-${currentMonthIndex * 100}%)`
              : `translateY(-${currentMonthIndex * 100}%)`
          }}
        >
          {months.map((month, index) => (
            <div
              key={month.name}
              className={`carousel-slide ${index === currentMonthIndex ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${month.background})`,
                backgroundColor: monthColors[index % monthColors.length],
              }}
              onClick={() => handleMonthClick(index)}
            >
              <h2>{month.name}</h2>
            </div>
          ))}
        </div>

        {/* Desktop Navigation Buttons */}
        {!isMobile && (
          <>
            <button 
              className="nav-button prev"
              onClick={handlePrev}
              aria-label="Previous month"
            >
              ▲
            </button>
            <button 
              className="nav-button next"
              onClick={handleNext}
              aria-label="Next month"
            >
              ▼
            </button>
          </>
        )}
      </div>

      {/* Month Indicators */}
      <div className="month-indicators">
        {months.map((month, index) => (
          <button
            key={index}
            className={`indicator ${index === currentMonthIndex ? 'active' : ''}`}
            onClick={() => handleMonthClick(index)}
            aria-label={month.name}
            style={{
              backgroundColor: index === currentMonthIndex 
                ? monthColors[index % monthColors.length] 
                : 'rgba(0, 0, 0, 0.3)'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default VerticalCarousel;