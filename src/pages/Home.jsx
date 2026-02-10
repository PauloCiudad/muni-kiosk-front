import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BiSearchAlt, BiCreditCard, BiSupport } from "react-icons/bi";

import logo from "../assets/logos_juntos.png";
import municipalidadImg from "../assets/municipalidad.png";

/* Sonido kiosko (opcional) */
const clickSound = new Audio("/click.mp3");

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

function MosaicTile({ icon, label, bgClass, onClick }) {
  return (
    <motion.button
      type="button"
      variants={itemUp}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => {
        try {
          clickSound.currentTime = 0;
          clickSound.play();
        } catch {}
        onClick?.();
      }}
      className={`
        relative overflow-hidden rounded-none
        ${bgClass}
        text-white
        shadow-xl hover:shadow-2xl transition
        flex flex-col items-center justify-center
        select-none
        min-h-85 md:min-h-105
      `}
    >
      {/* círculo decorativo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 md:w-72 md:h-72 rounded-full bg-white/15" />
      </div>

      {/* brillo */}
      <span
        className="
          absolute inset-0
          -translate-x-full hover:translate-x-full
          transition-transform duration-700
          bg-linear-to-r from-transparent via-white/20 to-transparent
        "
      />

      <motion.div
        whileHover={{ y: -10 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="z-10 text-8xl md:text-9xl drop-shadow-lg"
      >
        {icon}
      </motion.div>

      <div className="z-10 mt-5 text-2xl md:text-3xl font-extrabold text-center px-6">
        {label}
      </div>
    </motion.button>
  );
}

function PhotoTile() {
  return (
    <motion.div
      variants={itemUp}
      className="
        relative overflow-hidden rounded-none
        shadow-xl
        min-h-85 md:min-h-105
      "
    >
      <img
        src={municipalidadImg}
        alt="Municipalidad Provincial de Arequipa"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative h-full w-full flex items-end p-6">
        <div className="text-white font-extrabold text-xl md:text-2xl drop-shadow">
          Municipalidad Provincial de Arequipa
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="w-screen h-screen bg-slate-200"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* App full-screen (monitor vertical real) */}
      <div className="w-full h-full flex flex-col bg-white overflow-hidden">
        {/* HEADER */}
        <motion.header
          variants={itemUp}
          className="
            bg-linear-to-b from-white-100 to-slate-200
            text-[#0F70B3]
            px-10 py-12
            flex flex-col items-center
            gap-6
            shadow
          "
        >
          <img
            src={logo}
            alt="Logo"
            className="h-24 md:h-70 object-contain p-3"
          />

          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold">
              Municipalidad Provincial de Arequipa
            </h1>
            <p className="text-[#0F70B3] text-xl md:text-2xl mt-2">
              Seleccione una opción
            </p>
          </div>
        </motion.header>

        {/* MOSAICO */}
        <motion.main
          variants={container}
          className="flex-1 p-10 bg-slate-100"
        >
          <div className="grid grid-cols-2 gap-10 h-full">
            <MosaicTile
              bgClass="bg-[#FE982C] hover:bg-[#E58A20]"
              icon={<BiSearchAlt />}
              label="Búsqueda de expedientes"
              onClick={() => navigate("/busqueda-expedientes")}
            />

            <MosaicTile
              bgClass="bg-[#2E8FED] hover:bg-[#1F6FD9]"
              icon={<BiCreditCard />}
              label="Pagos en línea"
              onClick={() => navigate("/login")}
            />

            <PhotoTile />

            <MosaicTile
              bgClass="bg-[#1CB2B0] hover:bg-[#18979A]"
              icon={<BiSupport />}
              label="Consultas en línea"
              onClick={() => navigate("/consultas")}
            />
          </div>
        </motion.main>

        {/* FOOTER */}
        <motion.footer
          variants={itemUp}
          className="py-6 text-center text-slate-400 text-base bg-white border-t"
        >
          Municipalidad Provincial de Arequipa
        </motion.footer>
      </div>
    </motion.div>
  );
}
