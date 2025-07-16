import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div>
      <section className="hero-section bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                Organize Your Events with Perfect Recipes
              </h1>
              <p className="lead mb-4">
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
          </Row>
        </Container>
      </section>
    </div>
  );
}
