import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer py-4 bg-light border-top">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <div className="d-flex align-items-center gap-4">
              <h6 className="mb-0 me-3">🍽️ EventRecipe</h6>
              <div className="d-flex gap-3">
                <Link to="/home" className="footer-link text-decoration-none">
                  Home
                </Link>
                <Link
                  to="/recipes"
                  className="footer-link text-decoration-none"
                >
                  Recipes
                </Link>
                <Link to="/events" className="footer-link text-decoration-none">
                  Events
                </Link>
              </div>
            </div>
          </Col>

          <Col md={6} className="text-md-end">
            <div className="d-flex align-items-center justify-content-md-end gap-3">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
                aria-label="GitHub"
              >
                <i className="fab fa-github"></i> GitHub
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin"></i> LinkedIn
              </a>
            </div>
          </Col>
        </Row>

        <hr className="my-3" />

        <Row>
          <Col className="text-center">
            <p className="mb-0 text-muted small">
              © 2025 EventRecipe. Made with ❤️ for food lovers everywhere.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
