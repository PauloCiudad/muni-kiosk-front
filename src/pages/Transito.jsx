import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logos_juntos.png";
import {   BiCart, BiArrowBack, BiSearchAlt } from "react-icons/bi";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function Transito() {
  const navigate = useNavigate();
  const [nroPapeleta, setNroPapeleta] = useState("");
  const [placa, setPlaca] = useState("");
  const [dni, setDni] = useState("");

  // Temporary flag: S/D (sin documento). Set to `true` if you want inputs disabled
  const isSD = false;

  const [results, setResults] = useState([]);

  function handleBuscar(e) {
    e.preventDefault();

    // ✅ Frontend mock: luego esto se reemplaza por fetch a tu API
    const mock = [
      {
        id: 161,
        nro: 161,
        placa: placa || "V9M123",
        tipo_inf: "Multa de Tránsito",
        fecha_inf: "2024-01-15",
        fecha_venc: "2024-12-31",
        nombre_infractor: "JUAN PEREZ GOMEZ",
        total: 250.0,
        descuento: 70.0,
        pagado_cuenta: 0,
      },
      {
        id: 295,
        nro: 295,
        placa: placa || "BX0184",
        tipo_inf: "Multa de Tránsito",
        fecha_inf: "2024-02-20",
        fecha_venc: "2024-12-31",
        nombre_infractor: "MARIA LOPEZ DIAZ",
        total: 120.0,
        descuento: 40.0,
        pagado_cuenta: 20.0,
      },
    ];

    const computed = mock.map((r) => ({
      ...r,
      deuda:
        Number(r.total || 0) - Number(r.descuento || 0) -
        Number(r.pagado_cuenta || 0),
    }));

    setResults(computed);
  }
  

  return (
    <motion.div
      className="min-h-screen bg-slate-200 flex flex-col"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* HEADER */}
      <header className="relative flex flex-col items-center justify-center py-8 px-4 bg-white shadow">
        <motion.button
          variants={itemUp}
          onClick={() => navigate("/dashboard")}
          className="absolute left-4 top-4 w-12 h-12 rounded-xl bg-slate-100 text-2xl flex items-center justify-center active:scale-[0.95]"
          aria-label="Volver"
        >
          <BiArrowBack />
        </motion.button>

        <motion.button
          variants={itemUp}
          onClick={() => navigate("/carrito")}
          className="absolute right-4 top-4 w-12 h-12 rounded-xl bg-slate-100 text-2xl flex items-center justify-center active:scale-[0.95]"
          aria-label="Carrito"
        >
          <BiCart />
        </motion.button>

        <div className="flex flex-col items-center">
          <motion.img variants={itemUp} src={logo} alt="Logo" className="w-full max-w-[320px] object-contain" />

          <motion.h1
            variants={itemUp}
            className="mt-6 text-3xl md:text-4xl font-extrabold text-slate-800 text-center"
          >
            Infracciones de Tránsito
          </motion.h1>

          <motion.p
            variants={itemUp}
            className="mt-2 text-slate-500 text-lg text-center"
          >
            Busque por número de papeleta, placa o DNI
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
            {/* Nro Papeleta */}
            <motion.div variants={itemUp} className="flex flex-col gap-2">
              <label className="text-lg font-bold text-slate-700">
                Nro. Papeleta
              </label>
              <input
                value={nroPapeleta}
                onChange={(e) => setNroPapeleta(e.target.value)}
                disabled={isSD}
                placeholder={isSD ? "S/D usa 0 automáticamente" : "Ingrese Nro. Papeleta"}
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

            {/* DNI */}
            <motion.div variants={itemUp} className="flex flex-col gap-2">
              <label className="text-lg font-bold text-slate-700">
                DNI del infractor
              </label>
              <input
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                disabled={isSD}
                placeholder={isSD ? "S/D usa 0 automáticamente" : "Ingrese DNI del infractor"}
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
          </div>

          {/* Botón buscar */}
          <motion.div variants={itemUp} className="mt-6">
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="w-full h-16 rounded-2xl bg-blue-600 text-white text-xl font-extrabold shadow-lg active:bg-blue-800 transition"
              type="submit"
            >
              <BiSearchAlt className="inline mr-2" />
              Buscar
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
                  Ir al carrito <BiCart className="inline ml-2" />
                </button>
              </div>

              <div className="mt-4 overflow-auto">
                <table className="w-full min-w-900px border-separate border-spacing-0">
                  <thead>
                    <tr className="text-left text-slate-600">
                      <th className="py-3 px-3 font-extrabold">Seleccionar</th>
                      <th className="py-3 px-3 font-extrabold">Nro Infracción</th>                      
                      <th className="py-3 px-3 font-extrabold">Placa</th>
                      <th className="py-3 px-3 font-extrabold">Tipo Infracción</th> 
                      <th className="py-3 px-3 font-extrabold">Fecha Infracción</th>                      
                      <th className="py-3 px-3 font-extrabold">Fecha Vencimiento</th>                      
                      <th className="py-3 px-3 font-extrabold">Infractor</th>                      
                      <th className="py-3 px-3 font-extrabold">Total</th>                      
                      <th className="py-3 px-3 font-extrabold">Descuento</th>                      
                      <th className="py-3 px-3 font-extrabold">Pago a Cuenta</th>                      
                      <th className="py-3 px-3 font-extrabold">Deuda</th>                      
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
                        <td className="py-4 px-3">{r.nro}</td>                        
                        <td className="py-4 px-3 font-bold">{r.placa}</td>
                        <td className="py-4 px-3">{r.tipo_inf}</td>
                        <td className="py-4 px-3">{r.fecha_inf}</td>
                        <td className="py-4 px-3">{r.fecha_venc}</td>
                        <td className="py-4 px-3">{r.nombre_infractor}</td>
                        <td className="py-4 px-3 font-extrabold">
                          S/ {Number(r.total).toFixed(2)}
                        </td>
                        <td className="py-4 px-3 font-extrabold">
                          S/ {Number(r.descuento).toFixed(2)}
                        </td>
                        <td className="py-4 px-3 font-extrabold">
                          S/ {Number(r.pagado_cuenta).toFixed(2)}
                        </td>
                        <td className="py-4 px-3 font-extrabold">
                          S/ {Number(r.deuda).toFixed(2)}
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
