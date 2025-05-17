/**
 * Calendar Event Service - Handles all API operations for calendar events
 */

// Get only updateable fields from the calendar_event table
const getUpdateableFields = (event) => {
  const updateableFields = [
    'Name',
    'Tags',
    'Owner',
    'title',
    'description',
    'startDate',
    'endDate',
    'allDay',
    'attendees',
    'relatedTask',
    'relatedProject'
  ];
  
  const filteredEvent = {};
  Object.keys(event).forEach(key => {
    if (updateableFields.includes(key)) {
      filteredEvent[key] = event[key];
    }
  });
  
  return filteredEvent;
};

/**
 * Fetch calendar events for a specific date range
 */
export const fetchCalendarEvents = async (startDate, endDate) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
        'ModifiedOn', 'ModifiedBy', 'title', 'description',
        'startDate', 'endDate', 'allDay', 'attendees',
        'relatedTask', 'relatedProject'
      ],
      orderBy: [{ field: 'startDate', direction: 'ASC' }],
      expands: [
        { name: 'relatedProject' },
        { name: 'relatedTask' }
      ]
    };

    // Add date range filter if provided
    if (startDate && endDate) {
      params.whereGroups = [
        {
          operator: "AND",
          conditions: [
            {
              fieldName: "startDate",
              operator: "GreaterThanOrEqual",
              values: [startDate.toISOString()]
            },
            {
              fieldName: "startDate",
              operator: "LessThanOrEqual",
              values: [endDate.toISOString()]
            }
          ]
        }
      ];
    }

    const response = await apperClient.fetchRecords('calendar_event', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};

/**
 * Create a new calendar event
 */
export const createCalendarEvent = async (eventData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Map fields to database schema and filter for updateable fields
    const mappedEvent = {
      Name: eventData.title,
      title: eventData.title,
      description: eventData.description,
      startDate: eventData.start,
      endDate: eventData.end,
      allDay: eventData.allDay || false,
      attendees: eventData.attendees || [],
      relatedProject: eventData.projectId,
      relatedTask: eventData.taskId
    };

    const filteredEvent = getUpdateableFields(mappedEvent);
    
    const response = await apperClient.createRecord('calendar_event', {
      records: [filteredEvent]
    });

    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to create calendar event');
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};

/**
 * Delete a calendar event
 */
export const deleteCalendarEvent = async (eventId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.deleteRecord('calendar_event', {
      RecordIds: [eventId]
    });
    
    return response && response.success;
  } catch (error) {
    console.error(`Error deleting calendar event with ID ${eventId}:`, error);
    throw error;
  }
};