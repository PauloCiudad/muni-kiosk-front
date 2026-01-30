import { useMemo, useState } from "react";
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

const DOC_TYPES = [
  { value: "1", label: "DNI" },
  { value: "2", label: "RUC" },
  { value: "3", label: "Pasaporte" },
  { value: "4", label: "Carnet Extranjería" },
  { value: "5", label: "S/D" },
];

export default function Vehicular() {
  const navigate = useNavigate();

  const [tipoDoc, setTipoDoc] = useState("1");
  const [nroDoc, setNroDoc] = useState("");
  const [placa, setPlaca] = useState("");

  const [results, setResults] = useState([]);

  const isSD = tipoDoc === "5";

  function handleBuscar(e) {
    e.preventDefault();

    // ✅ Frontend mock: luego esto se reemplaza por fetch a tu API
    const mock = [
      {
        id: 1,
        placa: placa || "V9M123",
        nombre_razon_social: "JUAN PEREZ GOMEZ",
        direccion: "AV. EJEMPLO 123",
        tipo_doc: tipoDoc,
        nro_doc: isSD ? "0" : (nroDoc || "00000000"),
        monto: 350.75,
        pagado: 0,
      },
      {
        id: 2,
        placa: placa || "BX0184",
        nombre_razon_social: "MARIA LOPEZ DIAZ",
        direccion: "JR. PRUEBA 456",
        tipo_doc: tipoDoc,
        nro_doc: isSD ? "0" : (nroDoc || "00000000"),
        monto: 120.0,
        pagado: 0,
      },
    ];

    setResults(mock);
  }

  const tipoDocLabel = useMemo(() => {
    return DOC_TYPES.find((d) => d.value === tipoDoc)?.label ?? "";
  }, [tipoDoc]);

  return (
    <motion.div
      className="min-h-screen bg-slate-200 flex flex-col"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* HEADER */}
      <header className="relative bg-white shadow px-4 py-6">
        <motion.button
          variants={itemUp}
          onClick={() => navigate("/dashboard")}
          className="absolute left-4 top-4 w-12 h-12 rounded-xl bg-slate-100 text-2xl flex items-center justify-center active:scale-[0.95]"
          aria-label="Volver"
        >
          ⬅
        </motion.button>

        <motion.button
          variants={itemUp}
          onClick={() => navigate("/carrito")}
          className="absolute right-4 top-4 w-12 h-12 rounded-xl bg-slate-100 text-2xl flex items-center justify-center active:scale-[0.95]"
          aria-label="Carrito"
        >
          🛒
        </motion.button>

        <div className="flex flex-col items-center">
          <motion.img
            variants={itemUp}
            src={logo}
            alt="Logo"
            className="w-full max-w-340px object-contain"
          />

          <motion.h1
            variants={itemUp}
            className="mt-6 text-3xl md:text-4xl font-extrabold text-slate-800 text-center"
          >
            Impuesto Vehicular
          </motion.h1>

          <motion.p
            variants={itemUp}
            className="mt-2 text-slate-500 text-lg text-center"
          >
            Busque por documento o placa
          </motion.p>
        </div>
      </header>

      {/* FORM */}
      <main className="flex-1 px-6 py-10 flex flex-col items-center">
        <motion.form
          onSubmit={handleBuscar}
          className="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-6"
          variants={container}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tipo Doc */}
            <motion.div variants={itemUp} className="flex flex-col gap-2">
              <label className="text-lg font-bold text-slate-700">
                Tipo de Documento
              </label>
              <select
                value={tipoDoc}
                onChange={(e) => setTipoDoc(e.target.value)}
                className="h-14 rounded-xl border border-slate-300 px-4 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DOC_TYPES.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Nro Doc */}
            <motion.div variants={itemUp} className="flex flex-col gap-2">
              <label className="text-lg font-bold text-slate-700">
                Nro. Documento
              </label>
              <input
                value={nroDoc}
                onChange={(e) => setNroDoc(e.target.value)}
                disabled={isSD}
                placeholder={isSD ? "S/D usa 0 automáticamente" : "Ingrese Nro. Documento"}
                className={`h-14 rounded-xl border px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isSD
                    ? "border-slate-200 bg-slate-100 text-slate-400"
                    : "border-slate-300 bg-white"
                }`}
              />
              {isSD && (
                <div className="text-xs text-slate-500">
                  * S/D significa sin documento, se enviará nro_doc = 0
                </div>
              )}
            </motion.div>

            {/* Placa */}
            <motion.div variants={itemUp} className="flex flex-col gap-2">
              <label className="text-lg font-bold text-slate-700">
                Placa
              </label>
              <input
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
                placeholder="Ej. V9M123"
                className="h-14 rounded-xl border border-slate-300 px-4 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>
          </div>

          {/* Botón buscar */}
          <motion.div variants={itemUp} className="mt-6">
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="w-full h-16 rounded-2xl bg-blue-600 text-white text-xl font-extrabold shadow-lg active:bg-blue-800 transition"
              type="submit"
            >
              🔍 Buscar
            </motion.button>
          </motion.div>
        </motion.form>

        {/* RESULTADOS */}
        {results.length > 0 && (
          <motion.div
            className="w-full max-w-5xl mt-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-extrabold text-slate-800">
                  Resultados
                </h2>
                <button
                  onClick={() => navigate("/carrito")}
                  className="h-12 px-5 rounded-2xl bg-slate-100 text-slate-800 font-extrabold active:scale-[0.98]"
                  type="button"
                >
                  Ir al carrito 🛒
                </button>
              </div>

              <div className="mt-4 overflow-auto">
                <table className="w-full min-w-900px border-separate border-spacing-0">
                  <thead>
                    <tr className="text-left text-slate-600">
                      <th className="py-3 px-3 font-extrabold">Seleccionar</th>
                      <th className="py-3 px-3 font-extrabold">Placa</th>
                      <th className="py-3 px-3 font-extrabold">Nombre / Razón Social</th>
                      <th className="py-3 px-3 font-extrabold">Dirección</th>
                      <th className="py-3 px-3 font-extrabold">Documento</th>
                      <th className="py-3 px-3 font-extrabold">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr key={r.id} className="border-t border-slate-200">
                        <td className="py-4 px-3">
                          <input
                            type="checkbox"
                            className="w-6 h-6 accent-blue-600"
                          />
                        </td>
                        <td className="py-4 px-3 font-bold">{r.placa}</td>
                        <td className="py-4 px-3">{r.nombre_razon_social}</td>
                        <td className="py-4 px-3">{r.direccion}</td>
                        <td className="py-4 px-3">
                          {tipoDocLabel} - {r.nro_doc}
                        </td>
                        <td className="py-4 px-3 font-extrabold">
                          S/ {Number(r.monto).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-sm text-slate-500">
                * Los registros “pagados” no se mostrarán (eso lo aplicaremos al conectar con el backend).
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <motion.footer variants={itemUp} className="py-4 text-center text-sm text-slate-400">
        Municipalidad Provincial de Arequipa
      </motion.footer>
    </motion.div>
  );
}
