import React from 'react';
import Calendar from '../components/Calendar.tsx';
import shrub from "../assets/shrub.png";
import Navbar from '../components/Navbar.tsx';

export default function MyCalendar() {
  return (
    <div className="min-h-screen w-full p-0 m-0 relative">
      {/* Navbar fixed at the top with high z-index */}
      <Navbar className="fixed top-0 left-0 w-full z-30" />
      
      <div className="relative min-h-screen w-screen m-0 p-0 overflow-x-hidden">
        {/* Logo (absolute position outside the flow) */}
        
        {/* Shrub overlay - properly centered */}
        <img 
          src={shrub} 
          alt="Decorative shrub" 
          className="fixed top-0 left-1/2 w-2/4 max-w-[1250px] -translate-x-1/2 z-10 pointer-events-none"
          style={{
            transform: 'translateY(-5%) translateX(-50%)',
            mixBlendMode: 'multiply'
          }}
        />
        
        {/* Calendar component with forced left alignment */}
        <div className="relative z-20 w-full max-w-7xl mx-auto pt-32 -translate-y-60 -translate-x-20">
          <Calendar />
        </div>
      </div>
    </div>
  );
}
