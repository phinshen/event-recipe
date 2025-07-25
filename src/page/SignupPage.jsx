import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SocialLoginButton from "../components/SocialLoginButton";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const getFirebaseErrorMessage = (errorCode) => {
    switch (errorCode) {
      case " auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/invalid-email":
        return "Please enter a valid email.";
      case "auth/operation-not-allowed":
        return "Email/password accounts are not enabled.";
      case "auth/weak-password":
        return "Password should be at least 6 characters long.";
      case "auth/popup-closed-by-user":
        return "Sign-up was cancelled. Please try again.";
      case "auth/popup-blocked":
        return "Pop-up was blocked. Please allow pop-ups and try again.";
      case "auth/cancelled-popup-request":
        return "Sign-up was cancelled.";
      default:
        return "An error occurred during sign-up. Please try again.";
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await signup(formData.email, formData.password, formData.name);
      navigate("/home");
    } catch (error) {
      setError(error, "Failed to create an account.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setError("");
      setSocialLoading(provider);

      let result;
      switch (provider) {
        case "google":
          result = await signInWithGoogle();
          break;
        default:
          throw new Error("Invalid provider");
      }

      if (result) {
        navigate("/home");
      }
    } catch (error) {
      setError(getFirebaseErrorMessage(error.code));
    } finally {
      setSocialLoading("");
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Create Account</h2>
                <p className="text-muted">
                  Join EventRecipe and start organizing your culinary events!
                </p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              {/* Social Login Buttons */}
              <div className="mb-4">
                <SocialLoginButton
                  provider="google"
                  onClick={() => handleSocialLogin("google")}
                  loading={socialLoading === "google"}
                  disabled={loading || socialLoading !== ""}
                />
              </div>

              {/* Divider */}
              <div className="text-center mb-4">
                <div className="d-flex align-items-center">
                  <hr className="flex-grow-1" />
                  <span className="px-3 text-muted small">OR</span>
                  <hr className="flex-grow-1" />
                </div>
              </div>

              {/* Registration Form */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-100 mb-3"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </Form>

              <div className="text-center">
                <p className="mb-0">
                  Already have an account?{" "}
                  <Link to="/login" className="text-decoration-none">
                    Sign in here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
