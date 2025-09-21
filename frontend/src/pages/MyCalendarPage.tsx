//import React from 'react';
import Calendar from '../components/Calendar.tsx';
import Navbar from '../components/Navbar.tsx';
import WeatherBox from '../components/WeatherBox.tsx';
import { useEffect } from 'react';

export default function MyCalendar() {

  // Removes default padding and width upon rendering
  useEffect(() => {
    document.getElementById("root")?.classList.add("dashboard");

    return () => {
      document.getElementById("root")?.classList.remove("dashboard");
    };
  }, []);

  return (
    <div className="min-h-screen w-full p-0 m-0 relative overflow-hidden">
      {/* Navbar fixed at the top with high z-index */}
      <Navbar />

      <div className="relative min-h-screen w-screen m-0 p-0 overflow-x-hidden flex justify-center items-center ">
        {/* Flex container for Calendar and Weather */}
        <div className="flex flex-row items-center justify-center gap-8 w-full max-w-7xl">
          {/* Calendar on the left */}
          <div className="flex-1">
            <Calendar />
          </div>

          {/* WeatherBox on the right */}
          <div className="flex-1 max-w-md">
            <WeatherBox />
          </div>
        </div>
      </div>
    </div>
  );
}
