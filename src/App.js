import "./App.css";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/login";
import Dashboard from "./components/Common/Dashboard"; // Layout component
import Users from "./pages/Admin/Users";
import Orders from "./pages/Admin/Orders";
import Inventory from "./pages/Admin/Inventory";
import Vendors from "./pages/Admin/Vendors";
import Products from "./pages/Admin/Products";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized/page";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Root route */}
        <Route 
          path="/" 
          element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          } 
        />

        {/* Dashboard layout route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Nested routes under the dashboard layout */}

          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={["Administrator"]}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="inventory"
            element={
              <ProtectedRoute allowedRoles={["Administrator"]}>
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="vendors"
            element={
              <ProtectedRoute allowedRoles={["Administrator"]}>
                <Vendors />
              </ProtectedRoute>
            }
          />
          <Route
            path="products"
            element={
              <ProtectedRoute allowedRoles={["Administrator", "Vendor"]}>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute allowedRoles={["Vendor", "Administrator"]}>
                <Orders />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Unauthorized route */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </div>
  );
}

export default App;
