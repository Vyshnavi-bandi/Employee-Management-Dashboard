import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem("isAuth");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};
