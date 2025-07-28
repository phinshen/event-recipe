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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const getFirebaseErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email address.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "auth/popup-closed-by-user":
        return "Sign-in was cancelled. Please try again.";
      case "auth/popup-blocked":
        return "Pop-up was blocked. Please allow pop-ups and try again.";
      case "auth/cancelled-popup-request":
        return "Sign-in was cancelled.";
      default:
        return "An error occurred during sign-in. Please try again.";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/home");
    } catch (error) {
      setError(getFirebaseErrorMessage(error.code));
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
          throw new Error("Invalid Provider");
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
                {" "}
                {/* FIXED: was "text-conter" */}
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted">Sign in to your account</p>
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

              {/* Email/Password Form */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-100 mb-3"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?
                    <Link to="/signup" className="text-decoration-none">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
