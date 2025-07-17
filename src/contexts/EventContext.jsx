import { createContext, useContext, useState, useEffect } from "react";

const EventContext = createContext();

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Load events from localStorage or API
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  const savedEvents = localStorage.getItem("events");
  if (savedEvents) {
    setEvents(JSON.parse(savedEvents));
  }

  const createEvent = (eventData) => {
    const newEvent = {
      id: Date.now(),
      ...eventData,
      recipes: [],
      createdAt: new Date().toISOString(),
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    saveEventsToStorage(updatedEvents);
    return newEvent;
  };

  const deleteEvent = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
    saveEventsToStorage(updatedEvents);
  };

  const value = {
    events,
    createEvent,
    deleteEvent,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};
