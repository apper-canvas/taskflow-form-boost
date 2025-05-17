import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, getDate, isSameMonth, isSameDay, addMonths, subMonths, addDays } from 'date-fns';
import { getIcon } from '../utils/iconUtils';
import { fetchCalendarEvents, createCalendarEvent } from '../services/calendarEventService';
import { fetchProjects } from '../services/projectService';
import { fetchTasks } from '../services/taskService';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    allDay: false,
    attendees: [],
    projectId: '',
    taskId: ''
  });
  const [selectedAttendee, setSelectedAttendee] = useState('');

  // Get icons
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const ChevronRightIcon = getIcon('ChevronRight');
  const PlusIcon = getIcon('Plus');
  const LoaderIcon = getIcon('Loader');
  const XIcon = getIcon('X');
  const UserCheckIcon = getIcon('UserCheck');
  const ClockIcon = getIcon('Clock');
  const CheckIcon = getIcon('Check');
  const CalendarIcon = getIcon('Calendar');

  // Handle date navigation
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Fetch calendar data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Calculate date range for current month view (including days from previous/next months that are shown)
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const calendarStart = startOfWeek(monthStart);
        const calendarEnd = endOfWeek(monthEnd);
        
        // Fetch events for the visible calendar range
        const eventsData = await fetchCalendarEvents(calendarStart, calendarEnd);
        setEvents(eventsData);
        
        // Also fetch projects and tasks for the event creation form
        const projectsData = await fetchProjects();
        setProjects(projectsData);
        
        const tasksData = await fetchTasks();
        setTasks(tasksData);
        
      } catch (error) {
        toast.error("Failed to load calendar data: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentDate]);

  // Generate days for calendar view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Handle day selection
  const handleDayClick = (day) => {
    setSelectedDate(day);
    
    // Create a new event for this day
    const formattedDate = format(day, 'yyyy-MM-dd');
    setEventForm({
      title: '',
      description: '',
      start: `${formattedDate}T09:00`,
      end: `${formattedDate}T10:00`,
      allDay: false,
      attendees: [],
      projectId: '',
      taskId: ''
    });
    
    setIsEventModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventForm({
      ...eventForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle attendee management
  const handleAttendeeAdd = () => {
    if (selectedAttendee && !eventForm.attendees.includes(selectedAttendee)) {
      setEventForm({
        ...eventForm,
        attendees: [...eventForm.attendees, selectedAttendee]
      });
      setSelectedAttendee('');
    }
  };

  const handleAttendeeRemove = (attendee) => {
    setEventForm({
      ...eventForm,
      attendees: eventForm.attendees.filter(a => a !== attendee)
    });
  };

  // Handle event creation
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createCalendarEvent(eventForm);
      toast.success("Event created successfully");
      
      // Reload events
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const calendarStart = startOfWeek(monthStart);
      const calendarEnd = endOfWeek(monthEnd);
      const eventsData = await fetchCalendarEvents(calendarStart, calendarEnd);
      setEvents(eventsData);
      
      // Close modal
      setIsEventModalOpen(false);
    } catch (error) {
      toast.error("Failed to create event: " + error.message);
    }
  };

  // Get events for a specific day
  const getEventsForDay = (day) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, day);
    });
  };

  // If loading, show spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderIcon className="animate-spin h-12 w-12 text-primary" />
        <p className="ml-2 text-xl">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-lg bg-white/30 dark:bg-surface-800/30 backdrop-blur-sm hover:bg-white/40 dark:hover:bg-surface-700/40"
          >
            <ChevronLeftIcon size={20} />
          </button>
          <button 
            onClick={goToToday}
            className="px-4 py-2 rounded-lg bg-white/30 dark:bg-surface-800/30 backdrop-blur-sm hover:bg-white/40 dark:hover:bg-surface-700/40"
          >
            Today
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-lg bg-white/30 dark:bg-surface-800/30 backdrop-blur-sm hover:bg-white/40 dark:hover:bg-surface-700/40"
          >
            <ChevronRightIcon size={20} />
          </button>
          <div className="text-xl font-semibold ml-4">{format(currentDate, 'MMMM yyyy')}</div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white/30 dark:bg-surface-800/30 backdrop-blur-sm rounded-xl shadow-float border border-white/30 dark:border-surface-700/30 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-white/20 dark:border-surface-700/20">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div 
              key={day} 
              className="py-3 text-center font-medium bg-white/20 dark:bg-surface-700/20"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, i) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div 
                key={i} 
                className={`min-h-[120px] p-2 border-b border-r border-white/10 dark:border-surface-700/10 relative ${
                  isCurrentMonth ? 'bg-transparent' : 'bg-surface-200/30 dark:bg-surface-800/30'
                }`}
                onClick={() => handleDayClick(day)}
              >
                <div className={`flex justify-between items-center ${
                  isToday && 'font-bold text-primary'
                }`}>
                  <span className={`${
                    isToday 
                      ? 'bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center'
                      : ''
                  }`}>
                    {getDate(day)}
                  </span>
                  
                  {dayEvents.length > 0 && (
                    <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">
                      {dayEvents.length}
                    </span>
                  )}
                </div>
                
                {/* Events for the day */}
                <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                  {dayEvents.slice(0, 3).map((event, idx) => (
                    <div 
                      key={idx}
                      className="text-xs truncate py-1 px-2 rounded bg-primary/10 text-primary dark:bg-primary/20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {event.title || event.Name}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-center text-surface-500 dark:text-surface-400">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
                
                {/* Add button (only visible on hover) */}
                <button 
                  className="absolute right-1 bottom-1 p-1 rounded-full bg-white/60 dark:bg-surface-700/60 hover:bg-primary/20 dark:hover:bg-primary/20 opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDayClick(day);
                  }}
                >
                  <PlusIcon size={16} className="text-primary" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Creation Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsEventModalOpen(false)}></div>
          <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div 
              className="relative w-full max-w-2xl glass-card border border-white/30 dark:border-surface-700/30 shadow-float"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Create New Event</h2>
                <button 
                  className="p-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors" 
                  onClick={() => setIsEventModalOpen(false)}
                >
                  <XIcon size={20} />
                </button>
              </div>
              
              <form onSubmit={handleEventSubmit}>
                <div className="mb-4">
                  <label className="block text-surface-700 dark:text-surface-300 mb-2" htmlFor="title">
                    Event Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={eventForm.title}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter event title"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-surface-700 dark:text-surface-300 mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={eventForm.description}
                    onChange={handleInputChange}
                    className="input-field"
                    rows="3"
                    placeholder="Enter event description"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-surface-700 dark:text-surface-300 mb-2" htmlFor="start">
                      Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      id="start"
                      name="start"
                      value={eventForm.start}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-surface-700 dark:text-surface-300 mb-2" htmlFor="end">
                      End Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      id="end"
                      name="end"
                      value={eventForm.end}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allDay"
                      name="allDay"
                      checked={eventForm.allDay}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
                    />
                    <label className="text-surface-700 dark:text-surface-300" htmlFor="allDay">
                      All Day Event
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-surface-700 dark:text-surface-300 mb-2" htmlFor="projectId">
                      Related Project
                    </label>
                    <select
                      id="projectId"
                      name="projectId"
                      value={eventForm.projectId}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="">Select Project</option>
                      {projects.map(project => (
                        <option key={project.Id} value={project.Id}>{project.Name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-surface-700 dark:text-surface-300 mb-2" htmlFor="taskId">
                      Related Task
                    </label>
                    <select
                      id="taskId"
                      name="taskId"
                      value={eventForm.taskId}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="">Select Task</option>
                      {tasks.map(task => (
                        <option key={task.Id} value={task.Id}>{task.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-surface-700 dark:text-surface-300 mb-2">
                    Attendees
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <select
                      className="input-field"
                      value={selectedAttendee}
                      onChange={(e) => setSelectedAttendee(e.target.value)}
                    >
                      <option value="">Select attendee</option>
                      {["Alex S.", "Jamie L.", "Taylor R.", "Morgan W.", "Casey P.", "Jordan B.", "Riley T.", "Blake M.", "Avery D."].filter(member => !eventForm.attendees.includes(member)).map((member) => (
                        <option key={member} value={member}>{member}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAttendeeAdd}
                      className="btn-outline px-3"
                      disabled={!selectedAttendee}
                    >
                      <PlusIcon size={18} />
                    </button>
                  </div>
                  
                  {eventForm.attendees.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {eventForm.attendees.map(attendee => (
                        <div key={attendee} className="flex items-center bg-primary/10 text-primary dark:bg-primary/20 rounded-full px-3 py-1 text-sm">
                          <UserCheckIcon size={14} className="mr-1.5" />
                          {attendee}
                          <button
                            type="button"
                            onClick={() => handleAttendeeRemove(attendee)}
                            className="ml-1.5 p-0.5 hover:bg-primary/20 rounded-full"
                          >
                            <XIcon size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-surface-500 dark:text-surface-400 italic text-sm mt-2">No attendees added yet</p>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="btn bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm border border-surface-300 dark:border-surface-600 text-surface-800 dark:text-surface-200"
                    onClick={() => setIsEventModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;