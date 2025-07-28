import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  // IMPROVED: Memoized fetch function to prevent unnecessary re-renders
  const fetchUserEvents = useCallback(
    async (user, forceRefresh = false) => {
      if (!user) {
        console.log("❌ No user provided to fetchUserEvents");
        setEvents([]);
        setLoading(false);
        return;
      }

      try {
        // Don't refetch if we already have events for this user (unless forced)
        if (
          !forceRefresh &&
          currentUser?.uid === user.uid &&
          events.length > 0
        ) {
          console.log(
            "✅ Events already loaded for user:",
            user.uid.substring(0, 8)
          );
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        console.log("🔄 Fetching events for user:", user.uid.substring(0, 8));

        // Add retry logic for token retrieval
        let token;
        let retries = 3;
        while (retries > 0) {
          try {
            token = await user.getIdToken(true); // Force refresh token
            break;
          } catch (tokenError) {
            console.warn(
              `Token retrieval failed, ${retries} retries left:`,
              tokenError
            );
            retries--;
            if (retries === 0) throw tokenError;
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
          }
        }

        const res = await axios.get(
          "https://event-recipe-api.vercel.app/events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000, // 10 second timeout
          }
        );

        console.log(
          `✅ Successfully fetched ${res.data.length} events for user:`,
          user.uid.substring(0, 8)
        );
        setEvents(res.data);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching events:", err);
        setError(`Failed to fetch events: ${err.message}`);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    },
    [currentUser, events.length]
  );

  // IMPROVED: Better auth state change handling
  useEffect(() => {
    const auth = getAuth();
    let isSubscribed = true; // Prevent state updates if component unmounts

    console.log("🔌 Setting up auth state listener");

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isSubscribed) return;

      console.log(
        "🔄 Auth state changed:",
        user ? `User ${user.uid.substring(0, 8)}` : "No user"
      );

      if (user) {
        // User logged in or switched
        setCurrentUser(user);

        // Small delay to ensure auth is fully settled
        setTimeout(() => {
          if (isSubscribed) {
            fetchUserEvents(user, true); // Force refresh on user change
          }
        }, 100);
      } else {
        // User logged out
        console.log("🚪 User logged out, clearing data");
        setCurrentUser(null);
        setEvents([]);
        setError(null);
        setLoading(false);
      }
    });

    return () => {
      console.log("🔌 Cleaning up auth state listener");
      isSubscribed = false;
      unsubscribe();
    };
  }, [fetchUserEvents]);

  // Manual refresh function for debugging/recovery
  const refreshEvents = useCallback(() => {
    console.log("🔄 Manual refresh requested");
    if (currentUser) {
      fetchUserEvents(currentUser, true);
    } else {
      console.log("❌ No current user for manual refresh");
    }
  }, [currentUser, fetchUserEvents]);

  // Create new event
  const createEvent = async (newEvent) => {
    try {
      setCreating(true);
      setError(null);

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken(true);

      console.log(
        "🆕 Creating event for user:",
        user.uid.substring(0, 8),
        newEvent
      );

      const res = await axios.post(
        "https://event-recipe-api.vercel.app/events",
        newEvent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      console.log("✅ Event created successfully:", res.data.id);
      setEvents((prevEvents) => [...prevEvents, res.data]);
      return res.data;
    } catch (err) {
      console.error("❌ Create Event Error:", err);
      setError(`Failed to create event: ${err.message}`);
      throw err;
    } finally {
      setCreating(false);
    }
  };

  // Update event
  const updateEvent = async (eventId, updatedEvent) => {
    try {
      setError(null);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken(true);

      console.log(
        "📝 Updating event:",
        eventId,
        "for user:",
        user.uid.substring(0, 8)
      );

      const res = await axios.put(
        `https://event-recipe-api.vercel.app/events/${eventId}`,
        updatedEvent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      console.log("✅ Event updated successfully:", eventId);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, ...res.data } : event
        )
      );

      return res.data;
    } catch (err) {
      console.error("❌ Update Event Error:", err);
      setError(`Failed to update event: ${err.message}`);
      throw err;
    }
  };

  // Add TheMealDB recipe to event
  const addRecipeToEvent = async (eventId, recipe) => {
    try {
      setError(null);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken(true);

      console.log(
        "🍽️ Adding recipe to event:",
        eventId,
        "for user:",
        user.uid.substring(0, 8)
      );

      const res = await axios.post(
        `https://event-recipe-api.vercel.app/events/${eventId}/recipes`,
        { recipe },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      console.log("✅ Recipe added successfully to event:", eventId);
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? res.data : event))
      );
    } catch (err) {
      console.error("❌ Add Recipe Error:", err);
      setError(`Failed to add recipe: ${err.message}`);
      throw err;
    }
  };

  // Remove recipe from event
  const removeRecipeFromEvent = async (eventId, mealId) => {
    try {
      setError(null);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken(true);

      console.log(
        "🗑️ Removing recipe from event:",
        eventId,
        "for user:",
        user.uid.substring(0, 8)
      );

      const res = await axios.delete(
        `https://event-recipe-api.vercel.app/events/${eventId}/recipes/${mealId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      console.log("✅ Recipe removed successfully from event:", eventId);
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? res.data : event))
      );
    } catch (err) {
      console.error("❌ Remove Recipe Error:", err);
      setError(`Failed to remove recipe: ${err.message}`);
      throw err;
    }
  };

  // Delete event
  const deleteEvent = async (eventId) => {
    try {
      setError(null);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken(true);

      console.log(
        "🗑️ Deleting event:",
        eventId,
        "for user:",
        user.uid.substring(0, 8)
      );

      await axios.delete(
        `https://event-recipe-api.vercel.app/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      console.log("✅ Event deleted successfully:", eventId);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (err) {
      console.error("❌ Delete Event Error:", err);
      setError(`Failed to delete event: ${err.message}`);
      throw err;
    }
  };

  const value = {
    events,
    loading,
    creating,
    currentUser,
    error,
    createEvent,
    updateEvent,
    addRecipeToEvent,
    removeRecipeFromEvent,
    deleteEvent,
    refreshEvents,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};
