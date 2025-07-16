// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // check if user is logged in from localStorage
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//     setLoading(false);
//   }, []);

//   const login = (email, password) => {
//     // mock login - in real app, you would call an API
//     const mockUser = {
//       id: 1,
//       email: email,
//       name: email.split("@")[0],
//     };
//     setUser(mockUser);
//     localStorage.setItem("user", JSON.stringify(mockUser));
//     return Promise.resolve(mockUser);
//   };

//   const signup = (email, password, name) => {
//     // mock signup - in real app, youu would call an API
//     const mockUser = {
//       id: Date.now(),
//       email: email,
//       name: name,
//     };
//     setUser(mockUser);
//     localStorage.setItem("user", JSON.stringify(mockUser));
//     return Promise.resolve(mockUser);
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   const value = {
//     user,
//     login,
//     signup,
//     logout,
//     loading,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };
