import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BiSearchAlt, BiCreditCard, BiSupport } from "react-icons/bi";
import logo from "../assets/logos_juntos.png";

/* Animaciones base */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

/* Sonido kiosko */
const clickSound = new Audio("/click.mp3");

/* Colores institucionales */
const THEMES = {
  azul: {
    bg: "bg-blue-700",
    hover: "hover:bg-blue-800",
    ring: "hover:ring-blue-300",
  },
  dorado: {
    bg: "bg-amber-500",
    hover: "hover:bg-amber-600",
    ring: "hover:ring-amber-200",
  },
  gris: {
    bg: "bg-slate-600",
    hover: "hover:bg-slate-700",
    ring: "hover:ring-slate-300",
  },
};

function RectTile({ icon, label, onClick, theme }) {
  return (
    <motion.button
      type="button"
      variants={itemUp}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        try {
          clickSound.currentTime = 0;
          clickSound.play();
        } catch {}
        onClick();
      }}
      className={`
        relative
        w-90 h-55
        md:w-105 md:h-60
        lg:w-115 lg:h-65
        rounded-none
        overflow-hidden
        text-white
        shadow-2xl
        transition
        ${theme.bg} ${theme.hover}
        ring-0 hover:ring-4 ${theme.ring}
        flex flex-col items-center justify-center gap-6
        select-none
      `}
    >
      {/* Shine */}
      <span
        className="
          absolute inset-0
          -translate-x-full
          hover:translate-x-full
          transition-transform duration-700
          bg-linear-to-r from-transparent via-white/25 to-transparent
        "
      />

      {/* Icono */}
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="text-7xl md:text-8xl lg:text-9xl drop-shadow-xl z-10"
      >
        {icon}
      </motion.div>

      <div className="z-10 text-2xl md:text-3xl font-extrabold text-center px-6 leading-tight">
        {label}
      </div>
    </motion.button>
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="min-h-screen bg-slate-100 flex flex-col items-center"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* HEADER */}
      <motion.header
        variants={itemUp}
        className="w-full flex flex-col items-center py-10 bg-white shadow"
      >
        <img
          src={logo}
          alt="Municipalidad Provincial de Arequipa"
          className="w-full max-w-380px object-contain"
        />

        <h1 className="mt-6 text-4xl font-extrabold text-slate-800 text-center">
          Kiosko Municipal
        </h1>

        <p className="mt-2 text-slate-500 text-xl text-center">
          Seleccione una opción
        </p>
      </motion.header>

      {/* BOTONES */}
      <motion.main
        variants={container}
        className="flex-1 w-full flex items-center justify-center px-8 py-14"
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-10
            max-w-240
            w-full
            place-items-center
          "
        >
          <RectTile
            theme={THEMES.azul}
            icon={<BiSearchAlt />}
            label="Búsqueda de expedientes"
            onClick={() => navigate("/busqueda-expedientes")}
          />

          <RectTile
            theme={THEMES.dorado}
            icon={<BiCreditCard />}
            label="Pagos en línea"
            onClick={() => navigate("/login")}
          />

          <RectTile
            theme={THEMES.gris}
            icon={<BiSupport />}
            label="Consultas en línea"
            onClick={() => navigate("/consultas")}
          />
        </div>
      </motion.main>

      {/* FOOTER */}
      <motion.footer
        variants={itemUp}
        className="py-4 text-base text-slate-400 text-center"
      >
        Municipalidad Provincial de Arequipa
      </motion.footer>
    </motion.div>
  );
}
