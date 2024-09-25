import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/home";
import Login from "./pages/Login/login";
import Dashboard from "./components/Admin/Dashboard";
import Users from "./pages/Admin/Users";
import DashboardManager from "./pages/Admin/DashboardManager";
import Orders from "./pages/Admin/Orders";
import Inventory from "./pages/Admin/Inventory";
import Vendors from "./pages/Admin/Vendors";
import Products from "./pages/Admin/Products";
import Settings from "./pages/Admin/Settings";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/dashboard/*" element={<Dashboard />}>
            <Route index element={<DashboardManager />} />
            <Route path="users" element={<Users />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
