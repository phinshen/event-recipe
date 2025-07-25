import { useState, useRef } from "react";
import { Button, Alert, Image, Card } from "react-bootstrap";
import { validateImageFile } from "../utils/photoUpload";

const PhotoUpload = ({
  onPhotoSelect,
  selectedPhoto,
  error,
  disabled = false,
  title = "Add Photo",
  description = "Drag & drop an image here, or click to select",
  height = "250px",
}) => {
  const [preview, setPreview] = useState(selectedPhoto);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    if (!disabled) return;

    const file = event.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };
  const processFile = (file) => {
    try {
      validateImageFile(file);

      // create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);

      //pass file to parent
      onPhotoSelect(file);
    } catch (error) {
      onPhotoSelect(null, error.message);
    }
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    onPhotoSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="photo-upload">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        style={{ display: "none" }}
        disabled={disabled}
      />

      {preview ? (
        <Card className="border-0">
          <div className="position-relative">
            <Image
              src={preview || "/placeholder.svg"}
              alt="Photo preview"
              className="w-100"
              style={{
                height: height,
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            {!disabled && (
              <div className="position-absolute top-0 end-0 p-2">
                <Button
                  variant="danger"
                  size="sm"
                  className="rounded-circle"
                  onClick={handleRemovePhoto}
                  style={{ width: "32px", height: "32px", padding: "0" }}
                >
                  ×
                </Button>
              </div>
            )}
          </div>
          {!disabled && (
            <Card.Body className="text-center py-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleFileSelect}
              >
                📷 Change Photo
              </Button>
            </Card.Body>
          )}
        </Card>
      ) : (
        <div
          className={`text-center py-5 border rounded &{
                    dragOver ? "border-primary bg-light" : "border-dashed"} ${
                      disabled ? "bg-light" : ""
                    }`}
          style={{
            borderColor: dragOver ? "#007bff" : "#dee2e6",
            borderStyle: "dashed",
            borderWidth: "2px",
            cursor: disabled ? "not-allowed" : "pointer",
            transition: "all 0.2s ease-in-out",
          }}
          onClick={handleFileSelect}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mb-3">
            <span className="display-4">📷</span>
          </div>
          <h6 className="mb-2">{title}</h6>
          <p className="text-muted mb-3 small">
            {disabled ? "Photo upload disabled" : description}
          </p>
          {!disabled && (
            <Button variant="outline-primary" size="sm">
              Select Photo
            </Button>
          )}
          <div className="mt-2">
            <small className="text-muted">
              Supports: JPEG, PNG, WebP (Max: 5MB)
            </small>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="mt-2 mb-0">
          {error}
        </Alert>
      )}
    </div>
  );
};

export default PhotoUpload;
