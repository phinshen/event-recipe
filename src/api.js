import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export const fetchEvents = (token) =>
  axios.get(`${API_BASE}/events`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createEvent = (eventData, token) =>
  axios.post(`${API_BASE}/events`, eventData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateEvent = (id, eventData, token) =>
  axios.put(`${API_BASE}/events/${id}`, eventData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteEvent = (id, token) =>
  axios.delete(`${API_BASE}/events/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addRecipeToEvent = (eventId, recipeData, token) =>
  axios.post(
    `${API_BASE}/events/${eventId}/recipes`,
    { recipe: recipeData },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

export const removeRecipeFromEvent = (eventId, recipeId, token) =>
  axios.delete(`${API_BASE}/events/${eventId}/recipes/${recipeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
