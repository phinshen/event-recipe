import { Container, Row, Col, Button, Card } from "react-bootstrap";
import landingImg1 from "../images/landing-img-1.jpg";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section bg-dark text-black py-5">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6}>
              <h1 className="display-4 fw-bold text-white mb-4">
                Organize Your Events with Perfect Recipes
              </h1>
              <p className="lead mb-4 text-white">
                Discover thousands of delicious recipes and organize them into
                custom events. Whether it's a dinner party, holiday celebration,
                or casual gathering, EventRecipe helps you plan the perfect
                menu.
              </p>
              <div className="d-flex gap-3">
                <Button as={Link} to="/signup" variant="light" size="lg">
                  Get Started
                </Button>
                <Button as={Link} to="/login" variant="outline-light" size="lg">
                  Sign In
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="hero-image">
                <img
                  src={landingImg1}
                  alt="Recipe Organization"
                  className="img-fluid rounded shadow ms-5"
                  style={{ width: "600px", height: "400px" }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">
                Why Choose EventRecipe?
              </h2>
              <p className="lead text-muted">
                Everything you need to plan and organize your culinary events
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <span className="display-4">🔍</span>
                  </div>
                  <Card.Title>Discover Recipes</Card.Title>
                  <Card.Text>
                    Browse thousands of recipes from TheMealDB. Search by name,
                    ingredient, or category to find the perfect dishes.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <span className="display-4">📅</span>
                  </div>
                  <Card.Title>Create Events</Card.Title>
                  <Card.Text>
                    Organize your recipes into custom events. Plan dinner
                    parties, holidays, or any special occasion with ease.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <span className="display-4">📋</span>
                  </div>
                  <Card.Title>Stay Organized</Card.Title>
                  <Card.Text>
                    Keep all your event recipes in one place. Add, remove, and
                    manage your menu items effortlessly.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-light py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h2 className="display-5 fw-bold mb-3">Ready to Get Started?</h2>
              <p className="lead mb-4">
                Join thousands of users who are already organizing their events
                with EventRecipe
              </p>
              <Button to="/signup" variant="primary" size="lg">
                Create Your Account
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}
