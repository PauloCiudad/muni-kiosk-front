import { useNavigate } from "react-router-dom";
import logo from "../assets/logos_juntos.png";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="relative p-5 border-b border-slate-200 bg-linear-to-b from-white to-slate-50">
          <button
            onClick={() => navigate("/")}
            className="absolute left-4 top-4 w-12 h-12 rounded-xl bg-slate-100 active:scale-[0.98] transition flex items-center justify-center text-2xl"
            aria-label="Volver"
          >
            ⬅
          </button>

          <div className="flex justify-center">
            <img src={logo} alt="Logo" className="w-full max-w-220px object-contain" />
          </div>

          <div className="mt-3 text-center">
            <div className="text-xl font-extrabold text-slate-800">Menú</div>
            <div className="text-slate-500">Seleccione una opción</div>
          </div>
        </div>

        {/* Opciones */}
        <div className="p-6 flex flex-col gap-4">
          <button
            onClick={() => navigate("/predial")}
            className="h-24 rounded-2xl bg-blue-600 text-white font-extrabold text-xl shadow-lg active:scale-[0.98] active:bg-blue-800 transition flex items-center px-6"
          >
            <span className="text-3xl">🏠</span>
            <span className="ml-4 flex-1 text-left">Impuesto Predial</span>
            <span className="text-3xl opacity-80">›</span>
          </button>

          <button
            onClick={() => navigate("/vehicular")}
            className="h-24 rounded-2xl bg-blue-600 text-white font-extrabold text-xl shadow-lg active:scale-[0.98] active:bg-blue-800 transition flex items-center px-6"
          >
            <span className="text-3xl">🚗</span>
            <span className="ml-4 flex-1 text-left">Impuesto Vehicular</span>
            <span className="text-3xl opacity-80">›</span>
          </button>

          <button
            onClick={() => navigate("/arbitrios")}
            className="h-24 rounded-2xl bg-blue-600 text-white font-extrabold text-xl shadow-lg active:scale-[0.98] active:bg-blue-800 transition flex items-center px-6"
          >
            <span className="text-3xl">💳</span>
            <span className="ml-4 flex-1 text-left">Arbitrios Municipales owo</span>
            <span className="text-3xl opacity-80">›</span>
          </button>

          <button
            onClick={() => navigate("/transito")}
            className="h-24 rounded-2xl bg-blue-600 text-white font-extrabold text-xl shadow-lg active:scale-[0.98] active:bg-blue-800 transition flex items-center px-6"
          >
            <span className="text-3xl">🆘</span>
            <span className="ml-4 flex-1 text-left">Infracciones de Tránsito</span>
            <span className="text-3xl opacity-80">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
