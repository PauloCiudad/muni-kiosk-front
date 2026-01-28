import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import BusquedaExpedientes from "./pages/BusquedaExpedientes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/busqueda-expedientes" element={<BusquedaExpedientes />} />
        {/* Estas rutas las crearemos después */}
        <Route path="/predial" element={<div className="p-10">Predial (pendiente)</div>} />
        <Route path="/vehicular" element={<div className="p-10">Vehicular (pendiente)</div>} />
        <Route path="/arbitrios" element={<div className="p-10">Arbitrios (pendiente)</div>} />
        <Route path="/transito" element={<div className="p-10">Tránsito (pendiente)</div>} />

      </Routes>
    </BrowserRouter>
  );
}
