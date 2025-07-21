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
import { useEvents } from "../contexts/EventContext";

export default function EventPage() {
  const { event, createEvent, removeRecipeFromEvent, deleteEvent } = useEvent();
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
    </Container>
  );
}
