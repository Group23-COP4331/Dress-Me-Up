//import React from 'react';
import Calendar from '../components/Calendar.tsx';
import shrub from "../assets/shrub.png";
import Navbar from '../components/Navbar.tsx';
import WeatherBox from '../components/WeatherBox.tsx';
import { useEffect } from 'react';

export default function MyCalendar() {

// Removes default padding and width opon rendering
  useEffect(() => {
      document.getElementById("root")?.classList.add("dashboard");
  
      return () => {
          document.getElementById("root")?.classList.remove("dashboard");
      };
  }, []);


  return (
    <div className="min-h-screen w-full p-0 m-0 relative overflow-hidden">
      {/* Navbar fixed at the top with high z-index */}
      <Navbar/>
      
      <div className="relative min-h-screen w-screen m-0 p-0 overflow-x-hidden">
        {/* Logo (absolute position outside the flow) */}
        
        {/* Shrub overlay - properly centered */}
        
        {/* Calendar component with forced left alignment */}
        <div className="relative z-20 w-full max-w-7xl mx-auto pt-32 -translate-y-60 flex items-start gap-8">
    {/* Calendar on the left */}
    <div className="w-2/3">
      <Calendar />
    </div>

    {/* WeatherBox on the right */}
    <div className="w-1/3 translate-y-36 scale-[0.75] translate-x-20">
      <WeatherBox />
    </div>
  </div>
        </div>
      </div>
  );
}
