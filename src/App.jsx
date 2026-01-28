import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import BusquedaExpedientes from "./pages/BusquedaExpedientes";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import Predial from "./pages/Predial";
import Vehicular from "./pages/Vehicular";
import Arbitrios from "./pages/Arbitrios";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/busqueda-expedientes" element={<BusquedaExpedientes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/predial" element={<Predial />} />
        <Route path="/vehicular" element={<Vehicular />} />
        <Route path="/arbitrios" element={<Arbitrios />} />

      </Routes>
    </BrowserRouter>
  );
}
