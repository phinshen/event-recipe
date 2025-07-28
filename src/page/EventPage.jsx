import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Alert,
  Badge,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { useEvent } from "../contexts/EventContext";
import { useAuth } from "../contexts/AuthContext";
import EventPhotoUpload from "../components/EventPhotoUpload";
import { uploadEventPhoto, deletePhoto } from "../utils/photoUpload";

export default function EventPage() {
  const {
    events,
    loading,
    creating,
    createEvent,
    updateEvent,
    removeRecipeFromEvent,
    deleteEvent,
    addRecipeToEvent,
  } = useEvent();

  const { user } = useAuth(); // Get current user for photo uploads

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
  });
  const [message, setMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);

  // Recipe detail modal state
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Recipe deletion state
  const [showDeleteRecipeModal, setShowDeleteRecipeModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [eventIdForRecipeDeletion, setEventIdForRecipeDeletion] =
    useState(null);
  const [deletingRecipe, setDeletingRecipe] = useState(false);

  // Add recipe modal state
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [currentEventForAddingRecipe, setCurrentEventForAddingRecipe] =
    useState(null);
  const [availableRecipes, setAvailableRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [recipeSearchTerm, setRecipeSearchTerm] = useState("");
  const [addingRecipeToEvent, setAddingRecipeToEvent] = useState(false);

  // NEW: Photo upload state
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // NEW: Photo upload handlers
  const handlePhotoSelect = (file, error = null) => {
    if (error) {
      setPhotoError(error);
      setSelectedPhoto(null);
    } else {
      setPhotoError("");
      setSelectedPhoto(file);
    }
  };

  const resetPhotoState = () => {
    setSelectedPhoto(null);
    setPhotoError("");
    setUploadingPhoto(false);
  };

  const handleCreateEvent = async (event) => {
    event.preventDefault();
    if (!formData.name || !formData.date) {
      setMessage("Please fill in required fields");
      return;
    }

    try {
      // Create event first
      const newEvent = await createEvent(formData);

      // Upload photo if selected
      let imageUrl = "";
      if (selectedPhoto && user) {
        setUploadingPhoto(true);
        try {
          imageUrl = await uploadEventPhoto(
            selectedPhoto,
            user.uid,
            newEvent.id || Date.now()
          );
          // Update event with image URL
          await updateEvent(newEvent.id, { ...formData, image_url: imageUrl });
        } catch (photoError) {
          console.error("Photo upload failed:", photoError);
          setMessage(
            "Event created successfully, but photo upload failed. You can add a photo later by editing the event."
          );
        }
        setUploadingPhoto(false);
      }

      setFormData({ name: "", description: "", date: "", location: "" });
      resetPhotoState();
      setShowCreateModal(false);
      setMessage("Event created successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error creating event:", error);
      setMessage("Error creating event. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDeleteEvent = async () => {
    if (eventToDelete) {
      try {
        // Delete photo from storage if exists
        if (eventToDelete.image_url) {
          await deletePhoto(eventToDelete.image_url);
        }

        await deleteEvent(eventToDelete.id);
        setEventToDelete(null);
        setShowDeleteModal(false);
        setMessage("Event deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        console.error("Error deleting event:", error);
        setMessage("Error deleting event. Please try again.");
        setTimeout(() => setMessage(""), 3000);
      }
    }
  };

  const confirmDeleteEvent = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const confirmEditEvent = (eventData) => {
    setEventToEdit(eventData);
    setFormData({
      name: eventData.title,
      description: eventData.description || "",
      date: eventData.date,
      location: eventData.location || "",
    });
    // Set existing photo for preview
    if (eventData.image_url) {
      setSelectedPhoto(eventData.image_url);
    }
    setShowEditModal(true);
  };

  const handleEditEvent = async (event) => {
    event.preventDefault();
    if (!formData.name || !formData.date) {
      setMessage("Please fill in required fields");
      return;
    }

    try {
      let imageUrl = eventToEdit.image_url || "";

      // Handle photo upload/update
      if (selectedPhoto && typeof selectedPhoto !== "string" && user) {
        setUploadingPhoto(true);
        try {
          // Delete old photo if exists
          if (eventToEdit.image_url) {
            await deletePhoto(eventToEdit.image_url);
          }
          // Upload new photo
          imageUrl = await uploadEventPhoto(
            selectedPhoto,
            user.uid,
            eventToEdit.id
          );
        } catch (photoError) {
          console.error("Photo upload failed:", photoError);
          setMessage("Event updated, but photo upload failed.");
        }
        setUploadingPhoto(false);
      }

      await updateEvent(eventToEdit.id, { ...formData, image_url: imageUrl });
      setFormData({ name: "", description: "", date: "", location: "" });
      resetPhotoState();
      setShowEditModal(false);
      setEventToEdit(null);
      setMessage("Event updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating event:", error);
      setMessage("Error updating event. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  };

  // Recipe deletion functions
  const confirmDeleteRecipe = (eventId, recipe) => {
    setRecipeToDelete(recipe);
    setEventIdForRecipeDeletion(eventId);
    setShowDeleteRecipeModal(true);
  };

  const handleDeleteRecipe = async () => {
    if (recipeToDelete && eventIdForRecipeDeletion) {
      setDeletingRecipe(true);
      try {
        await removeRecipeFromEvent(
          eventIdForRecipeDeletion,
          recipeToDelete.idMeal
        );
        setMessage(
          `"${recipeToDelete.strMeal}" removed from event successfully!`
        );
        setTimeout(() => setMessage(""), 4000);
      } catch (error) {
        console.error("Error removing recipe:", error);
        setMessage("Error removing recipe. Please try again.");
        setTimeout(() => setMessage(""), 4000);
      } finally {
        setDeletingRecipe(false);
        setShowDeleteRecipeModal(false);
        setRecipeToDelete(null);
        setEventIdForRecipeDeletion(null);
      }
    }
  };

  // Add recipe functions
  const openAddRecipeModal = (eventData) => {
    setCurrentEventForAddingRecipe(eventData);
    setShowAddRecipeModal(true);
    fetchRandomRecipesForModal();
  };

  const fetchRandomRecipesForModal = async () => {
    setLoadingRecipes(true);
    try {
      const promises = Array(12)
        .fill()
        .map(() =>
          fetch("https://www.themealdb.com/api/json/v1/1/random.php").then(
            (res) => res.json()
          )
        );

      const results = await Promise.all(promises);
      const meals = results.map((result) => result.meals[0]).filter(Boolean);

      const uniqueMeals = meals.filter(
        (meal, index, self) =>
          index === self.findIndex((m) => m.idMeal === meal.idMeal)
      );

      setAvailableRecipes(uniqueMeals);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setMessage("Error loading recipes. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const searchRecipesForModal = async (query) => {
    if (!query.trim()) {
      fetchRandomRecipesForModal();
      return;
    }

    setLoadingRecipes(true);
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();

      const meals = data.meals || [];
      const uniqueMeals = meals.filter(
        (meal, index, self) =>
          index === self.findIndex((m) => m.idMeal === meal.idMeal)
      );

      setAvailableRecipes(uniqueMeals);

      if (!meals.length) {
        setMessage("No recipes found. Try a different search term.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
      setMessage("Error searching recipes. Please try again.");
      setTimeout(() => setMessage(""), 3000);
      setAvailableRecipes([]);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const handleRecipeSearch = (event) => {
    event.preventDefault();
    searchRecipesForModal(recipeSearchTerm);
  };

  const addRecipeToCurrentEvent = async (recipe) => {
    if (!currentEventForAddingRecipe) return;

    setAddingRecipeToEvent(true);
    try {
      await addRecipeToEvent(currentEventForAddingRecipe.id, recipe);
      setMessage(
        `"${recipe.strMeal}" added to "${currentEventForAddingRecipe.title}" successfully!`
      );
      setTimeout(() => setMessage(""), 4000);
    } catch (error) {
      console.error("Error adding recipe:", error);
      if (error.response?.status === 409) {
        setMessage("This recipe is already added to this event!");
      } else {
        setMessage("Error adding recipe to event. Please try again.");
      }
      setTimeout(() => setMessage(""), 4000);
    } finally {
      setAddingRecipeToEvent(false);
    }
  };

  const isRecipeAlreadyInEvent = (recipe) => {
    if (!currentEventForAddingRecipe?.recipes) return false;
    return currentEventForAddingRecipe.recipes.some(
      (r) => r.idMeal === recipe.idMeal
    );
  };

  const getIngredients = (recipe) => {
    if (recipe.strIngredients && typeof recipe.strIngredients === "string") {
      const ingredients = recipe.strIngredients
        .split(", ")
        .filter((ingredient) => ingredient.trim());
      return ingredients;
    }

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(
          `${measure ? measure.trim() + " " : ""}${ingredient.trim()}`
        );
      }
    }
    return ingredients;
  };

  const getRecipeField = (recipe, field, fallback = "") => {
    const value = recipe[field];
    if (!value || value === "Unknown" || value === "null" || value === null) {
      return fallback;
    }
    return value;
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-5 fw-bold mb-2">My Events</h1>
              <p className="lead text-muted">
                Organize your culinary events and manage recipes
              </p>
            </div>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Create New Event
            </Button>
          </div>
        </Col>
      </Row>

      {message && (
        <Alert
          variant={message.includes("Error") ? "danger" : "success"}
          dismissible
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      )}

      {/* Event List */}
      {loading ? (
        <Row>
          <Col>
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading your events...</p>
            </div>
          </Col>
        </Row>
      ) : events.length > 0 ? (
        <Row>
          {events.map((event) => (
            <Col lg={6} key={event.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                {/* NEW: Event Photo Header */}
                {event.image_url && (
                  <Card.Img
                    variant="top"
                    src={event.image_url}
                    alt={event.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}

                <Card.Header className="bg-primary text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{event.title}</h5>
                    <div>
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="me-2"
                        onClick={() => confirmEditEvent(event)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => confirmDeleteEvent(event)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <p className="mb-2">
                      <strong>Date:</strong>{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    {event.location && (
                      <p className="mb-2">
                        <strong>Location:</strong> {event.location}
                      </p>
                    )}
                    {event.description && (
                      <p className="mb-2">
                        <strong>Description:</strong> {event.description}
                      </p>
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">
                        Recipes ({event.recipes?.length || 0})
                      </h6>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => openAddRecipeModal(event)}
                        style={{ fontSize: "0.8rem" }}
                      >
                        + Add Recipe
                      </Button>
                    </div>

                    {Array.isArray(event.recipes) &&
                    event.recipes.length > 0 ? (
                      <div
                        className="recipe-list"
                        style={{ maxHeight: "300px", overflowY: "auto" }}
                      >
                        <ListGroup variant="flush">
                          {event.recipes.map((recipe) => (
                            <ListGroup.Item
                              key={recipe.idMeal}
                              className="d-flex justify-content-between align-items-center px-0 py-2 border-bottom"
                            >
                              <div className="flex-grow-1">
                                <span
                                  role="button"
                                  className="text-primary text-decoration-none recipe-name"
                                  onClick={() => handleRecipeClick(recipe)}
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "0.95rem",
                                    fontWeight: "500",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.textDecoration = "underline";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.textDecoration = "none";
                                  }}
                                  title="Click to view recipe details"
                                >
                                  {recipe.strMeal}
                                </span>
                                <div className="mt-1">
                                  <Badge
                                    bg="secondary"
                                    className="me-1"
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    {getRecipeField(
                                      recipe,
                                      "strCategory",
                                      "Category N/A"
                                    )}
                                  </Badge>
                                  <Badge
                                    bg="info"
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    {getRecipeField(
                                      recipe,
                                      "strArea",
                                      "Area N/A"
                                    )}
                                  </Badge>
                                </div>
                              </div>

                              <div className="d-flex gap-1">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleRecipeClick(recipe)}
                                  style={{
                                    fontSize: "0.9rem",
                                    padding: "0.25rem 0.5rem",
                                    lineHeight: "1",
                                  }}
                                  title="View recipe details"
                                >
                                  <i class="fa-regular fa-eye"></i>
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() =>
                                    confirmDeleteRecipe(event.id, recipe)
                                  }
                                  style={{
                                    fontSize: "0.9rem",
                                    padding: "0.25rem 0.5rem",
                                    lineHeight: "1",
                                  }}
                                  title="Remove from event"
                                >
                                  <i class="fa-regular fa-trash-can"></i>
                                </Button>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>
                    ) : (
                      <div className="text-center py-3 text-muted">
                        <p>No recipes added yet</p>
                        <small>
                          Click "Add Recipe" above to add some dishes to this
                          event
                        </small>
                      </div>
                    )}
                  </div>
                </Card.Body>
                <Card.Footer className="text-muted">
                  <small>
                    Created on {new Date(event.created_at).toLocaleDateString()}
                  </small>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Row>
          <Col>
            <div className="text-center py-5">
              <div className="mb-4">
                <span className="display-1">📅</span>
              </div>
              <h3>No Events Yet</h3>
              <p className="text-muted mb-4">
                Create your first event to start organizing recipes for your
                special occasions.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowCreateModal(true)}
              >
                Create Your First Event
              </Button>
            </div>
          </Col>
        </Row>
      )}

      {/* Create Event Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => {
          setShowCreateModal(false);
          resetPhotoState();
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Event</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateEvent}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="e.g., Birthday Party, Holiday Dinner"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="e.g., Home, Restaurant, Park"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    placeholder="Tell us about your event..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Photo</Form.Label>
                  <EventPhotoUpload
                    onPhotoSelect={handlePhotoSelect}
                    selectedPhoto={selectedPhoto}
                    error={photoError}
                    disabled={uploadingPhoto}
                    title="Add Event Photo"
                    description="Upload a photo for your event"
                    height="250px"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowCreateModal(false);
                resetPhotoState();
              }}
              disabled={creating || uploadingPhoto}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={creating || uploadingPhoto}
            >
              {creating || uploadingPhoto ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {uploadingPhoto ? "Uploading..." : "Creating..."}
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          resetPhotoState();
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditEvent}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="e.g., Birthday Party, Holiday Dinner"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="e.g., Home, Restaurant, Park"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    placeholder="Tell us about your event..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Photo</Form.Label>
                  <EventPhotoUpload
                    onPhotoSelect={handlePhotoSelect}
                    selectedPhoto={selectedPhoto}
                    error={photoError}
                    disabled={uploadingPhoto}
                    title="Update Event Photo"
                    description="Upload a new photo or keep the current one"
                    height="250px"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowEditModal(false);
                resetPhotoState();
              }}
              disabled={uploadingPhoto}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={uploadingPhoto}>
              {uploadingPhoto ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Uploading...
                </>
              ) : (
                "Update Event"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Add Recipe Modal */}
      <Modal
        show={showAddRecipeModal}
        onHide={() => setShowAddRecipeModal(false)}
        size="xl"
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Add Recipe to "{currentEventForAddingRecipe?.title}"
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh" }}>
          <Form onSubmit={handleRecipeSearch} className="mb-4">
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Search for recipes (e.g., chicken, pasta, dessert)..."
                value={recipeSearchTerm}
                onChange={(e) => setRecipeSearchTerm(e.target.value)}
              />
              <Button type="submit" variant="primary" disabled={loadingRecipes}>
                {loadingRecipes ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Search"
                )}
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => {
                  setRecipeSearchTerm("");
                  fetchRandomRecipesForModal();
                }}
                disabled={loadingRecipes}
              >
                Random
              </Button>
            </div>
          </Form>

          {loadingRecipes && (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading delicious recipes...</p>
            </div>
          )}

          {!loadingRecipes && (
            <Row>
              {availableRecipes.length > 0 ? (
                availableRecipes.map((recipe) => (
                  <Col md={6} lg={4} key={recipe.idMeal} className="mb-3">
                    <Card className="h-100 shadow-sm">
                      <Card.Img
                        variant="top"
                        src={recipe.strMealThumb}
                        alt={recipe.strMeal}
                        style={{ height: "150px", objectFit: "cover" }}
                      />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title style={{ fontSize: "1rem" }}>
                          {recipe.strMeal}
                        </Card.Title>
                        <div className="mb-2">
                          <Badge
                            bg="secondary"
                            className="me-1"
                            style={{ fontSize: "0.7rem" }}
                          >
                            {recipe.strCategory}
                          </Badge>
                          <Badge bg="info" style={{ fontSize: "0.7rem" }}>
                            {recipe.strArea}
                          </Badge>
                        </div>
                        <Card.Text
                          className="flex-grow-1 text-muted"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {recipe.strInstructions?.substring(0, 80)}...
                        </Card.Text>
                        <div className="d-flex gap-2 mt-auto">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {
                              setSelectedRecipe(recipe);
                              setShowRecipeModal(true);
                            }}
                            style={{ fontSize: "0.8rem" }}
                          >
                            View Details
                          </Button>
                          <Button
                            variant={
                              isRecipeAlreadyInEvent(recipe)
                                ? "secondary"
                                : "primary"
                            }
                            size="sm"
                            onClick={() => addRecipeToCurrentEvent(recipe)}
                            disabled={
                              isRecipeAlreadyInEvent(recipe) ||
                              addingRecipeToEvent
                            }
                            style={{ fontSize: "0.8rem" }}
                          >
                            {isRecipeAlreadyInEvent(recipe) ? (
                              "Already Added"
                            ) : addingRecipeToEvent ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              "Add to Event"
                            )}
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col>
                  <div className="text-center py-4">
                    <div className="mb-3">
                      <span style={{ fontSize: "3rem" }}>🍽️</span>
                    </div>
                    <h5>No recipes found</h5>
                    <p className="text-muted">
                      Try searching for something else or browse random recipes.
                    </p>
                    <Button
                      variant="primary"
                      onClick={fetchRandomRecipesForModal}
                    >
                      Load Random Recipes
                    </Button>
                  </div>
                </Col>
              )}
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddRecipeModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Recipe Detail Modal */}
      <Modal
        show={showRecipeModal}
        onHide={() => setShowRecipeModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedRecipe?.strMeal}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecipe && (
            <Row>
              <Col md={6}>
                <img
                  src={selectedRecipe.strMealThumb || ""}
                  alt={selectedRecipe.strMeal}
                  className="img-fluid rounded mb-3"
                />
                <div className="mb-3">
                  {getRecipeField(selectedRecipe, "strCategory") && (
                    <Badge bg="secondary" className="me-2">
                      {getRecipeField(
                        selectedRecipe,
                        "strCategory",
                        "Category N/A"
                      )}
                    </Badge>
                  )}

                  {getRecipeField(selectedRecipe, "strArea") && (
                    <Badge bg="info" className="me-2">
                      {getRecipeField(selectedRecipe, "strArea", "Area N/A")}
                    </Badge>
                  )}

                  {getRecipeField(selectedRecipe, "strTags") && (
                    <Badge bg="success">
                      {getRecipeField(selectedRecipe, "strTags").split(",")[0]}
                    </Badge>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <h5>Ingredients:</h5>
                <ul className="list-unstyled">
                  {getIngredients(selectedRecipe).map((ingredient, index) => (
                    <li key={index} className="mb-1">
                      • {ingredient}
                    </li>
                  ))}
                </ul>
              </Col>
              <Col xs={12}>
                <h5>Instructions:</h5>
                <p style={{ whiteSpace: "pre-line" }}>
                  {selectedRecipe.strInstructions ||
                    "No instructions available."}
                </p>
                <div className="d-flex gap-2 mt-3">
                  {getRecipeField(selectedRecipe, "strYoutube") && (
                    <Button
                      variant="danger"
                      href={getRecipeField(selectedRecipe, "strYoutube")}
                      target="_blank"
                      size="sm"
                    >
                      <i class="fa-brands fa-youtube"></i> Watch Video
                    </Button>
                  )}

                  {getRecipeField(selectedRecipe, "strSource") && (
                    <Button
                      variant="outline-primary"
                      href={getRecipeField(selectedRecipe, "strSource")}
                      target="_blank"
                      size="sm"
                    >
                      🔗 Source
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRecipeModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Recipe Delete Confirmation Modal */}
      <Modal
        show={showDeleteRecipeModal}
        onHide={() => setShowDeleteRecipeModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Remove Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <span className="display-4">🗑️</span>
          </div>
          <p className="text-center">
            Are you sure you want to remove{" "}
            <strong>"{recipeToDelete?.strMeal}"</strong> from this event?
          </p>
          <Alert variant="info" className="mt-3">
            <small>
              <strong>Note:</strong> This will only remove the recipe from this
              event. The recipe will still be available to add to other events.
            </small>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteRecipeModal(false)}
            disabled={deletingRecipe}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteRecipe}
            disabled={deletingRecipe}
          >
            {deletingRecipe ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Removing...
              </>
            ) : (
              "Remove Recipe"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Event Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <span className="display-4">⚠️</span>
          </div>
          <p className="text-center">
            Are you sure you want to delete the event{" "}
            <strong>"{eventToDelete?.title}"</strong>?
          </p>
          {eventToDelete?.recipes?.length > 0 && (
            <Alert variant="warning">
              This event contains{" "}
              <strong>{eventToDelete.recipes.length} recipe(s)</strong> that
              will also be removed.
            </Alert>
          )}
          <Alert variant="danger" className="mt-3">
            <strong>This action cannot be undone!</strong>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteEvent}>
            Delete Event
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
