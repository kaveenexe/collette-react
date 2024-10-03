import "./App.css";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Home";
import Login from "./pages/Login/login";
import Dashboard from "./components/Common/Dashboard"; // Layout component
import Users from "./pages/Admin/Users";
import OrderList from "./pages/Admin/Order/Orders";
import CreateOrder from "./pages/Admin/Order/CreateOrder";
import CancelOrders from "./pages/Admin/Order/CancelOrders";
import UpdateOrder from "./pages/Admin/Order/UpdateOrder";
import ViewOrder from "./pages/Admin/Order/ViewOrder";
import Inventory from "./pages/Admin/Inventory/Inventory";
import Categories from "./pages/Admin/Categories";
import Vendors from "./pages/Admin/UserManagement/Vendor/Vendors";
import CSR from "./pages/Admin/UserManagement/CSR/CSR";
import Customers from "./pages/CSR/Customer/Cusomers";
import Products from "./pages/Admin/Products";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized/page";
import Createproduct from "./components/product/Createproduct";
import Notfound from "./pages/Unauthorized/Notfound";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/createproduct"
          element={
            <ProtectedRoute allowedRoles={["Vendor", "Administrator"]}>
              <Createproduct />
            </ProtectedRoute>
          }
        />

        {/* Root route */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/" />
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
            path="vendor-management"
            element={
              <ProtectedRoute allowedRoles={["Administrator"]}>
                <Vendors />
              </ProtectedRoute>
            }
          />
          <Route
            path="csr-management"
            element={
              <ProtectedRoute allowedRoles={["Administrator"]}>
                <CSR />
              </ProtectedRoute>
            }
          />
          <Route
            path="customer-management"
            element={
              <ProtectedRoute allowedRoles={["Administrator", "CSR"]}>
                <Customers />
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
              <ProtectedRoute allowedRoles={["Vendor", "Administrator", "CSR"]}>
                <OrderList />
              </ProtectedRoute>
            }
          />
          <Route
            path="create-order"
            element={
              <ProtectedRoute allowedRoles={["Administrator"]}>
                <CreateOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="update-order/:id"
            element={
              <ProtectedRoute allowedRoles={["Vendor", "Administrator", "CSR"]}>
                <UpdateOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="cancel-orders"
            element={
              <ProtectedRoute allowedRoles={["CSR", "Administrator"]}>
                <CancelOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="view-order/:id"
            element={
              <ProtectedRoute allowedRoles={["CSR", "Administrator", "Vendor"]}>
                <ViewOrder />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Unauthorized route */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/*" element={<Notfound />} />
      </Routes>
    </div>
  );
}

export default App;
