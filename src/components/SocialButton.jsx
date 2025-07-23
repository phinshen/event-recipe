import { Button } from "react-bootstrap";

const SocialLoginButton = ({ provider, onClick, loading, disabled }) => {
  const getProviderConfig = (provider) => {
    switch (provider) {
      case "google":
        return {
          icon: "🔍",
          text: "Continue with Google",
        };
    }
  };
};
