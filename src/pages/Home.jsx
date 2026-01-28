import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logos_juntos.png";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="min-h-screen bg-slate-200 flex flex-col"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* HEADER / LOGO */}
      <header className="flex flex-col items-center justify-center py-10 px-4 bg-white shadow">
        <motion.img
          src={logo}
          alt="Logo Municipalidad"
          className="w-full max-w-420px object-contain"
          variants={itemUp}
        />

        <motion.h1
          className="mt-6 text-3xl md:text-4xl font-extrabold text-slate-800 text-center"
          variants={itemUp}
        >
          Kiosko Multimedia
        </motion.h1>

        <motion.p
          className="mt-2 text-slate-500 text-lg text-center"
          variants={itemUp}
        >
          Seleccione una opción
        </motion.p>
      </header>

      {/* BOTONES */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          className="mx-auto
                    w-full
                    max-w-4xl
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-10
                    justify-items-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* BOTÓN 1 */}
          <motion.button
            variants={itemUp}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/busqueda-expedientes")}
            className="
              w-full
              max-w-420px
              h-56
              rounded-3xl
              bg-blue-600
              text-white
              font-extrabold
              text-3xl
              shadow-xl
              flex
              flex-col
              items-center
              justify-center
              gap-5
              transition
            "
          >
            <span className="text-6xl">🔍</span>
            <span className="text-center leading-tight">Búsqueda Expedientes</span>
          </motion.button>

          {/* BOTÓN 2 */}
          <motion.button
            variants={itemUp}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/login")}
            className="
              w-full
              max-w-420px
              h-56
              rounded-3xl
              bg-blue-600
              text-white
              font-extrabold
              text-3xl
              shadow-xl
              flex
              flex-col
              items-center
              justify-center
              gap-5
              transition
            "
          >
            <span className="text-6xl">💳</span>
            <span className="text-center leading-tight">Pagos en Línea</span>
          </motion.button>

          {/* Aquí luego agregas más botones */}
        </motion.div>
      </main>

      {/* FOOTER */}
      <motion.footer
        className="py-4 text-center text-sm text-slate-400"
        variants={itemUp}
      >
        Municipalidad Provincial de Arequipa
      </motion.footer>
    </motion.div>
  );
}
