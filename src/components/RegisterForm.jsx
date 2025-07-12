import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import { Form, Container, Button } from "react-bootstrap";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignUp(event) {
    event.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration successful!");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <Container className="my-5">
      <h1>Sign Up</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Form onSubmit={handleSignUp}>
        <Form.Group className="my-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            className="w-50"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Form.Text>
            We&apos;ll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="my-3" controlId="password">
          <Form.Control
            className="w-50"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </Form.Group>

        <Button className="my-1" type="submit">
          Signup
        </Button>
        <div className="mt-3">
          <span className="text-muted">Already have an account? </span>
          <a href="/login" className="signup-link">
            Sign in
          </a>
        </div>
      </Form>
    </Container>
  );
}
