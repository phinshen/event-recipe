import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { EventProvider } from "./contexts/EventContext";
import LandingPage from "./page/LandingPage";
import HomePage from "./page/HomePage";
import Navigation from "./components/Navigation";
import LoginPage from "./page/LoginPage";
import SignupPage from "./page/SignupPage";
import Footer from "./components/Footer";
import EventPage from "./page/EventPage";
import RecipePage from "./page/RecipePage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <BrowserRouter>
          <div className="app">
            <Navigation />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/events"
                  element={
                    <ProtectedRoute>
                      <EventPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recipes"
                  element={
                    <ProtectedRoute>
                      <RecipePage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </EventProvider>
    </AuthProvider>
  );
}
