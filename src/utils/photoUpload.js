import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../config/firebase";

// compress image before upload
const compressImage = (file, maxWidth = 400, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(resolve, "image/jpeg", quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

// validate image file - FIXED: "images/jpeg" -> "image/jpeg"
export const validateImageFile = (file) => {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    throw new Error("Please select a valid image file (JPEG, PNG, or WebP)");
  }

  if (file.size > maxSize) {
    throw new Error("Image size must be less than 5MB");
  }

  return true;
};

// upload event photo
export const uploadEventPhoto = async (file, userId, eventId) => {
  try {
    validateImageFile(file);
    const compressedFile = await compressImage(file, 800, 0.9);
    const photoRef = ref(
      storage,
      `event-photos/${userId}/${eventId}/${Date.now()}-event.jpg`
    );
    const snapshot = await uploadBytes(photoRef, compressedFile);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Error uploading event photo:", error);
    throw error;
  }
};

// upload recipe photo
export const uploadRecipePhoto = async (file, userId, recipeId) => {
  try {
    validateImageFile(file);
    const compressedFile = await compressImage(file, 600, 0.85);
    const photoRef = ref(
      storage,
      `recipe-photos/${userId}/${recipeId}/${Date.now()}-recipe.jpg`
    );
    const snapshot = await uploadBytes(photoRef, compressedFile);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Error uploading recipe photo:", error);
    throw error;
  }
};

// delete photo from storage
export const deletePhoto = async (photoURL) => {
  try {
    if (photoURL && photoURL.includes("firebase")) {
      const photoRef = ref(storage, photoURL);
      await deleteObject(photoRef);
    }
  } catch (error) {
    console.error("Error deleting photo:", error);
  }
};
