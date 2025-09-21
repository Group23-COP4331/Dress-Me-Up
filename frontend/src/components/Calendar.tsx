import React, { useState, useEffect } from 'react';

// Date utility functions to replace date-fns
const formatDate = (date: Date, format: string) => {
  const options: Intl.DateTimeFormatOptions = {};
  
  if (format === 'MMMM yyyy') {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
  if (format === 'EEEE, MMMM d') {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }
  if (format === 'd') {
    return date.getDate().toString();
  }
  if (format === 'yyyy-MM-dd') {
    return date.toISOString().split('T')[0];
  }
  
  return date.toLocaleDateString();
};

const startOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const eachDayOfInterval = (interval: { start: Date; end: Date }) => {
  const days = [];
  const start = new Date(interval.start);
  const end = new Date(interval.end);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  
  return days;
};

const isSameDay = (date1: Date, date2: Date) => {
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
};

const isSameMonth = (date1: Date, date2: Date) => {
  return date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
};

const getDay = (date: Date) => {
  return date.getDay();
};

const subDays = (date: Date, amount: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() - amount);
  return result;
};

const addDays = (date: Date, amount: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};

const addWeeks = (date: Date, amount: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + (amount * 7));
  return result;
};

const setDay = (date: Date, dayOfWeek: number) => {
  const result = new Date(date);
  const currentDay = result.getDay();
  const diff = dayOfWeek - currentDay;
  result.setDate(result.getDate() + diff);
  return result;
};

// Axios replacement for fetch
const fetchData = async (url: string) => {
  const response = await fetch(url);
  return {
    status: response.status,
    data: await response.json()
  };
};

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

interface ClothingItem {
  _id: string;
  file: string; // base64 encoded image
  name?: string;
  // other properties as needed
}

interface Outfit {
  _id: string;
  UserId: string;
  Name?: string; 
  WeatherCategory?: string; 
  Top?: ClothingItem;
  Bottom?: ClothingItem;
  Shoes?: ClothingItem;
}

interface DayOutfit {
  id: string;
  date: Date;
  outfitId: string;
  outfit: Outfit;
}

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);
  
  // New outfit-related state
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [dayOutfits, setDayOutfits] = useState<DayOutfit[]>([]);
  const [showOutfitModal, setShowOutfitModal] = useState(false);
  const [loadingOutfits, setLoadingOutfits] = useState(false);
  const [showOutfitDeleteModal, setShowOutfitDeleteModal] = useState(false);
  const [outfitToDelete, setOutfitToDelete] = useState<DayOutfit | null>(null);

  const [modalEvent, setModalEvent] = useState({
    name: '',
    frequency: 'none' as 'daily' | 'weekly' | 'none',
    weekday: 0 as number,
    originalEvent: null as CalendarEvent | null,
    isEditMode: false
  });

  // Fetch outfits from API
  const fetchOutfits = async () => {
    setLoadingOutfits(true);
    try {
      const storedUser = localStorage.getItem("user_data");
      const userId = storedUser ? JSON.parse(storedUser).id : null;
      const response = await fetchData(`http://localhost:5001/api/getOutfits?userId=${userId}`);
      if (response.status === 200) {
        setOutfits(response.data.results);
      }
    } catch (error) {
      console.error('Error fetching outfits:', error);
      // Mock data for demo purposes - remove this when you have real API
      setOutfits([
        { 
          _id: '1', 
          UserId: 'demo-user',
          Top: { _id: 't1', file: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', name: 'Blue Shirt' },
          Bottom: { _id: 'b1', file: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', name: 'Jeans' },
          Shoes: { _id: 's1', file: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', name: 'Sneakers' }
        },
        { 
          _id: '2', 
          UserId: 'demo-user',
          Top: { _id: 't2', file: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', name: 'Dress Shirt' },
          Bottom: { _id: 'b2', file: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', name: 'Dress Pants' },
          Shoes: { _id: 's2', file: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', name: 'Dress Shoes' }
        }
      ]);
    } finally {
      setLoadingOutfits(false);
    }
  };

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const year = currentMonth.getFullYear();
        const response = await fetchData(`https://date.nager.at/api/v3/publicholidays/${year}/US`);
        
        if (response.status === 200 && Array.isArray(response.data)) {
          const holidayData = response.data.map(holiday => ({
            date: new Date(holiday.date + 'T00:00:00'),
            name: holiday.name
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
      formatDate(holiday.date, 'yyyy-MM-dd') === formatDate(day, 'yyyy-MM-dd')
    );
  };

  const handleAddEventClick = () => {
    if (!selectedDate) return;
    setModalEvent({
      name: '',
      frequency: 'none',
      weekday: getDay(selectedDate),
      originalEvent: null,
      isEditMode: false
    });
    setShowEventModal(true);
  };

  // New outfit-related functions
  const handleAddOutfitClick = () => {
    if (!selectedDate) return;
    if (outfits.length === 0) {
      fetchOutfits();
    }
    setShowOutfitModal(true);
  };

  const handleSelectOutfit = (outfit: Outfit) => {
    if (!selectedDate) return;
    
    // Remove any existing outfit for this date
    const filteredOutfits = dayOutfits.filter(dayOutfit => 
      formatDate(dayOutfit.date, 'yyyy-MM-dd') !== formatDate(selectedDate, 'yyyy-MM-dd')
    );
    
    // Add new outfit selection
    const newDayOutfit: DayOutfit = {
      id: Date.now().toString(),
      date: new Date(selectedDate),
      outfitId: outfit._id,
      outfit: outfit
    };
    
    setDayOutfits([...filteredOutfits, newDayOutfit]);
    setShowOutfitModal(false);
  };

  const getOutfitForDate = (day: Date) => {
    return dayOutfits.find(dayOutfit => 
      formatDate(dayOutfit.date, 'yyyy-MM-dd') === formatDate(day, 'yyyy-MM-dd')
    );
  };

  const handleDeleteOutfitClick = (dayOutfit: DayOutfit) => {
    setOutfitToDelete(dayOutfit);
    setShowOutfitDeleteModal(true);
  };

  const handleDeleteOutfit = () => {
    if (!outfitToDelete) return;
    setDayOutfits(dayOutfits.filter(outfit => outfit.id !== outfitToDelete.id));
    setShowOutfitDeleteModal(false);
    setOutfitToDelete(null);
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
      for (let i = 0; i < 52; i++) {
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
      formatDate(event.date, 'yyyy-MM-dd') === formatDate(day, 'yyyy-MM-dd')
    );
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setModalEvent({
      name: event.name,
      frequency: event.frequency,
      weekday: getDay(event.date),
      originalEvent: event,
      isEditMode: true
    });
    setShowEventModal(true);
  };
  
  const handleUpdateEvent = () => {
    if (!modalEvent.originalEvent || !selectedDate) return;
    
    const updatedEvents = events.filter(e => {
      if (modalEvent.originalEvent!.frequency !== 'none') {
        const baseId = modalEvent.originalEvent!.id.split('-')[0];
        return !e.id.startsWith(baseId);
      }
      return e.id !== modalEvent.originalEvent!.id;
    });
  
    const newEvents: CalendarEvent[] = [];
    const baseDate = modalEvent.originalEvent.date;
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
      for (let i = 0; i < 52; i++) {
        const eventDate = addWeeks(
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
      return e.id !== eventToDelete.id;
    }));
    
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  const calendarDaysRender = calendarDays.map((day) => {
    const holiday = getHoliday(day);
    const dayEvents = getEventsForDate(day);
    const dayOutfit = getOutfitForDate(day);
    
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
          {formatDate(day, 'd')}
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
          {dayOutfit && (
            <div className="w-3 h-3 bg-pink-600 rounded-full"></div>
          )}
        </div>
      </button>
    );
  });

  return (
    <div className="flex flex-col items-end justify-end w-10/12 p-4 relative">
      <div className="w-full relative z-20">
        <div className="relative overflow-hidden shadow-lg rounded-lg w-[900px]">
          <div className={`transition-all duration-300 ease-in-out ${showSidePanel ? '-ml-[50%]' : ''}`}>
            <div className="bg-[#a8947c] text-white font-['Piazzolla'] p-2.5 text-center flex justify-between items-center w-full">
              <button 
                onClick={handlePrevMonth} 
                className="bg-none border-none text-white text-[30px] cursor-pointer hover:text-[#d3c0a9] p-2.5"
              >
                &lt;
              </button>
              <div className="text-xl md:text-2xl lg:text-3xl">
                {formatDate(currentMonth, 'MMMM yyyy')}
              </div>
              <button 
                onClick={handleNextMonth} 
                className="bg-none border-none text-white text-[30px] cursor-pointer hover:text-[#d3c0a9] p-2.5"
              >
                &gt;
              </button>
            </div>

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

            <div className="grid grid-cols-7 w-full">
              {calendarDaysRender}
            </div>
          </div>

          <div 
            className={`absolute top-0 right-0 w-1/2 h-full bg-[#a8947c] p-4 flex flex-col 
              transition-transform duration-300 ease-in-out
              ${showSidePanel ? 'translate-x-0' : 'translate-x-full'}`}
          >
            {selectedDate && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white text-2xl font-['Piazzolla']">
                    {formatDate(selectedDate, 'EEEE, MMMM d')}
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
                      className="w-full bg-[#9cb4d4] text-black text-2xl font-['Piazzolla'] py-2 px-4 rounded-xl hover:bg-[#8aa3c2] transition-colors mb-2 shadow-md"
                      onClick={handleAddEventClick}
                    >
                      Add Event
                    </button>

                    <button 
                      className="w-full bg-[#d49cb4] text-black text-2xl font-['Piazzolla'] py-2 px-4 rounded-xl hover:bg-[#c28aa3] transition-colors mb-4 shadow-md"
                      onClick={handleAddOutfitClick}
                    >
                      Add Outfit
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

                    {getOutfitForDate(selectedDate) && (
                      <div className="p-4 bg-pink-100 text-pink-800 rounded shadow-md">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="flex flex-col items-center space-y-2 flex-1">
                            <div className="font-semibold">Selected Outfit: {getOutfitForDate(selectedDate)?.outfit.Name} </div>
                            <div className="font-semibold">Weather: {getOutfitForDate(selectedDate)?.outfit.WeatherCategory} </div>
                            <div className="flex space-x-2">
                              {getOutfitForDate(selectedDate)?.outfit.Top && (
                                <div className="flex flex-col items-center">
                                  <img 
                                    src={`data:image/jpeg;base64,${getOutfitForDate(selectedDate)?.outfit.Top.file}`}
                                    alt="Top"
                                    className="w-12 h-12 rounded object-cover"
                                  />
                                  <span className="text-xs mt-1">Top</span>
                                </div>
                              )}
                              {getOutfitForDate(selectedDate)?.outfit.Bottom && (
                                <div className="flex flex-col items-center">
                                  <img 
                                    src={`data:image/jpeg;base64,${getOutfitForDate(selectedDate)?.outfit.Bottom.file}`}
                                    alt="Bottom"
                                    className="w-12 h-12 rounded object-cover"
                                  />
                                  <span className="text-xs mt-1">Bottom</span>
                                </div>
                              )}
                              {getOutfitForDate(selectedDate)?.outfit.Shoes && (
                                <div className="flex flex-col items-center">
                                  <img 
                                    src={`data:image/jpeg;base64,${getOutfitForDate(selectedDate)?.outfit.Shoes.file}`}
                                    alt="Shoes"
                                    className="w-12 h-12 rounded object-cover"
                                  />
                                  <span className="text-xs mt-1">Shoes</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const dayOutfit = getOutfitForDate(selectedDate);
                              if (dayOutfit) handleDeleteOutfitClick(dayOutfit);
                            }}
                            className="px-2 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300 shadow-md ml-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                    
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
                onClick={closeEventModal}
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
                  closeEventModal();
                }}
              >
                {modalEvent.originalEvent ? 'Update' : 'Add'} Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Outfit Selection Modal */}
      {showOutfitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Select an Outfit</h3>
              <button 
                onClick={() => setShowOutfitModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            
            {loadingOutfits ? (
              <div className="text-center py-8">Loading outfits...</div>
            ) : outfits.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No outfits available</div>
            ) : (
              <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                {outfits.map(outfit => (
                  <div 
                    key={outfit._id}
                    onClick={() => handleSelectOutfit(outfit)}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-2">
                        {outfit.Top && (
                          <div className="flex flex-col items-center">
                            <img 
                              src={`data:image/jpeg;base64,${outfit.Top.file}`}
                              alt="Top"
                              className="w-16 h-16 object-cover rounded"
                            />
                            <span className="text-xs text-gray-600 mt-1">Top</span>
                          </div>
                        )}
                        {outfit.Bottom && (
                          <div className="flex flex-col items-center">
                            <img 
                              src={`data:image/jpeg;base64,${outfit.Bottom.file}`}
                              alt="Bottom"
                              className="w-16 h-16 object-cover rounded"
                            />
                            <span className="text-xs text-gray-600 mt-1">Bottom</span>
                          </div>
                        )}
                        {outfit.Shoes && (
                          <div className="flex flex-col items-center">
                            <img 
                              src={`data:image/jpeg;base64,${outfit.Shoes.file}`}
                              alt="Shoes"
                              className="w-16 h-16 object-cover rounded"
                            />
                            <span className="text-xs text-gray-600 mt-1">Shoes</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          Outfit: {outfit.Name}
                        </h4>
                           <h4 className="font-semibold">
                           Weather: {outfit.WeatherCategory}
                        </h4>
                        <div className="text-sm text-gray-600 mt-1">
                          {[
                            outfit.Top?.name,
                            outfit.Bottom?.name, 
                            outfit.Shoes?.name
                          ].filter(Boolean).join(' • ')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Event Delete Confirmation Modal */}
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

      {/* Outfit Delete Confirmation Modal */}
      {showOutfitDeleteModal && outfitToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Remove Outfit</h3>
            <p className="mb-4">Remove this outfit from {formatDate(outfitToDelete.date, 'EEEE, MMMM d')}?</p>
            
            <div className="flex space-x-2">
              <button
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 shadow-md"
                onClick={handleDeleteOutfit}
              >
                Remove
              </button>
              <button
                className="flex-1 px-4 py-2 bg-gray-300 rounded shadow-md"
                onClick={() => setShowOutfitDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}