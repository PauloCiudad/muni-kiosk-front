import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BiArrowBack,
  BiHomeAlt2,
  BiCar,
  BiTrafficCone,
  BiBuildingHouse,
  BiChevronRight,
  BiExit,
  BiUserPlus,
  BiX,
} from "react-icons/bi";
import logo from "../assets/logos_juntos.png";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
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

function SummaryCard({ title, icon, amount, bgClass, onClick, subtitle }) {
  const hasAmount = amount !== null && amount !== undefined;

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
        select-none
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

        {hasAmount && (
          <div className="mt-3 text-4xl md:text-5xl font-extrabold">
            {formatPEN(amount)}
          </div>
        )}

        <div className="mt-2 text-white/85 text-lg">
          {subtitle || (hasAmount ? "Ver detalle" : "Acción")}
        </div>
      </div>
    </motion.button>
  );
}

export default function EstadoCuenta() {
  const navigate = useNavigate();
  const location = useLocation();

  // Recibimos data desde BusquedaContribuyente
  const contribuyente = location.state?.contribuyente || null;
  const deudas = location.state?.deudas || null;

  // Modal confirmación Salir
  const [confirmSalir, setConfirmSalir] = useState(false);

  // Si alguien entra directo sin state, lo mandamos a búsqueda
  if (!contribuyente || !deudas) {
    navigate("/busqueda-contribuyente", { replace: true });
    return null;
  }

  const total = useMemo(() => {
    return (
      Number(deudas.predial || 0) +
      Number(deudas.vehicular || 0) +
      Number(deudas.arbitrios || 0) +
      Number(deudas.transito || 0)
    );
  }, [deudas]);

  function goBack() {
    navigate(-1);
  }

  function handleNuevoContribuyente() {
    navigate("/busqueda-contribuyente");
  }

  function handleSalirClick() {
    setConfirmSalir(true);
  }

  function handleSalirConfirm() {
    setConfirmSalir(false);
    navigate("/"); // Home/Index
  }

  function handleSalirCancel() {
    setConfirmSalir(false);
  }

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
            onClick={goBack}
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
          className="flex-1 bg-slate-100 px-10 py-10 overflow-auto"
        >
          <div className="max-w-6xl mx-auto">
            {/* Datos contribuyente */}
            <motion.div
              variants={itemUp}
              className="
                bg-white shadow-2xl rounded-none p-10 border border-slate-200
                mb-10
              "
            >
              <div className="text-slate-500 text-xl">Contribuyente</div>
              <div className="text-slate-900 text-4xl font-extrabold mt-2 wrap-break-word">
                {contribuyente.nombreRazonSocial}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-8">
                <div className="text-slate-700 text-2xl">
                  <span className="font-extrabold">Código:</span>{" "}
                  {contribuyente.codigoContribuyente}
                </div>
                <div className="text-slate-700 text-2xl text-right">
                  <span className="font-extrabold">Documento:</span>{" "}
                  {contribuyente.tipoDoc} {contribuyente.nroDoc}
                </div>
              </div>
            </motion.div>

            {/* Total grande */}
            <motion.div
              variants={itemUp}
              className="
                bg-white
                shadow-2xl
                rounded-none
                p-10
                border border-slate-200
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
                    h-20 px-10
                    bg-amber-500 hover:bg-amber-600
                    text-white text-2xl font-extrabold
                    shadow-xl rounded-none
                    active:scale-[0.98]
                  "
                >
                  Ir al carrito
                </button>
              </div>
            </motion.div>

            {/* Cards 2x2 (Impuestos) */}
            <div className="grid grid-cols-2 gap-10">
              <SummaryCard
                title="Impuesto Predial"
                icon={<BiHomeAlt2 />}
                amount={deudas.predial}
                bgClass="bg-blue-700 hover:bg-blue-800"
                onClick={() => navigate("/predial")}
              />

              <SummaryCard
                title="Impuesto Vehicular"
                icon={<BiCar />}
                amount={deudas.vehicular}
                bgClass="bg-amber-500 hover:bg-amber-600"
                onClick={() => navigate("/vehicular")}
              />

              <SummaryCard
                title="Arbitrios Municipales"
                icon={<BiBuildingHouse />}
                amount={deudas.arbitrios}
                bgClass="bg-slate-700 hover:bg-slate-800"
                onClick={() => navigate("/arbitrios")}
              />

              <SummaryCard
                title="Infracciones de Tránsito"
                icon={<BiTrafficCone />}
                amount={deudas.transito}
                bgClass="bg-sky-700 hover:bg-sky-800"
                onClick={() => navigate("/transito")}
              />
            </div>

            {/* Botones GRANDES debajo (como los principales) */}
            <div className="grid grid-cols-2 gap-10 mt-12">
              <SummaryCard
                title="Buscar nuevo contribuyente"
                icon={<BiUserPlus />}
                amount={null}
                subtitle="Nueva búsqueda"
                bgClass="bg-slate-700 hover:bg-slate-800"
                onClick={handleNuevoContribuyente}
              />

              <SummaryCard
                title="Salir"
                icon={<BiExit />}
                amount={null}
                subtitle="Cerrar y volver al inicio"
                bgClass="bg-red-600 hover:bg-red-700"
                onClick={handleSalirClick}
              />
            </div>
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

      {/* MODAL CONFIRMACIÓN SALIR */}
      <AnimatePresence>
        {confirmSalir && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="
                w-full max-w-3xl
                bg-white
                rounded-none
                shadow-2xl
                border border-slate-200
                p-10
              "
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="text-slate-900 text-4xl font-extrabold">
                    ¿Desea salir?
                  </div>
                  <div className="mt-3 text-slate-600 text-2xl">
                    Se cerrará la consulta y volverá al inicio del kiosko.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSalirCancel}
                  className="
                    w-16 h-16
                    bg-slate-100 hover:bg-slate-200
                    text-slate-800 text-4xl
                    rounded-none
                    border border-slate-200
                    flex items-center justify-center
                    active:scale-[0.95]
                  "
                  aria-label="Cerrar"
                >
                  <BiX />
                </button>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-8">
                <button
                  type="button"
                  onClick={handleSalirCancel}
                  className="
                    h-24
                    bg-slate-700 hover:bg-slate-800
                    text-white
                    text-3xl
                    font-extrabold
                    shadow-xl
                    rounded-none
                    active:scale-[0.98]
                    inline-flex items-center justify-center gap-4
                  "
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSalirConfirm}
                  className="
                    h-24
                    bg-red-600 hover:bg-red-700
                    text-white
                    text-3xl
                    font-extrabold
                    shadow-xl
                    rounded-none
                    active:scale-[0.98]
                    inline-flex items-center justify-center gap-4
                  "
                >
                  <BiExit className="text-5xl" />
                  Salir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
