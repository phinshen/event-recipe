import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import {
  googleProvider,
  facebookProvider,
  appleProvider,
  auth,
} from "../config/firebase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          providerData: user.providerData,
          metadata: user.metadata,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // email / password signup
  const signup = async (email, password, displayName) => {
    try {
      // create user with email and password
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // update profile with display name
      await updateProfile(result.user, {
        displayName: displayName,
      });
      // send email verification
      await sendEmailVerification(result.user);
      return result;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // email password login
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // google sign in
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  // facebook sign in
  const signInWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      return result;
    } catch (error) {
      console.error("Facebook sign-in error:", error);
      throw error;
    }
  };

  // apple sign in
  const signInWithApple = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      return result;
    } catch (error) {
      console.error("Apple sign-in error:", error);
      throw error;
    }
  };

  // logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = {
    user,
    signup,
    login,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
