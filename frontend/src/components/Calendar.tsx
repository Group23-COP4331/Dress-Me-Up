//import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, getDay, subDays, addDays, addWeeks } from 'date-fns';
import axios from 'axios';
import { setDay } from 'date-fns';
import { useState } from 'react';
import { useEffect } from 'react';

interface Holiday {
  date: Date;
  name: string;
}

interface CalendarEvent {
  id: string;
  name: string;
  date: Date;
  frequency: 'daily' | 'weekly' | 'none';
}

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  //const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);

  const [modalEvent, setModalEvent] = useState({
    name: '',
    frequency: 'none' as 'daily' | 'weekly' | 'none',
    weekday: 0 as number,
    originalEvent: null as CalendarEvent | null,
    isEditMode: false
  });

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const year = currentMonth.getFullYear();
        const response = await axios.get(`https://date.nager.at/api/v3/publicholidays/${year}/US`);
        
        if (response.status === 200 && Array.isArray(response.data)) {
          const holidayData = response.data.map(holiday => ({
            date: new Date(holiday.date + 'T00:00:00'), // Create Date object
            name: holiday.name // Store holiday name
          }));
          setHolidays(holidayData);
        }
      } catch (error) {
        console.error('Error fetching holidays:', error);
      }
    };
  
    fetchHolidays();
  }, [currentMonth]);

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setShowSidePanel(true);
  };

  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

  const firstDayIndex = getDay(firstDayOfMonth);
  const prevMonthDays = Array.from({ length: firstDayIndex }).map((_, i) =>
    subDays(firstDayOfMonth, firstDayIndex - i)
  );

  let totalDays = [...prevMonthDays, ...daysInMonth];
  const totalRows = Math.ceil(totalDays.length / 7);
  const maxDaysNeeded = totalRows * 7;

  const nextMonthDays = Array.from({ length: maxDaysNeeded - totalDays.length }).map((_, i) =>
    addDays(lastDayOfMonth, i + 1)
  );

  const calendarDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getHoliday = (day: Date) => {
    return holidays.find(holiday => 
      format(holiday.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
  };

  const handleAddEventClick = () => {
    if (!selectedDate) return;
    setModalEvent({
      name: '',
      frequency: 'none',
      weekday: getDay(selectedDate), // Default to selected date's weekday
      originalEvent: null,
      isEditMode: false // Set to false for new events
    });
    setShowEventModal(true);
  };

  const handleAddEvent = () => {
    if (!selectedDate || !modalEvent.name.trim()) return;
    
    const newEvents: CalendarEvent[] = [];
    const baseDate = new Date(selectedDate);
    const eventId = Date.now().toString();
    
    if (modalEvent.frequency === 'none') {
      newEvents.push({
        id: eventId,
        name: modalEvent.name,
        date: baseDate,
        frequency: 'none'
      });
    } 
    else if (modalEvent.frequency === 'daily') {
      for (let i = 0; i < 365; i++) {
        newEvents.push({
          id: `${eventId}-${i}`,
          name: modalEvent.name,
          date: addDays(baseDate, i),
          frequency: 'daily'
        });
      }
    }
    else if (modalEvent.frequency === 'weekly') {
      for (let i = 0; i < 52; i++) { // Changed to 52 weeks (1 year)
        newEvents.push({
          id: `${eventId}-${i}`,
          name: modalEvent.name,
          date: addWeeks(baseDate, i),
          frequency: 'weekly'
        });
      }
    }
    
    setEvents([...events, ...newEvents]);
    setShowEventModal(false);
  };
  

  const getEventsForDate = (day: Date) => {
    return events.filter(event => 
      format(event.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setModalEvent({
      name: event.name,
      frequency: event.frequency,
      weekday: getDay(event.date), // Set the current weekday of the event
      originalEvent: event,
      isEditMode: true // Set to true for edit mode
    });
    setShowEventModal(true);
  };
  
  const handleUpdateEvent = () => {
    if (!modalEvent.originalEvent || !selectedDate) return;
    
    // First, remove all instances of the original event
    const updatedEvents = events.filter(e => {
      // For recurring events, match by original ID pattern
      if (modalEvent.originalEvent!.frequency !== 'none') {
        const baseId = modalEvent.originalEvent!.id.split('-')[0];
        return !e.id.startsWith(baseId);
      }
      // For single events, match exact ID
      return e.id !== modalEvent.originalEvent!.id;
    });
  
    // Then add new events based on the updated frequency
    const newEvents: CalendarEvent[] = [];
    const baseDate = modalEvent.originalEvent.date;
    const eventId = Date.now().toString();
  
    if (modalEvent.frequency === 'none') {
      // Single event - use the original date or selected date
      newEvents.push({
        id: eventId,
        name: modalEvent.name,
        date: baseDate,
        frequency: 'none'
      });
    } 
    else if (modalEvent.frequency === 'daily') {
      // Daily for 1 year
      for (let i = 0; i < 365; i++) {
        newEvents.push({
          id: `${eventId}-${i}`,
          name: modalEvent.name,
          date: addDays(baseDate, i),
          frequency: 'daily'
        });
      }
    }
    else if (modalEvent.frequency === 'weekly') {
      // Weekly for 1 year (52 weeks)
      for (let i = 0; i < 52; i++) {
        const eventDate = addWeeks(
          // Adjust to the correct weekday if needed
          modalEvent.isEditMode ? 
            setDay(baseDate, modalEvent.weekday) : 
            baseDate, 
          i
        );
        newEvents.push({
          id: `${eventId}-${i}`,
          name: modalEvent.name,
          date: eventDate,
          frequency: 'weekly'
        });
      }
    }
  
    // Combine the filtered events with new events
    setEvents([...updatedEvents, ...newEvents]);
    setShowEventModal(false);
  };

  const closeEventModal = () => {
    setShowEventModal(false);
    setModalEvent({
      name: '',
      frequency: 'none',
      weekday: 0,
      originalEvent: null,
      isEditMode: false
    });
  };

  const handleDeleteClick = (event: CalendarEvent) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };
  
  const handleDeleteEvent = (deleteAll: boolean) => {
    if (!eventToDelete) return;
    
    setEvents(events.filter(e => {
      if (deleteAll) {
        // For recurring events, match the pattern used in creation
        if (eventToDelete.frequency === 'daily') {
          const baseId = eventToDelete.id.split('-')[0];
          return !e.id.startsWith(baseId);
        }
        else if (eventToDelete.frequency === 'weekly') {
          const baseId = eventToDelete.id.split('-')[0];
          return !e.id.startsWith(baseId);
        }
        return e.id !== eventToDelete.id;
      }
      // Delete just this single occurrence
      return e.id !== eventToDelete.id;
    }));
    
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  // Update your calendar days rendering to show event indicators
  const calendarDaysRender = calendarDays.map((day) => {
    const holiday = getHoliday(day);
    const dayEvents = getEventsForDate(day);
    
    // Group events by frequency to show appropriate indicators
    const hasDailyEvent = dayEvents.some(e => e.frequency === 'daily');
    const hasWeeklyEvent = dayEvents.some(e => e.frequency === 'weekly');
    const hasSingleEvent = dayEvents.some(e => e.frequency === 'none');
  
    return (
      <button
        key={day.toISOString()}
        onClick={() => handleDayClick(day)}
        className={`
          relative border border-[#ccc] bg-[#eee]
          min-h-[100px] text-left
          ${!isSameMonth(day, currentMonth) ? 'text-[#ccc]' : ''}
          ${isSameDay(day, new Date()) ? '!bg-[#e1f7ef]' : ''}
        `}
      >
        <div className="absolute top-1 left-1 font-['Montserrat'] font-medium text-xl">
          {format(day, 'd')}
        </div>
        {holiday && (
          <div className="absolute bottom-2 right-2 w-3 h-3 bg-red-600 rounded-full"></div>
        )}
        <div className="absolute bottom-2 left-2 flex space-x-1">
          {hasSingleEvent && (
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          )}
          {hasWeeklyEvent && (
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
          )}
          {hasDailyEvent && (
            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
          )}
        </div>
      </button>
    );
  });

  return (
    <div className="flex flex-col items-end justify-end min-h-screen w-9/12 p-4 relative">
      <div className="w-full relative z-20">
        {/* Main container with overflow hidden */}
        <div className="relative overflow-hidden shadow-lg rounded-lg">
          {/* Calendar content that shifts left */}
          <div className={`transition-all duration-300 ease-in-out ${showSidePanel ? '-ml-[50%]' : ''}`}>
            {/* Month and Year Header */}
            <div className="bg-[#a8947c] text-white font-['Piazzolla'] p-2.5 text-center flex justify-between items-center w-full">
              <button 
                onClick={handlePrevMonth} 
                className="bg-none border-none text-white text-[30px] cursor-pointer hover:text-[#d3c0a9] p-2.5"
              >
                &lt;
              </button>
              <div className="text-xl md:text-2xl lg:text-3xl">
                {format(currentMonth, 'MMMM yyyy')}
              </div>
              <button 
                onClick={handleNextMonth} 
                className="bg-none border-none text-white text-[30px] cursor-pointer hover:text-[#d3c0a9] p-2.5"
              >
                &gt;
              </button>
            </div>

            {/* Weekday Header */}
            <div className="grid grid-cols-7 w-full text-xl">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <div 
                  key={day} 
                  className="bg-white text-[#666666] font-['Montserrat'] p-5 text-center"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 w-full">
              {calendarDaysRender}
            </div>
          </div>

          {/* Side Panel that slides out from within the calendar */}
          <div 
            className={`absolute top-0 right-0 w-1/2 h-full bg-[#a8947c] p-4 flex flex-col 
              transition-transform duration-300 ease-in-out
              ${showSidePanel ? 'translate-x-0' : 'translate-x-full'}`}
          >
            {selectedDate && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white text-2xl font-['Piazzolla']">
                    {format(selectedDate, 'EEEE, MMMM d')}
                  </h2>
                  <button 
                    onClick={() => setShowSidePanel(false)}
                    className="text-white text-2xl hover:text-[#d3c0a9]"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="flex-grow overflow-y-auto pr-2 pt-5">
                  <div className="space-y-2">
                    
                    <button 
                      className="w-full bg-[#9cb4d4] text-black text-2xl font-['Piazzolla'] py-2 px-4 rounded-xl hover:bg-[#8aa3c2] transition-colors mb-4 shadow-md"
                      onClick={handleAddEventClick}
                    >
                      Add Event
                    </button>
                    
                    {getHoliday(selectedDate) && (
                      <div className="p-2 bg-white text-amber-800 rounded shadow-md">
                        Holiday: {getHoliday(selectedDate)?.name}
                      </div>
                    )}
                    
                    {getEventsForDate(selectedDate).map(event => (
                      <div key={event.id} className="p-2 bg-blue-100 text-blue-800 rounded flex justify-between items-center">
                        <div>
                          Event: {event.name}
                          {event.frequency !== 'none' && (
                            <span className="text-xs ml-2">({event.frequency})</span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditEvent(event);
                            }}
                            className="px-2 py-1 bg-blue-200 text-blue-800 rounded hover:bg-blue-300 shadow-md" 
                          >
                            Edit
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(event);
                            }}
                            className="px-2 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300 shadow-md"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
              </>
            )}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {(showEventModal || modalEvent.originalEvent) && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-96">
      <h3 className="text-xl font-bold mb-4">
        {modalEvent.originalEvent ? 'Edit Event' : 'Add New Event'}
      </h3>
      
      <div className="mb-4">
        <label className="block mb-2">Event Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={modalEvent.name}
          onChange={(e) => setModalEvent({...modalEvent, name: e.target.value})}
          placeholder="Enter event name"
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">Frequency</label>
        <select
          className="w-full p-2 border rounded"
          value={modalEvent.frequency}
          onChange={(e) => setModalEvent({
            ...modalEvent, 
            frequency: e.target.value as 'daily' | 'weekly' | 'none'
          })}
        >
          <option value="none">No repeat</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      {modalEvent.frequency === 'weekly' && modalEvent.isEditMode && (
  <div className="mb-4">
    <label className="block mb-2">Day of Week</label>
    <select
      className="w-full p-2 border rounded"
      value={modalEvent.weekday}
      onChange={(e) => setModalEvent({
        ...modalEvent, 
        weekday: parseInt(e.target.value)
      })}
    >
      <option value={0}>Sunday</option>
      <option value={1}>Monday</option>
      <option value={2}>Tuesday</option>
      <option value={3}>Wednesday</option>
      <option value={4}>Thursday</option>
      <option value={5}>Friday</option>
      <option value={6}>Saturday</option>
    </select>
  </div>
)}
      
      <div className="flex justify-end space-x-2">
        <button
          className="px-4 py-2 bg-gray-300 rounded shadow-md"
          onClick={closeEventModal}  // Updated to use close function
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-[#a8947c] text-white rounded shadow-md"
          onClick={() => {
            if (modalEvent.originalEvent) {
              handleUpdateEvent();
            } else {
              handleAddEvent();
            }
            closeEventModal();  // Close after action
          }}
        >
          {modalEvent.originalEvent ? 'Update' : 'Add'} Event
        </button>
      </div>
    </div>
  </div>
)}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && eventToDelete && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-96">
      <h3 className="text-xl font-bold mb-4">Delete Event</h3>
      <p className="mb-4">Delete "{eventToDelete.name}"?</p>
      
      {eventToDelete.frequency !== 'none' ? (
        <div className="mb-4 space-y-2">
          <button
            className="w-full px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 shadow-md"
            onClick={() => handleDeleteEvent(false)}
          >
            Delete only this occurrence
          </button>
          <button
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 shadow-md"
            onClick={() => handleDeleteEvent(true)}
          >
            Delete all {eventToDelete.frequency} occurrences
          </button>
        </div>
      ) : (
        <button
          className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 shadow-md"
          onClick={() => handleDeleteEvent(false)}
        >
          Delete Event
        </button>
      )}
      
      <button
        className="w-full mt-2 px-4 py-2 bg-gray-300 rounded shadow-md"
        onClick={() => setShowDeleteModal(false)}
      >
        Cancel
      </button>
    </div>
  </div>
)}
    </div>
  );
}
