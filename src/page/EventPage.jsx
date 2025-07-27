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
} from "react-bootstrap";
import { useEvent } from "../contexts/EventContext";

export default function EventPage() {
  const {
    events,
    loading,
    creating,
    createEvent,
    updateEvent,
    removeRecipeFromEvent,
    deleteEvent,
  } = useEvent();
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

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreateEvent = (event) => {
    event.preventDefault();
    if (!formData.name || !formData.date) {
      setMessage("Please fill in required fields");
      return;
    }

    createEvent(formData);
    setFormData({ name: "", description: "", date: "", location: "" });
    setShowCreateModal(false);
    setMessage("Event created successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteEvent = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete.id);
      setEventToDelete(null);
      setShowDeleteModal(false);
      setMessage("Event deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const confirmDeleteEvent = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const confirmEditEvent = (event) => {
    setEventToEdit(event);
    setFormData({
      name: event.title, // Map title to name for the form
      description: event.description || "",
      date: event.date,
      location: event.location || "",
    });
    setShowEditModal(true);
  };

  const handleEditEvent = (event) => {
    event.preventDefault();
    if (!formData.name || !formData.date) {
      setMessage("Please fill in required fields");
      return;
    }

    updateEvent(eventToEdit.id, formData);
    setFormData({ name: "", description: "", date: "", location: "" });
    setShowEditModal(false);
    setEventToEdit(null);
    setMessage("Event updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  console.log("Events from context:", events);

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
        <Alert variant="success" dismissible onClose={() => setMessage("")}>
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
                    </div>

                    {Array.isArray(event.recipes) &&
                    event.recipes.length > 0 ? (
                      <div
                        className="recipe-list"
                        style={{ maxHeight: "300px", overflowY: "auto" }}
                      >
                        {event.recipes.map((recipe) => (
                          <Card
                            key={recipe.idMeal}
                            className="mb-2 border-light"
                          >
                            <Card.Body className="p-2">
                              <Row className="align-items-center">
                                <Col xs={3}>
                                  <img
                                    src={recipe.strMealThumb || ""}
                                    alt={recipe.strMeal}
                                    className="recipe-thumbnail"
                                  />
                                </Col>
                                <Col xs={7}>
                                  <h6 className="mb-1">{recipe.strMeal}</h6>
                                  <div>
                                    <Badge bg="secondary" className="me-1">
                                      {recipe.strCategory}
                                    </Badge>
                                    <Badge bg="info">{recipe.strArea}</Badge>
                                  </div>
                                </Col>
                                <Col xs={2} className="text-end">
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() =>
                                      removeRecipeFromEvent(
                                        event.id,
                                        recipe.idMeal
                                      )
                                    }
                                  >
                                    ×
                                  </Button>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-3 text-muted">
                        <p>No recipes added yet</p>
                        <small>
                          Go to the Recipes pages to add some dishes to this
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
              <h3>No Event Yet</h3>
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
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Event</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateEvent}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Event Name: </Form.Label>
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
              <Form.Label>Date: </Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location: </Form.Label>
              <Form.Control
                type="text"
                name="location"
                placeholder="e.g., Home, Restaurant, Park"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description: </Form.Label>
              <Form.Control
                type="text"
                name="description"
                placeholder="Tell us about your event"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={creating}>
              {creating ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Event Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditEvent}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Event Name: </Form.Label>
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
              <Form.Label>Date: </Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location: </Form.Label>
              <Form.Control
                type="text"
                name="location"
                placeholder="e.g., Home, Restaurant, Park"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description: </Form.Label>
              <Form.Control
                type="text"
                name="description"
                placeholder="Tell us about your event"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Event
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete the event "{eventToDelete?.title}"?
            This action cannot be undone.
          </p>
          {eventToDelete?.recipes?.length > 0 && (
            <Alert variant="warning">
              This event contains {eventToDelete.recipes.length} recipe(s) that
              will also be removed.
            </Alert>
          )}
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
