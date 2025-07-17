import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer py-5 mt-5 bg-light">
      <Container>
        <Row>
          <Col lg={4} md={6} className="mb-4">
            <h5 className="mb-3">🍽️ EventRecipe</h5>
            <p className="text-muted">
              Organize your culinary events with ease. Discover thousands of
              recipes and create memorable dining experiences for every
              occasion.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                📘
              </a>
              <a href="#" aria-label="Twitter">
                🐦
              </a>
              <a href="#" aria-label="Instagram">
                📷
              </a>
              <a href="#" aria-label="YouTube">
                📺
              </a>
            </div>
          </Col>

          <Col lg={2} md={6} className="mb-4">
            <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/home" className="footer-link">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/home" className="footer-link">
                  Recipes
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/home" className="footer-link">
                  Events
                </Link>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link">
                  About Us
                </a>
              </li>
            </ul>
          </Col>

          <Col lg={2} md={6} className="mb-4">
            <h6 className="mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="footer-link">
                  Help Center
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link">
                  Contact Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link">
                  FAQ
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link">
                  Community
                </a>
              </li>
            </ul>
          </Col>

          <Col lg={2} md={6} className="mb-4">
            <h6 className="mb-3">Legal</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="footer-link">
                  Privacy Policy
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link">
                  Term of Service
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link">
                  Cookie Policy
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link">
                  Disclaimer
                </a>
              </li>
            </ul>
          </Col>

          <Col lg={2} md={12} className="mb-4">
            <h6 className="mb-3">Download App</h6>
            <div className="d-flex flex-column gap-2">
              <a href="#" className="btn btn-outline-dark btn-sm">
                📱 App Store
              </a>
              <a href="#" className="btn btn-outline-dark btn-sm">
                🤖 Google Play
              </a>
            </div>
          </Col>
        </Row>

        <hr className="my-4" style={{ borderColor: "#495057" }} />

        <Row className="align-items-center">
          <Col md={6}>
            <p className="mb-0 text-muted">
              © {currentYear} EventRecipe. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="mb-0 text-muted">
              Made with ❤️ for food lovers everywhere
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
