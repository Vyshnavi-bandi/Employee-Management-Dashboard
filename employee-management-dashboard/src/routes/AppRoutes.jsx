import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import { Dashboard } from "../pages/Dashboard";
import { Employees } from "../pages/Employees";
import ProtectedRoute from "./ProtectedRoute";
import { Login } from "../pages/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
