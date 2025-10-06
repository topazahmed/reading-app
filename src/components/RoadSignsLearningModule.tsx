import React, { useState, useEffect } from "react";
import "./RoadSignsLearningModule.scss";

interface RoadSign {
  name: string;
  image: string;
}

// Load road signs from the public images folder
const roadSigns: RoadSign[] = [
  { name: "Warning for the end of a divided road", image: "/images/road-signs/Warning-for-the-end-of-a-divided-road.png" },
  { name: "Warning for an obstacle, pass either side", image: "/images/road-signs/Warning-for-an-obstacle,-pass-either-side.png" },
  { name: "Warning for equestrians", image: "/images/road-signs/Warning-for-equestrians.png" },
  { name: "Warning for a crossroad, give way to all drivers", image: "/images/road-signs/Warning-for-a-crossroad,-give-way-to-all-drivers.png" },
  { name: "Warning for an uncontrolled crossroad with a road from the left", image: "/images/road-signs/Warning-for-an-uncontrolled-crossroad-with-a-road-from-the-left.png" },
  { name: "Uncontrolled crossroad ahead", image: "/images/road-signs/Uncontrolled-crossroad-ahead.png" },
  { name: "Warning for an uncontrolled T-crossroad", image: "/images/road-signs/Warning-for-an-uncontrolled-T-crossroad.png" },
  { name: "Warning for a sharp curve to the left", image: "/images/road-signs/Warning-for-a-sharp-curve-to-the-left.png" },
  { name: "Warning for a sharp curve to the right", image: "/images/road-signs/Warning-for-a-sharp-curve-to-the-right.png" },
  { name: "Road gets narrow on the right side", image: "/images/road-signs/Road-gets-narrow-on-the-right-side.png" },
  { name: "Heavy crosswinds in area warning", image: "/images/road-signs/Heavy-crosswinds-in-area-warning.png" },
  { name: "Rail crossing without barriers ahead", image: "/images/road-signs/Rail-crossing-without-barriers-ahead.png" },
  { name: "Road narrows on the left", image: "/images/road-signs/Road-narrows-on-the-left.png" },
  { name: "Road bends to the right", image: "/images/road-signs/Road-bends-to-the-right.png" },
  { name: "Steep descent ahead", image: "/images/road-signs/Steep-descent-ahead.png" },
  { name: "Warning for a side road merging with the main road", image: "/images/road-signs/Warning-for-a-side-road-merging-with-the-main-road.png" },
  { name: "Warning for sharp curves, first right then left", image: "/images/road-signs/Warning-for-sharp-curves,-first-right-then-left.png" },
  { name: "Road bends right then left", image: "/images/road-signs/Road-bends-right-then-left.png" },
  { name: "Roundabout ahead", image: "/images/road-signs/Roundabaout-ahead.png" },
  { name: "Warning for a narrowing", image: "/images/road-signs/Warning-for-a-narrowing.png" },
  { name: "Warning for a double sharp curve, first left then right", image: "/images/road-signs/Warning-for-a-double-sharp-curve,-first-left-then-right.png" },
  { name: "Warning for an obstacle, pass left or right", image: "/images/road-signs/Warning-for-an-obstacle,-pass-left-or-right.png" },
  { name: "Warning for children and minors", image: "/images/road-signs/Warning-for-children-and-minors.png" },
  { name: "Warning for a speed limit ahead", image: "/images/road-signs/Warning-for-a-speed-limit-ahead.png" },
  { name: "Warning for an uncontrolled crossroad with a road from the right", image: "/images/road-signs/Warning-for-an-uncontrolled-crossroad-with-a-road-from-the-right.png" },
  { name: "Cattle crossing", image: "/images/road-signs/Cattle-crossing.png" },
  { name: "Warning U-turn", image: "/images/road-signs/Warning-U-turn.png" },
  { name: "Warning for skiers", image: "/images/road-signs/Warning-for-skiers.png" },
  { name: "Double curve ahead, to the left then to the right", image: "/images/road-signs/Double-curve-ahead,-to-the-left-then-to-the-right.png" },
  { name: "Give way ahead", image: "/images/road-signs/Give-way-ahead.png" },
  { name: "Traffic light ahead", image: "/images/road-signs/Traffic-light-ahead.png" },
  { name: "Two-way traffic ahead", image: "/images/road-signs/Two-way-traffic-ahead.png" },
  { name: "Give way to all traffic", image: "/images/road-signs/Give-way-to-all-traffic.png" },
  { name: "Warning for a playground", image: "/images/road-signs/Warning-for-a-playground.png" },
  { name: "Warning for an uncontrolled Y-crossroad", image: "/images/road-signs/Warning-for-an-uncontrolled-Y-crossroad.png" },
  { name: "Road narrows ahead", image: "/images/road-signs/road-narrows-ahead.png" },
  { name: "Warning for pedestrians", image: "/images/road-signs/Warning-for-pedestrians.png" },
  { name: "Warning for two roads that merge", image: "/images/road-signs/Warning-for-two-roads-that-merge.png" },
  { name: "Warning for a U-turn", image: "/images/road-signs/Warning-for-a-U-turn.png" },
  { name: "Deer crossing in area - road", image: "/images/road-signs/Deer-crossing-in-area---road.png" },
  { name: "Rail crossing ahead with 1 railway", image: "/images/road-signs/Rail-crossing-ahead-with-1-railway.png" },
  { name: "Stop and give way to all traffic", image: "/images/road-signs/Stop-and-give-way-to-all-traffic.png" },
  { name: "Warning for a divided road", image: "/images/road-signs/Warning-for-a-divided-road.png" },
  { name: "Warning Stop and give way ahead", image: "/images/road-signs/Warning-Stop-and-give-way-ahead.png" },
  { name: "Warning for moose on the road", image: "/images/road-signs/Warning-for-moose-on-the-road.png" },
  { name: "Warning for reindeer on the road", image: "/images/road-signs/Warning-for-reindeer-on-the-road.png" },
  { name: "Road ahead curves to the left side", image: "/images/road-signs/Road-ahead-curves-to-the-left-side.png" },
  { name: "Warning for curves", image: "/images/road-signs/Warning-for-curves.png" },
  { name: "Warning for a limited height", image: "/images/road-signs/Warning-for-a-limited-height.png" },
  { name: "Begin of a new lane", image: "/images/road-signs/Begin-of-a-new-lane.png" },
  { name: "Information about the directions of the roundabout", image: "/images/road-signs/Information-about-the-directions-of-the-roundabout.png" },
  { name: "Parking permitted", image: "/images/road-signs/Parking-permitted.png" },
  { name: "One-way traffic", image: "/images/road-signs/One-way-traffic.png" },
  { name: "Section control", image: "/images/road-signs/Section-control.png" },
  { name: "Information about the next exit", image: "/images/road-signs/Information-about-the-next-exit.png" },
  { name: "Lane usage and direction overview", image: "/images/road-signs/Lane-usage-and-direction-overview.png" },
  { name: "Place where you can make an emergency stop", image: "/images/road-signs/Place-where-you-can-make-an-emergency-stop.png" },
  { name: "Begin of a tunnel", image: "/images/road-signs/Begin-of-a-tunnel.png" },
  { name: "Cyclist must use mandatory path", image: "/images/road-signs/Cyclist-must-use-mandatory-path.png" },
  { name: "Mandatory shared path for pedestrians and cyclists", image: "/images/road-signs/Mandatory-shared-path-for-pedestrians-and-cyclists.png" },
  { name: "Driving faster than indicated compulsory (minimum speed)", image: "/images/road-signs/Driving-faster-than-indicated-compulsory-(minimum-speed).png" },
  { name: "Turning right compulsory", image: "/images/road-signs/Turning-right-compulsory.png" },
  { name: "Left turn mandatory", image: "/images/road-signs/Left-turn-mandatory.png" },
  { name: "Pass on right only", image: "/images/road-signs/Pass-on-right-only.png" },
  { name: "Driving straight ahead or turning right mandatory", image: "/images/road-signs/Driving-straight-ahead-or-turning-right-mandatory.png" },
  { name: "Mandatory lane for trucks", image: "/images/road-signs/Mandatory-lane-for-trucks.png" },
  { name: "Driving straight ahead or turning left mandatory", image: "/images/road-signs/Driving-straight-ahead-or-turning-left-mandatory.png" },
  { name: "Mandatory path for mopeds", image: "/images/road-signs/Mandatory-path-for-mopeds.png" },
  { name: "Path for cyclists and pedestrians divided is compulsory", image: "/images/road-signs/Path-for-cyclists-and-pedestrians-divided-is-compulsory.png" },
  { name: "Passing left compulsory", image: "/images/road-signs/Passing-left-compulsory.png" },
  { name: "Ahead Only", image: "/images/road-signs/Ahead-Only.png" },
  { name: "Mandatory path for snowmobiles", image: "/images/road-signs/Mandatory-path-for-snowmobiles.png" },
  { name: "Mandatory lane for vehicles with dangerous goods", image: "/images/road-signs/Mandatory-lane-for-vehicles-with-dangerous-goods.png" },
  { name: "Turning left or right mandatory", image: "/images/road-signs/Turning-left-or-right-mandatory.png" },
  { name: "Vehicles with dangerous goods prohibited", image: "/images/road-signs/Vehicles-with-dangerous-goods-prohibited.png" },
  { name: "Turning left prohibited", image: "/images/road-signs/Turning-left-prohibited.png" },
  { name: "Driving straight ahead prohibited", image: "/images/road-signs/Driving-straight-ahead-prohibited.png" },
  { name: "Pedestrians not permitted", image: "/images/road-signs/Pedestrians-not-permitted.png" },
  { name: "Mopeds prohibited", image: "/images/road-signs/Mopeds-prohibited.png" },
  { name: "Cyclists not permitted", image: "/images/road-signs/Cyclists-not-permitted.png" },
  { name: "Skaters prohibited", image: "/images/road-signs/Skaters-prohibited.png" },
  { name: "Turning right prohibited", image: "/images/road-signs/Turning-right-prohibited.png" },
  { name: "Snowmobiles prohibited", image: "/images/road-signs/Snowmobiles-prohibited.png" },
  { name: "Give way to oncoming traffic, road narrows", image: "/images/road-signs/Give-way-to-oncoming-traffic,-road-narrows.png" },
  { name: "Motorbikes - Motorcycles prohibited", image: "/images/road-signs/Motorbikes---Motorcycles-prohibited.png" },
  { name: "Quads prohibited", image: "/images/road-signs/Quads-prohibited.png" },
  { name: "Overtaking not allowed", image: "/images/road-signs/Overtaking-not-allowed.png" },
  { name: "Buses prohibited", image: "/images/road-signs/Buses-prohibited.png" },
  { name: "No turning / u-turn allowed", image: "/images/road-signs/No-turning-_-u-turn-allowed.png" },
  { name: "Skiers prohibited", image: "/images/road-signs/Skiers-prohibited.png" },
  { name: "No parking", image: "/images/road-signs/No-parking.png" },
  { name: "Lorries - Trucks forbidden", image: "/images/road-signs/Lorries---Trucks-forbidden.png" },
  { name: "Motorcycles and cars prohibited", image: "/images/road-signs/Motorcycles-and-cars-prohibited.png" },
  { name: "Vehicles - Cars prohibited", image: "/images/road-signs/Vehicles---Cars-prohibited.png" },
  { name: "Trailers prohibited", image: "/images/road-signs/Trailers-prohibited.png" },
  { name: "Speed limit", image: "/images/road-signs/Speed-limit.png" },
];

const RoadSignsLearningModule: React.FC = () => {
  const [currentSign, setCurrentSign] = useState<RoadSign>(roadSigns[0]);

  const getRandomSign = () => {
    const randomIndex = Math.floor(Math.random() * roadSigns.length);
    setCurrentSign(roadSigns[randomIndex]);
  };

  const speakSignName = (name: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(name);
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      
      // Auto-refresh after 2 seconds
      utterance.onend = () => {
        setTimeout(() => {
          getRandomSign();
        }, 2000);
      };
    }
  };

  // Initialize with a random sign on mount
  useEffect(() => {
    getRandomSign();
  }, []);

  return (
    <div className="road-signs-learning-module">
      <div className="road-signs-content">
        <div className="road-sign-card">
          <div className="road-sign-image-container">
            <img 
              src={currentSign.image} 
              alt={currentSign.name}
              className="road-sign-image"
              onError={(e) => {
                // Fallback to a colored placeholder if image fails
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 10px; color: white; font-size: 1.2rem; font-weight: bold; text-align: center; padding: 20px;">${currentSign.name}</div>`;
                }
              }}
            />
          </div>

          <button 
            className="road-sign-name-button"
            onClick={() => speakSignName(currentSign.name)}
          >
            {currentSign.name}
          </button>
        </div>
      </div>

      <div className="new-sign-section">
        <button
          className="new-sign-button"
          onClick={getRandomSign}
        >
          🔄 Show New Sign! 🚸
        </button>
      </div>
    </div>
  );
};

export default RoadSignsLearningModule;
