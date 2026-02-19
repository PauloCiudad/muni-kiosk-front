import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BusquedaExpedientes from "./pages/BusquedaExpedientes";
import Login from "./pages/Login";
import EstadoCuenta from "./pages/EstadoCuenta";
import Consultas from "./pages/Consultas";
import Loginconsultas from "./pages/LoginConsultas";
import Checkout_pdf from "./pages/Checkout_pdf";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/busqueda-expedientes" element={<BusquedaExpedientes />} />
        <Route path="/login" element={<Login />} />

        <Route path="/estadocuenta" element={<EstadoCuenta />} />

        <Route path="/consultas" element={<Consultas />} />
        <Route path="/LoginConsultas" element={<Loginconsultas />} />
        <Route path="/checkout_pdf" element={<Checkout_pdf />} />

      </Routes>
    </BrowserRouter>
  );
}
