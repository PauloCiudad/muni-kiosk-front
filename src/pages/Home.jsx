import { useNavigate } from "react-router-dom";
import logo from "../assets/logos_juntos.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col">
      
      {/* HEADER / LOGO */}
      <header className="flex flex-col items-center justify-center py-10 px-4 bg-white shadow">
        <img
          src={logo}
          alt="Logo Municipalidad"
          className="w-full max-w-420px object-contain"
        />

        <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-slate-800 text-center">
          Kiosko Municipal
        </h1>
        <p className="mt-2 text-slate-500 text-lg text-center">
          Seleccione una opción
        </p>
      </header>

      {/* BOTONES */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div
          className="
            w-full 
            max-w-5xl 
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            gap-8
          "
        >
          {/* BOTÓN 1 */}
          <button
            onClick={() => navigate("/dashboard")}
            className="
              h-48
              rounded-3xl
              bg-blue-600
              text-white
              font-extrabold
              text-2xl
              shadow-xl
              active:scale-[0.97]
              active:bg-blue-800
              transition
              flex
              flex-col
              items-center
              justify-center
              gap-4
            "
          >
            <span className="text-5xl">🔍</span>
            <span>Búsqueda de Expedientes</span>
          </button>

          {/* BOTÓN 2 */}
          <button
            onClick={() => navigate("/dashboard")}
            className="
              h-48
              rounded-3xl
              bg-blue-600
              text-white
              font-extrabold
              text-2xl
              shadow-xl
              active:scale-[0.97]
              active:bg-blue-800
              transition
              flex
              flex-col
              items-center
              justify-center
              gap-4
            "
          >
            <span className="text-5xl">💳</span>
            <span className="text-center leading-tight">
              Expedientes<br />y Pagos
            </span>
          </button>

          {/* 
            👉 Aquí luego puedes agregar más botones
            Solo copia uno y listo
          */}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-4 text-center text-sm text-slate-400">
        Municipalidad Provincial de Arequipa
      </footer>
    </div>
  );
}
