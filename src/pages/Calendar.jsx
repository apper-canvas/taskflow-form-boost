import { motion } from 'framer-motion';
import { useState } from 'react';
import { getIcon } from '../utils/iconUtils';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState('August 2023');
  
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const ChevronRightIcon = getIcon('ChevronRight');
  const PlusIcon = getIcon('Plus');
  
  // Mock data for calendar events
  const events = [
    { id: 1, title: 'Team Meeting', date: '2023-08-10', time: '10:00 AM', type: 'meeting' },
    { id: 2, title: 'Project Deadline', date: '2023-08-15', time: 'All day', type: 'deadline' },
    { id: 3, title: 'Client Presentation', date: '2023-08-17', time: '2:00 PM', type: 'presentation' },
    { id: 4, title: 'Product Launch', date: '2023-08-22', time: '9:00 AM', type: 'event' },
    { id: 5, title: 'Budget Review', date: '2023-08-28', time: '11:30 AM', type: 'meeting' }
  ];

  // Generate calendar days
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Mock calendar grid data (for demo purposes)
  const calendarGrid = [
    [null, null, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, null, null]
  ];
  
  const getEventForDay = (day) => {
    if (!day) return null;
    const date = `2023-08-${day.toString().padStart(2, '0')}`;
    return events.find(event => event.date === date);
  };
  
  const getEventClass = (type) => {
    switch(type) {
      case 'meeting': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'deadline': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'presentation': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'event': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <button className="btn-primary flex items-center">
          <PlusIcon size={18} className="mr-2" />
          Add Event
        </button>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <button className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
            <ChevronLeftIcon size={24} />
          </button>
          <h2 className="text-2xl font-semibold">{currentMonth}</h2>
          <button className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
            <ChevronRightIcon size={24} />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map(day => (
            <div key={day} className="p-2 text-center font-medium text-sm text-surface-500">
              {day}
            </div>
          ))}
          
          {calendarGrid.flat().map((day, index) => (
            <div 
              key={index} 
              className={`h-28 p-1 border border-surface-200 dark:border-surface-700 rounded-lg ${
                day ? 'bg-white/50 dark:bg-surface-800/50' : 'bg-surface-100/30 dark:bg-surface-700/30'
              } transition-colors hover:bg-surface-100 dark:hover:bg-surface-700/70`}
            >
              {day && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium p-1">{day}</span>
                    {day === 10 && (
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                    )}
                  </div>
                  {getEventForDay(day) && (
                    <div className={`mt-1 p-1 text-xs rounded ${getEventClass(getEventForDay(day).type)}`}>
                      {getEventForDay(day).title}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {events.map(event => (
            <div key={event.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700/50 transition-colors">
              <div>
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-surface-500">{event.date} at {event.time}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getEventClass(event.type)}`}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Calendar;