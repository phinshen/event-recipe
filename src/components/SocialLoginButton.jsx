import { Button } from "react-bootstrap";

const SocialLoginButton = ({ provider, onClick, loading, disabled }) => {
  const getProviderConfig = (provider) => {
    switch (provider) {
      case "google":
        return {
          icon: "🔍",
          text: "Continue with Google",
          bgColor: "#4285f4",
          textColor: "white",
        };
      default:
        return {
          icon: "🔐",
          text: "Continue",
          bgColor: "#6c757d",
          textColor: "white",
        };
    }
  };

  const config = getProviderConfig(provider);

  return (
    <Button
      variant="outline-dark"
      className="w-100 mb-3 social-login-btn"
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.bgColor,
        color: config.textColor,
        height: "48px",
        fontSize: "16px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        transition: "all 0.2s ease-in-out",
      }}
    >
      <span style={{ fontSize: "20px" }}>{config.icon}</span>
      {loading ? "Signing in..." : config.text}
    </Button>
  );
};

export default SocialLoginButton;
