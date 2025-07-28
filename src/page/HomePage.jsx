import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEvent } from "../contexts/EventContext";
import { useAuth } from "../contexts/AuthContext";

export default function HomePage() {
  const { events, loading } = useEvent(); // Get loading state from EventContext
  const { user } = useAuth(); // Get user info for personalization

  const totalRecipes = events.reduce(
    (total, event) => total + (event.recipes ? event.recipes.length : 0),
    0
  );

  // Show loading screen when fetching events (especially during account switches)
  if (loading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Card className="shadow-sm">
              <Card.Body className="py-5">
                <div className="mb-4">
                  <Spinner
                    animation="border"
                    variant="primary"
                    style={{ width: "3rem", height: "3rem" }}
                  />
                </div>
                <h4 className="mb-3">Loading Your Events</h4>
                <p className="text-muted mb-3">
                  We're fetching your personalized event data...
                </p>
                <div className="d-flex justify-content-center align-items-center">
                  <Spinner animation="grow" size="sm" className="me-2" />
                  <Spinner animation="grow" size="sm" className="me-2" />
                  <Spinner animation="grow" size="sm" />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col>
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold">
              Welcome back
              {user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}!
            </h1>
            <p className="lead text-muted">
              Ready to organize your next culinary event?
            </p>
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-5">
        <Col md={6} className="mb-3">
          <Link to="/events" style={{ textDecoration: "none" }}>
            <Card
              className="text-center h-100 border-primary stats-card clickable-card"
              style={{
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0,123,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <Card.Body>
                <div className="display-4 text-primary mb-2">
                  <i class="fa-regular fa-calendar"></i>
                </div>
                <Card.Title style={{ color: "inherit" }}>
                  {events.length}
                </Card.Title>
                <Card.Text className="text-muted">Total Events</Card.Text>
                <small className="text-primary" style={{ fontSize: "0.8rem" }}>
                  Click to manage events →
                </small>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={6} className="mb-3">
          <Link to="/recipes" style={{ textDecoration: "none" }}>
            <Card
              className="text-center h-100 border-primary stats-card clickable-card"
              style={{
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0,123,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <Card.Body>
                <div className="display-4 text-primary mb-2">
                  <i class="fa-solid fa-bowl-food"></i>
                </div>
                <Card.Title style={{ color: "inherit" }}>
                  {totalRecipes}
                </Card.Title>
                <Card.Text className="text-muted">Saved Recipes</Card.Text>
                <small className="text-primary" style={{ fontSize: "0.8rem" }}>
                  Click to browse recipes →
                </small>
              </Card.Body>
            </Card>
          </Link>
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
              <div className="m-5">
                <span className="display-4">
                  <i class="fa-solid fa-magnifying-glass"></i>
                </span>
              </div>
              <div className="flex-grow-1">
                <Card.Title>Browse Recipes</Card.Title>
                <Card.Text>
                  Discover new recipes from TheMealDB and add them to your
                  events.
                </Card.Text>
                <Button as={Link} to="/recipes" variant="primary">
                  Browse Recipes
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="m-5">
                <span className="display-4">
                  <i class="fa-regular fa-file"></i>
                </span>
              </div>
              <div className="flex-grow-1">
                <Card.Title>Manage Events</Card.Title>
                <Card.Text>
                  Create new events or manage your existing ones.
                </Card.Text>
                <Button as={Link} to="/events" variant="success">
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
                  <Card className="h-100 shadow-sm">
                    {/* Event Image */}
                    {event.image_url && (
                      <Card.Img
                        variant="top"
                        src={event.image_url}
                        alt={event.title}
                        style={{ height: "180px", objectFit: "cover" }}
                      />
                    )}
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{event.title || event.name}</Card.Title>
                      <Card.Text>
                        <small className="text-muted">
                          📅 {new Date(event.date).toLocaleDateString()}
                        </small>
                      </Card.Text>
                      {event.description && (
                        <Card.Text className="flex-grow-1">
                          {event.description.length > 100
                            ? `${event.description.substring(0, 100)}...`
                            : event.description}
                        </Card.Text>
                      )}
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <small className="text-muted">
                          🍽️ {event.recipes ? event.recipes.length : 0} recipes
                        </small>
                        <Button
                          as={Link}
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

      {/* Empty State for New Users */}
      {events.length === 0 && (
        <Row className="mt-5">
          <Col>
            <Card className="text-center py-5 bg-light border-0">
              <Card.Body>
                <div className="mb-4">
                  <span className="display-1">🎉</span>
                </div>
                <h4 className="mb-3">Welcome to EventRecipe!</h4>
                <p className="text-muted mb-4">
                  You haven't created any events yet. Get started by creating
                  your first culinary event!
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <Button as={Link} to="/events" variant="primary" size="lg">
                    Create Your First Event
                  </Button>
                  <Button
                    as={Link}
                    to="/recipes"
                    variant="outline-primary"
                    size="lg"
                  >
                    Browse Recipes
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}
