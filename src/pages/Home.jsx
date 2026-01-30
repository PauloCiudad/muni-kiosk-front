import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BiSearchAlt, BiCreditCard } from "react-icons/bi";
import logo from "../assets/logos_juntos.png";

/* Animaciones */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
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
      className="min-h-screen bg-slate-100 flex flex-col"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* HEADER */}
      <header className="flex flex-col items-center justify-center py-10 px-4 bg-white shadow">
        <motion.img
          variants={itemUp}
          src={logo}
          alt="Municipalidad Provincial de Arequipa"
          className="w-full max-w-420px object-contain"
        />

        <motion.h1
          variants={itemUp}
          className="mt-6 text-3xl md:text-4xl font-extrabold text-slate-800 text-center"
        >
          Kiosko Municipal
        </motion.h1>

        <motion.p
          variants={itemUp}
          className="mt-2 text-slate-500 text-lg text-center"
        >
          Seleccione una opción
        </motion.p>
      </header>

      {/* OPCIONES PRINCIPALES */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          className="
            mx-auto
            w-full
            max-w-4xl
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-20
            justify-items-center
          "
          variants={container}
        >
          {/* CONSULTA TRIBUTOS */}
          <motion.div
            variants={itemUp}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate("/busqueda-expedientes")}
            className="cursor-pointer flex flex-col items-center gap-6"
          >
            <div
              className="
                w-48
                h-48
                rounded-full
                border-4
                border-blue-600
                flex
                items-center
                justify-center
                text-blue-600
                bg-white
                shadow-md
              "
            >
              <BiSearchAlt className="text-[96px]" />
            </div>

            <span className="text-2xl font-extrabold text-blue-600 text-center">
              Búsqueda de Expedientes
            </span>
          </motion.div>

          {/* PAGOS EN LÍNEA */}
          <motion.div
            variants={itemUp}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate("/login")}
            className="cursor-pointer flex flex-col items-center gap-6"
          >
            <div
              className="
                w-48
                h-48
                rounded-full
                border-4
                border-blue-600
                flex
                items-center
                justify-center
                text-blue-600
                bg-white
                shadow-md
              "
            >
              <BiCreditCard className="text-[96px]" />
            </div>

            <span className="text-2xl font-extrabold text-blue-600 text-center">
              Pagos en Línea
            </span>
          </motion.div>
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