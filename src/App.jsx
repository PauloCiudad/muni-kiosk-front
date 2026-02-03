import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import BusquedaExpedientes from "./pages/BusquedaExpedientes";
import Login from "./pages/Login";
import Predial from "./pages/Predial";
import Vehicular from "./pages/Vehicular";
import Arbitrios from "./pages/Arbitrios";
import Transito from "./pages/Transito";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/busqueda-expedientes" element={<BusquedaExpedientes />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/predial" element={<Predial />} />
        <Route path="/vehicular" element={<Vehicular />} />
        <Route path="/arbitrios" element={<Arbitrios />} />
        <Route path="/transito" element={<Transito />} />

      </Routes>
    </BrowserRouter>
  );
}
