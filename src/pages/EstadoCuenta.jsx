import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BiArrowBack,
  BiHomeAlt2,
  BiCar,
  BiTrafficCone,
  BiBuildingHouse,
  BiChevronRight,
} from "react-icons/bi";
import logo from "../assets/logos_juntos.png";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.10 } },
};

const itemUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

const clickSound = new Audio("/click.mp3");

function formatPEN(amount) {
  const n = Number(amount || 0);
  return n.toLocaleString("es-PE", { style: "currency", currency: "PEN" });
}

function SummaryCard({ title, icon, amount, bgClass, onClick }) {
  return (
    <motion.button
      type="button"
      variants={itemUp}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
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
        w-full
        min-h-60 md:min-h-70
        flex flex-col justify-between
        p-8
      `}
    >
      <span
        className="
          absolute inset-0
          -translate-x-full hover:translate-x-full
          transition-transform duration-700
          bg-linear-to-r from-transparent via-white/18 to-transparent
        "
      />

      <div className="relative flex items-start justify-between">
        <div className="text-6xl drop-shadow">{icon}</div>
        <div className="text-5xl text-white/60">
          <BiChevronRight />
        </div>
      </div>

      <div className="relative">
        <div className="text-2xl md:text-3xl font-extrabold leading-tight">
          {title}
        </div>
        <div className="mt-3 text-4xl md:text-5xl font-extrabold">
          {formatPEN(amount)}
        </div>
        <div className="mt-2 text-white/85 text-lg">
          Ver detalle
        </div>
      </div>
    </motion.button>
  );
}

export default function EstadoCuenta() {
  const navigate = useNavigate();

  // ✅ MOCKS (luego lo cambias por llamadas a API)
  const data = useMemo(() => {
    return {
      predial: 153.5,
      vehicular: 280.0,
      arbitrios: 95.0,
      transito: 120.0,
    };
  }, []);

  const total = useMemo(() => {
    return (
      Number(data.predial || 0) +
      Number(data.vehicular || 0) +
      Number(data.arbitrios || 0) +
      Number(data.transito || 0)
    );
  }, [data]);

  return (
    <motion.div
      className="w-screen h-screen bg-slate-200"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="w-full h-full flex flex-col bg-white overflow-hidden">
        {/* HEADER */}
        <motion.header
          variants={itemUp}
          className="
            relative
            bg-linear-to-b from-sky-600 to-blue-700
            text-white
            px-10 py-12
            flex flex-col items-center
            gap-6
            shadow
          "
        >
          <motion.button
            variants={itemUp}
            onClick={() => navigate(-1)}
            className="
              absolute left-8 top-8
              w-16 h-16
              bg-white/15 border border-white/25
              text-white text-4xl
              flex items-center justify-center
              active:scale-[0.95]
            "
            aria-label="Volver"
            type="button"
          >
            <BiArrowBack />
          </motion.button>

          <img
            src={logo}
            alt="Logo"
            className="h-24 md:h-28 object-contain bg-white/90 p-3"
          />

          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold">
              Estado de Cuenta
            </h1>
            <p className="text-white/85 text-xl md:text-2xl mt-2">
              Resumen de deudas pendientes
            </p>
          </div>
        </motion.header>

        {/* BODY */}
        <motion.main
          variants={container}
          className="flex-1 bg-slate-100 px-10 py-10"
        >
          {/* Total grande */}
          <motion.div
            variants={itemUp}
            className="
              bg-white
              shadow-2xl
              rounded-none
              p-10
              border
              border-slate-200
              flex items-center justify-between
              mb-10
            "
          >
            <div>
              <div className="text-slate-500 text-xl">Total pendiente</div>
              <div className="text-slate-900 text-6xl font-extrabold mt-2">
                {formatPEN(total)}
              </div>
            </div>

            <div className="text-right">
              <div className="text-slate-500 text-lg">Acción</div>
              <button
                type="button"
                onClick={() => navigate("/carrito")}
                className="
                  mt-3
                  h-20
                  px-10
                  bg-amber-500 hover:bg-amber-600
                  text-white
                  text-2xl
                  font-extrabold
                  shadow-xl
                  rounded-none
                  active:scale-[0.98]
                "
              >
                Ir al carrito
              </button>
            </div>
          </motion.div>

          {/* Cards 2x2 */}
          <div className="grid grid-cols-2 gap-10">
            <SummaryCard
              title="Impuesto Predial"
              icon={<BiHomeAlt2 />}
              amount={data.predial}
              bgClass="bg-blue-700 hover:bg-blue-800"
              onClick={() => navigate("/predial")}
            />

            <SummaryCard
              title="Impuesto Vehicular"
              icon={<BiCar />}
              amount={data.vehicular}
              bgClass="bg-amber-500 hover:bg-amber-600"
              onClick={() => navigate("/vehicular")}
            />

            <SummaryCard
              title="Arbitrios Municipales"
              icon={<BiBuildingHouse />}
              amount={data.arbitrios}
              bgClass="bg-slate-700 hover:bg-slate-800"
              onClick={() => navigate("/arbitrios")}
            />

            <SummaryCard
              title="Infracciones de Tránsito"
              icon={<BiTrafficCone />}
              amount={data.transito}
              bgClass="bg-sky-700 hover:bg-sky-800"
              onClick={() => navigate("/transito")}
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
