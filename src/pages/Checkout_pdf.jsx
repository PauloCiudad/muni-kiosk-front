import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BiArrowBack, BiTrash, BiCartAlt, BiSolidFilePdf, BiX } from "react-icons/bi";
import logo from "../assets/logos_juntos.png";
import { useCartStore } from "../store/cartStore";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

function formatPEN(amount) {
  const n = Number(amount || 0);
  return n.toLocaleString("es-PE", { style: "currency", currency: "PEN" });
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center px-4 py-2 bg-slate-100 border border-slate-200 text-slate-700 text-lg font-bold rounded-none">
      {children}
    </span>
  );
}

export default function Checkout_pdf() {
  const navigate = useNavigate();

  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);

  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmBuy, setConfirmBuy] = useState(false);

  const total = useMemo(
    () => items.reduce((acc, x) => acc + Number(x.amount || 0), 0),
    [items]
  );

  const grouped = useMemo(() => {
    const map = new Map();
    for (const it of items) {
      if (!map.has(it.service)) map.set(it.service, []);
      map.get(it.service).push(it);
    }
    return Array.from(map.entries());
  }, [items]);

  async function handleComprar() {
    setConfirmBuy(false);

    if (!items.length) return;

    // Aquí luego conectas el endpoint real de "generar orden" o "pagar"
    // Ejemplo: navigate("/pago", { state: { items } })
    alert(`Comprar: ${items.length} ítem(s) - Total: ${formatPEN(total)}`);
  }

  return (
    <motion.div className="w-screen h-screen bg-slate-200" variants={container} initial="hidden" animate="show">
      <div className="w-full h-full flex flex-col bg-white overflow-hidden">
        {/* HEADER */}
        <motion.header
          variants={itemUp}
          className="relative bg-linear-to-b from-white-100 to-slate-200 text-[#0F70B3] px-10 py-12 flex flex-col items-center gap-6 shadow"
        >
          <motion.button
            variants={itemUp}
            onClick={() => navigate(-1)}
            className="absolute left-8 top-8 w-16 h-16 bg-black/15 border border-black/35 text-black text-4xl flex items-center justify-center active:scale-[0.95]"
            aria-label="Volver"
            type="button"
          >
            <BiArrowBack />
          </motion.button>

          <img src={logo} alt="Logo" className="h-24 md:h-28 object-contain p-3" />

          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold">Envío a Correo</h1>
            <p className="text-[#0F70B3] text-xl md:text-2xl mt-2">Revise los conceptos seleccionados</p>
          </div>
        </motion.header>

        {/* BODY */}
        <motion.main variants={container} className="flex-1 bg-slate-100 px-10 py-10 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Resumen */}
            <motion.div
              variants={itemUp}
              className="bg-white shadow-2xl rounded-none p-10 border border-slate-200 flex items-center justify-between gap-8"
            >
              <div>
                <div className="text-slate-500 text-xl">Ítems seleccionados</div>
                <div className="text-slate-900 text-6xl font-extrabold mt-2">{items.length}</div>

                <div className="mt-6 flex flex-wrap gap-4">
                  <Pill>Total: {formatPEN(total)}</Pill>
                  <Pill>
                    <BiCartAlt className="mr-2 text-2xl" />
                    Consultas en Línea
                  </Pill>
                </div>
              </div>

              <div className="text-right flex flex-col gap-4 min-w-[320px]">
                <button
                  type="button"
                  onClick={() => setConfirmBuy(true)}
                  disabled={!items.length}
                  className={`h-20 px-8 text-white text-2xl font-extrabold shadow-xl rounded-none inline-flex items-center justify-center gap-4 active:scale-[0.98]
                    ${items.length ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-400 cursor-not-allowed"}
                  `}
                >
                  <BiSolidFilePdf className="text-4xl" />
                  Envíar PDF
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  disabled={!items.length}
                  className={`h-20 px-8 text-white text-2xl font-extrabold shadow-xl rounded-none inline-flex items-center justify-center gap-4 active:scale-[0.98]
                    ${items.length ? "bg-red-600 hover:bg-red-700" : "bg-slate-400 cursor-not-allowed"}
                  `}
                >
                  <BiTrash className="text-4xl" />
                  Vaciar carrito
                </button>
              </div>
            </motion.div>

            {/* Lista */}
            <motion.div variants={itemUp} className="mt-10">
              {!items.length ? (
                <div className="bg-white shadow-2xl rounded-none p-10 border border-slate-200 text-slate-700 text-2xl">
                  No hay ítems en el carrito. Regrese a Estado de Cuenta y seleccione conceptos.
                </div>
              ) : (
                <div className="flex flex-col gap-10">
                  {grouped.map(([service, list]) => (
                    <div key={service} className="bg-white shadow-2xl border border-slate-200 rounded-none p-10">
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <div className="text-slate-500 text-xl">Detalle</div>
                          <div className="text-slate-900 text-4xl font-extrabold mt-2">
                            {service === "predial"
                              ? "Impuesto Predial"
                              : service === "vehicular"
                              ? "Impuesto Vehicular"
                              : service === "arbitrios"
                              ? "Arbitrios Municipales"
                              : "Infracciones de Tránsito"}
                          </div>
                          <div className="mt-2 text-slate-600 text-xl">Ítems: {list.length}</div>
                        </div>

                        <div className="text-right">
                          <div className="text-slate-500 text-lg">Subtotal</div>
                          <div className="text-slate-900 text-4xl font-extrabold mt-2">
                            {formatPEN(list.reduce((a, x) => a + Number(x.amount || 0), 0))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-10 flex flex-col gap-6">
                        {list.map((it) => (
                          <div
                            key={it.key}
                            className="border border-slate-200 p-8 rounded-none flex items-start justify-between gap-8"
                          >
                            <div className="flex-1">
                              <div className="text-slate-900 text-2xl font-extrabold">{it.title}</div>

                              <div className="mt-4 flex flex-wrap gap-3">
                                {Object.entries(it.meta || {}).map(([k, v]) =>
                                  v ? (
                                    <Pill key={k}>
                                      <span className="text-slate-500 mr-2">{k}:</span>
                                      {String(v)}
                                    </Pill>
                                  ) : null
                                )}
                              </div>
                            </div>

                            <div className="text-right min-w-55">
                              <div className="text-slate-500 text-lg">Monto</div>
                              <div className="text-slate-900 text-4xl font-extrabold mt-2">{formatPEN(it.amount)}</div>

                              <button
                                type="button"
                                onClick={() => removeItem(it.key)}
                                className="mt-6 h-16 px-6 bg-slate-800 hover:bg-slate-900 text-white text-xl font-extrabold shadow rounded-none inline-flex items-center justify-center gap-3 active:scale-[0.98]"
                              >
                                <BiTrash className="text-2xl" />
                                Quitar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.main>

        <motion.footer variants={itemUp} className="py-6 text-center text-slate-400 text-base bg-white border-t">
          Municipalidad Provincial de Arequipa
        </motion.footer>
      </div>

      {/* MODAL VACIAR */}
      <AnimatePresence>
        {confirmClear && (
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
              className="w-full max-w-3xl bg-white rounded-none shadow-2xl border border-slate-200 p-10"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="text-slate-900 text-4xl font-extrabold">¿Vaciar el carrito?</div>
                  <div className="mt-3 text-slate-600 text-2xl">Se eliminarán todos los ítems seleccionados.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="w-16 h-16 bg-slate-100 hover:bg-slate-200 text-slate-800 text-4xl rounded-none border border-slate-200 flex items-center justify-center active:scale-[0.95]"
                  aria-label="Cerrar"
                >
                  <BiX />
                </button>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-8">
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="h-24 bg-slate-700 hover:bg-slate-800 text-white text-3xl font-extrabold shadow-xl rounded-none active:scale-[0.98]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clear();
                    setConfirmClear(false);
                  }}
                  className="h-24 bg-red-600 hover:bg-red-700 text-white text-3xl font-extrabold shadow-xl rounded-none active:scale-[0.98] inline-flex items-center justify-center gap-4"
                >
                  <BiTrash className="text-5xl" />
                  Vaciar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL COMPRAR */}
      <AnimatePresence>
        {confirmBuy && (
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
              className="w-full max-w-3xl bg-white rounded-none shadow-2xl border border-slate-200 p-10"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="text-slate-900 text-4xl font-extrabold">Confirmar compra</div>
                  <div className="mt-3 text-slate-600 text-2xl">
                    Total a pagar: <span className="font-extrabold">{formatPEN(total)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmBuy(false)}
                  className="w-16 h-16 bg-slate-100 hover:bg-slate-200 text-slate-800 text-4xl rounded-none border border-slate-200 flex items-center justify-center active:scale-[0.95]"
                  aria-label="Cerrar"
                >
                  <BiX />
                </button>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-8">
                <button
                  type="button"
                  onClick={() => setConfirmBuy(false)}
                  className="h-24 bg-slate-700 hover:bg-slate-800 text-white text-3xl font-extrabold shadow-xl rounded-none active:scale-[0.98]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleComprar}
                  className="h-24 bg-emerald-600 hover:bg-emerald-700 text-white text-3xl font-extrabold shadow-xl rounded-none active:scale-[0.98] inline-flex items-center justify-center gap-4"
                >
                  <BiSolidFilePdf className="text-5xl" />
                  Enviar PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}