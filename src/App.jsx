import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import BusquedaExpedientes from "./pages/BusquedaExpedientes";
import Login from "./pages/Login";
import EstadoCuenta from "./pages/EstadoCuenta";
import BusquedaContribuyente from "./pages/BusquedaContribuyente";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/busqueda-expedientes" element={<BusquedaExpedientes />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/estado-cuenta" element={<EstadoCuenta />} />
        <Route path="/busqueda-contribuyente" element={<BusquedaContribuyente />} />

      </Routes>
    </BrowserRouter>
  );
}
