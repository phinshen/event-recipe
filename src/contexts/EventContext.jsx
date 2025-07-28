import { createContext, useContext, useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";

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
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Fetch all user events
  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        setLoading(true);
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();
        const res = await axios.get(
          "https://event-recipe-api.vercel.app/events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEvents(res.data);
      } catch (err) {
        console.error("Fetching events failed:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, []);

  // Create new event
  const createEvent = async (newEvent) => {
    try {
      setCreating(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken();

      const res = await axios.post(
        "https://event-recipe-api.vercel.app/events",
        newEvent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvents((prevEvents) => [...prevEvents, res.data]);
      return res.data; // Return the created event for photo upload
    } catch (err) {
      console.error("Create Event Error:", err);
      throw err;
    } finally {
      setCreating(false);
    }
  };

  // Update event
  const updateEvent = async (eventId, updatedEvent) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken();

      const res = await axios.put(
        `https://event-recipe-api.vercel.app/events/${eventId}`,
        updatedEvent, // This now includes image_url
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the event in the state, preserving existing recipes
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, ...res.data } : event
        )
      );

      return res.data; // Return updated event data
    } catch (err) {
      console.error("Update Event Error:", err);
      throw err;
    }
  };

  // Add TheMealDB recipe to event
  const addRecipeToEvent = async (eventId, recipe) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken();

      const res = await axios.post(
        `https://event-recipe-api.vercel.app/events/${eventId}/recipes`,
        { recipe }, // Send the full recipe object
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the specific event with the returned data
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? res.data : event))
      );
    } catch (err) {
      console.error("Add Recipe Error:", err);
      throw err;
    }
  };

  // Remove recipe from event
  const removeRecipeFromEvent = async (eventId, mealId) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken();

      const res = await axios.delete(
        `https://event-recipe-api.vercel.app/events/${eventId}/recipes/${mealId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the specific event with the returned data
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? res.data : event))
      );
    } catch (err) {
      console.error("Remove Recipe Error:", err);
      throw err;
    }
  };

  // Delete event
  const deleteEvent = async (eventId) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken();

      await axios.delete(
        `https://event-recipe-api.vercel.app/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (err) {
      console.error("Delete Event Error:", err);
      throw err;
    }
  };

  const value = {
    events,
    loading,
    creating,
    createEvent,
    updateEvent,
    addRecipeToEvent,
    removeRecipeFromEvent,
    deleteEvent,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};
