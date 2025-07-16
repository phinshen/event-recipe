import { Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LandingPage from "./page/LandingPage";

export default function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <Router>
          <div className="App">
            <Navigation />
            <Routes>
              <Route path="/" element={<LandingPage />} />
            </Routes>
          </div>
        </Router>
      </EventProvider>
    </AuthProvider>
  );
}
