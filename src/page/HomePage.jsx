import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEvent } from "../contexts/EventContext";

export default function HomePage() {
  const { user } = useAuth();
  const { events } = useEvent();

  const totalRecipes = events.reduce(
    (total, event) => total + event.recipes.length,
    0
  );

  return (
    <Container className="py-5">
      <Row>
        <Col>
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold">Welcome back, {user.name}!</h1>
            <p className="lead text-muted">
              Ready to organize your next culinary event?
            </p>
          </div>
        </Col>
      </Row>

      {/* Stats Card */}
      <Row className="mb-5">
        <Col md={4} className="mb-3">
          <Card className="text-center h-100 border-primary stats-card">
            <Card.Body>
              <div className="display-4 text-primary mb-2">📅</div>
              <Card.Title>{events.length}</Card.Title>
              <Card.Text className="text-muted">Total Events</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="text-center h-100 border-primary stats-card">
            <Card.Body>
              <div className="display-4 text-primary mb-2">🍽️</div>
              <Card.Title>{totalRecipes}</Card.Title>
              <Card.Text className="text-muted">Saved Recipes</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="text-center h-100 border-primary stats-card">
            <Card.Body>
              <div className="display-4 text-primary mb-2">⭐</div>
              <Card.Title>Premium</Card.Title>
              <Card.Text className="text-muted">Account Status</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-2">
        <Col>
          <h3 className="mb-4">Quick Actions</h3>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <span className="display-4">🔍</span>
              </div>
              <div className="flex-grow-1">
                <Card.Title>Browse Recipes</Card.Title>
                <Card.Text>
                  Discover new recipes from TheMealDB and add them to your
                  events.
                </Card.Text>
                <Button to="/recipes" variant="primary">
                  Browse Recipes
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <span className="display-4">📋</span>
              </div>
              <div className="flex-grow-1">
                <Card.Title>Manage Events</Card.Title>
                <Card.Text>
                  Create new events or manage your existing ones.
                </Card.Text>
                <Button to="/events" variant="success">
                  Manage Events
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Events */}
      {events.length > 0 && (
        <Row className="mt-5">
          <Col>
            <h3 className="mb-4">Recent Events</h3>
            <Row>
              {events.slice(0, 3).map((event) => (
                <Col md={4} key={event.id} className="mb-3">
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>{event.name}</Card.Title>
                      <Card.Text>
                        <small className="text-muted">
                          {new Date(event.date).toLocaleDateString()}
                        </small>
                      </Card.Text>
                      <Card.Text>{event.description}</Card.Text>
                      <div className="d-flex justify-content-netween align-items-center">
                        <small className="text-muted">
                          {event.recipes.length} recipes
                        </small>
                        <Button
                          to="/events"
                          variant="outline-primary"
                          size="sm"
                        >
                          View Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      )}
    </Container>
  );
}
