import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BiHomeAlt,
  BiCar,
  BiMoney,
  BiTrafficCone,
  BiCart,
  BiArrowBack,
} from "react-icons/bi";

import logo from "../assets/logos_juntos.png"; // <-- usa tu logo nuevo aquí

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

// Colores inspirados en el escudo (aprox)
const COLORS = {
  azul: "#0B6FB3",
  azulProfundo: "#0A4A78",
  dorado: "#D4A83E",
  rojo: "#D62828",
};

function CircleTile({ icon, label, onClick, accent = COLORS.azul }) {
  return (
    <motion.div
      variants={itemUp}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className="cursor-pointer flex flex-col items-center gap-5 select-none"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
    >
      <div
        className="
          w-44 h-44
          rounded-full
          border-[5px]
          flex items-center justify-center
          bg-white
          shadow-md
        "
        style={{ borderColor: accent, color: accent }}
      >
        {icon}
      </div>

      <span
        className="text-xl sm:text-2xl font-extrabold text-center leading-tight"
        style={{ color: accent }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  // Luego lo conectamos al Context del carrito
  const cartCount = 0;

  return (
    <motion.div
      className="min-h-screen bg-slate-100 flex flex-col"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* HEADER */}
      <header className="relative flex flex-col items-center justify-center py-8 px-4 bg-white shadow">
        {/* Volver */}
        <motion.button
          variants={itemUp}
          onClick={() => navigate("/")}
          className="absolute left-4 top-4 w-12 h-12 rounded-xl bg-slate-100 text-2xl flex items-center justify-center active:scale-[0.95]"
          aria-label="Volver"
        >
          <BiArrowBack />
        </motion.button>

        {/* Carrito */}
        <motion.button
          variants={itemUp}
          onClick={() => navigate("/carrito")}
          className="absolute right-4 top-4 w-12 h-12 rounded-xl bg-slate-100 text-2xl flex items-center justify-center active:scale-[0.95]"
          aria-label="Carrito"
        >
          <BiCart />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 min-w-22px h-22px px-1 rounded-full bg-red-500 text-white text-xs font-extrabold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </motion.button>

        <motion.img variants={itemUp} src={logo} alt="Municipalidad Provincial de Arequipa" className="w-full max-w-[320px] object-contain" />

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
      </header>

      {/* OPCIONES (2 por fila) */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          className="
            mx-auto
            w-full
            max-w-4xl
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-14
            justify-items-center
          "
          variants={container}
        >
          <CircleTile
            icon={<BiHomeAlt className="text-[86px]" />}
            label={
              <>
                Impuesto <br /> Predial
              </>
            }
            accent={COLORS.dorado}
            onClick={() => navigate("/predial")}
          />

          <CircleTile
            icon={<BiCar className="text-[86px]" />}
            label={
              <>
                Impuesto <br /> Vehicular
              </>
            }
            accent={COLORS.azulProfundo}
            onClick={() => navigate("/vehicular")}
          />

          <CircleTile
            icon={<BiMoney className="text-[86px]" />}
            label={
              <>
                Arbitrios <br /> Municipales
              </>
            }
            accent={COLORS.azul}
            onClick={() => navigate("/arbitrios")}
          />

          <CircleTile
            icon={<BiTrafficCone className="text-[86px]" />}
            label={
              <>
                Infracciones <br /> de Tránsito
              </>
            }
            accent={COLORS.rojo}
            onClick={() => navigate("/transito")}
          />
        </motion.div>
      </main>

      {/* FOOTER */}
      <motion.footer variants={itemUp} className="py-4 text-center text-sm text-slate-400">
        Municipalidad Provincial de Arequipa
      </motion.footer>
    </motion.div>
  );
}
