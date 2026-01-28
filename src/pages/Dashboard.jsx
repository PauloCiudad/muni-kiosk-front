import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logos_juntos.png";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const navigate = useNavigate();

  // Luego lo reemplazamos por estado real del carrito (Context)
  const cartCount = 0;

  return (
    <motion.div
      className="min-h-screen bg-slate-200 flex flex-col"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* HEADER */}
      <header className="relative bg-white shadow px-4 py-6">
        {/* Botón volver */}
        <motion.button
          variants={itemUp}
          onClick={() => navigate("/")}
          className="absolute left-4 top-4 w-12 h-12 rounded-xl bg-slate-100 text-2xl flex items-center justify-center active:scale-[0.95]"
          aria-label="Volver"
        >
          ⬅
        </motion.button>

        {/* Carrito */}
        <motion.button
          variants={itemUp}
          onClick={() => navigate("/carrito")}
          className="right-4 top-4 w-12 h-12 rounded-xl bg-slate-100 text-2xl flex items-center justify-center active:scale-[0.95] relative"
          aria-label="Carrito"
        >
          🛒
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 min-w-22px h-22px px-1 rounded-full bg-red-500 text-white text-xs font-extrabold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </motion.button>

        <div className="flex flex-col items-center">
          <motion.img
            variants={itemUp}
            src={logo}
            alt="Logo"
            className="w-full max-w-380px object-contain"
          />

          <motion.h1
            variants={itemUp}
            className="mt-6 text-3xl md:text-4xl font-extrabold text-slate-800 text-center"
          >
            Menú Principal
          </motion.h1>

          <motion.p
            variants={itemUp}
            className="mt-2 text-slate-500 text-lg text-center"
          >
            Seleccione una opción
          </motion.p>
        </div>
      </header>

      {/* OPCIONES */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.div
          className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-8"
          variants={container}
        >
          <motion.button
            variants={itemUp}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/predial")}
            className="h-44 rounded-3xl bg-blue-600 text-white font-extrabold text-2xl shadow-xl flex items-center justify-between px-8"
          >
            <span className="text-5xl">🏠</span>
            <span className="flex-1 text-left ml-6">Impuesto Predial</span>
            <span className="text-4xl opacity-80">›</span>
          </motion.button>

          <motion.button
            variants={itemUp}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/vehicular")}
            className="h-44 rounded-3xl bg-blue-600 text-white font-extrabold text-2xl shadow-xl flex items-center justify-between px-8"
          >
            <span className="text-5xl">🚗</span>
            <span className="flex-1 text-left ml-6">Impuesto Vehicular</span>
            <span className="text-4xl opacity-80">›</span>
          </motion.button>

          <motion.button
            variants={itemUp}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/arbitrios")}
            className="h-44 rounded-3xl bg-blue-600 text-white font-extrabold text-2xl shadow-xl flex items-center justify-between px-8"
          >
            <span className="text-5xl">💳</span>
            <span className="flex-1 text-left ml-6">Arbitrios Municipales</span>
            <span className="text-4xl opacity-80">›</span>
          </motion.button>

          <motion.button
            variants={itemUp}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/transito")}
            className="h-44 rounded-3xl bg-blue-600 text-white font-extrabold text-2xl shadow-xl flex items-center justify-between px-8"
          >
            <span className="text-5xl">🆘</span>
            <span className="flex-1 text-left ml-6">Infracciones de Tránsito</span>
            <span className="text-4xl opacity-80">›</span>
          </motion.button>

          {/* Ejemplo: botón salir (si luego usas auth real) */}
          <motion.button
            variants={itemUp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/")}
            className="h-24 sm:col-span-2 rounded-3xl bg-red-600 text-white font-extrabold text-2xl shadow-xl flex items-center justify-center gap-3"
          >
            <span className="text-3xl">⬅</span>
            <span>Salir</span>
          </motion.button>
        </motion.div>
      </main>

      {/* FOOTER */}
      <motion.footer
        variants={itemUp}
        className="py-4 text-center text-sm text-slate-400"
      >
        Municipalidad Provincial de Arequipa
      </motion.footer>
    </motion.div>
  );
}
