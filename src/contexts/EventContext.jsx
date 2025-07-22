import { createContext, useContext, useState, useEffect } from "react";

const EventContext = createContext();

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
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

  const saveEventsToStorage = (newEvents) => {
    localStorage.setItem("events", JSON.stringify(newEvents));
  };

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

  const addRecipeToEvent = (eventId, recipe) => {
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        const recipeExists = event.recipes.some(
          (r) => r.idMeal === recipe.idMeal
        );
        if (!recipeExists) {
          return { ...event, recipes: [...event.recipes, recipe] };
        }
      }
      return event;
    });
    setEvents(updatedEvents);
    saveEventsToStorage(updatedEvents);
  };

  const removeRecipeFromEvent = (eventId, recipeId) => {
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        return {
          ...event,
          recipes: event.recipes.filter((recipe) => recipe.idMeal !== recipeId),
        };
      }
      return event;
    });
    setEvents(updatedEvents);
    saveEventsToStorage(updatedEvents);
  };

  const deleteEvent = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
    saveEventsToStorage(updatedEvents);
  };

  const value = {
    events,
    createEvent,
    addRecipeToEvent,
    removeRecipeFromEvent,
    deleteEvent,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};
