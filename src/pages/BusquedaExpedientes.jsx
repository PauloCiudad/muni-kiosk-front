import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logos_juntos.png";
import {
  BiSearchAlt,
  BiArrowBack,
  BiLoaderAlt,
  BiXCircle,
} from "react-icons/bi";

/* Animaciones */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const API_BASE =
  import.meta.env.VITE_API_EXPEDIENTES_URL ||
  "http://172.16.1.13:8083/api_std_prueba";

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}


// Función Web 2: Formulario para búsqueda de expedientes
// Permite ingresar número de expediente y año
export default function BusquedaExpedientes() {
  const navigate = useNavigate();
  const abortRef = useRef(null);

  const [nroExpediente, setNroExpediente] = useState("");
  const [anho, setAnho] = useState("2025");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  function handleChangeExpediente(e) {
    const value = onlyDigits(e.target.value).slice(0, 9);
    setNroExpediente(value);
  }

  function handleBlurExpediente() {
    if (!nroExpediente) return;
    setNroExpediente(nroExpediente.padStart(9, "0"));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setResultado(null);

    const nro = onlyDigits(nroExpediente);
    const year = anho.trim();

    if (!nro) {
      setError("Ingrese el número de expediente.");
      return;
    }

    if (!year || !/^\d{4}$/.test(year)) {
      setError("Ingrese un año válido de 4 dígitos.");
      return;
    }

    const nroFormateado = nro.padStart(9, "0");

    try {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      setLoading(true);

      const url = `${API_BASE}/consultar_documento?nro_expediente=${encodeURIComponent(
        nroFormateado
      )}&anho=${encodeURIComponent(year)}`;

      const response = await fetch(url, {
        method: "POST",
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        setError("No se encontraron resultados para el expediente consultado.");
        return;
      }

      setResultado(data[0]);
      setNroExpediente(nroFormateado);
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error(err);
      setError("No se pudo consultar el expediente. Verifique la conexión con la API.");
    } finally {
      setLoading(false);
    }
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
          onClick={() => navigate("/")}
          className="absolute left-4 top-4 w-12 h-12 rounded-xl bg-slate-100 text-2xl flex items-center justify-center active:scale-[0.95]"
          type="button"
          aria-label="Volver"
        >
          <BiArrowBack />
        </motion.button>

        <motion.img
          src={logo}
          alt="Logo Municipalidad"
          className="w-full max-w-[320px] object-contain"
          variants={itemUp}
        />

        <motion.h1
          className="mt-6 text-2xl font-extrabold text-slate-800 text-center"
          variants={itemUp}
        >
          Búsqueda de Expedientes
        </motion.h1>

        <motion.p
          className="mt-1 text-slate-500 text-center"
          variants={itemUp}
        >
          Ingrese los datos del expediente
        </motion.p>
      </header>

      {/* CONTENIDO */}
      <main className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          {/* FORMULARIO */}
          <motion.form
            onSubmit={handleSubmit}
            className="w-full bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-6"
            variants={container}
          >
            <motion.div variants={itemUp} className="flex flex-col gap-2">
              <label className="text-lg font-bold text-slate-700">
                Nro. de Expediente
              </label>
              <input
                type="text"
                value={nroExpediente}
                onChange={handleChangeExpediente}
                onBlur={handleBlurExpediente}
                placeholder="Ej. 000000001"
                inputMode="numeric"
                maxLength={9}
                className="h-14 rounded-xl border border-slate-300 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-sm text-slate-400">
                Se completará automáticamente a 9 dígitos.
              </div>
            </motion.div>

            <motion.div variants={itemUp} className="flex flex-col gap-2">
              <label className="text-lg font-bold text-slate-700">Año</label>
              <input
                type="number"
                value={anho}
                onChange={(e) => setAnho(e.target.value)}
                placeholder="Ej. 2025"
                className="h-14 rounded-xl border border-slate-300 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>

            {error ? (
              <motion.div
                variants={itemUp}
                className="rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-base font-semibold flex items-start gap-2"
              >
                <BiXCircle className="text-2xl shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            ) : null}

            <motion.button
              variants={itemUp}
              whileTap={{ scale: 0.96 }}
              className={`h-16 rounded-2xl text-white text-xl font-extrabold shadow-lg transition inline-flex items-center justify-center gap-2
                ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-blue-600 active:bg-blue-800"
                }`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <BiLoaderAlt className="text-2xl animate-spin" />
                  Consultando...
                </>
              ) : (
                <>
                  <BiSearchAlt className="text-2xl" />
                  Buscar
                </>
              )}
            </motion.button>
          </motion.form>

          {/* RESULTADO */}
          <motion.div
            variants={container}
            className="w-full bg-white rounded-3xl shadow-xl p-6 overflow-x-auto"
          >
            {!resultado && !loading ? (
              <motion.div
                variants={itemUp}
                className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-500 text-center px-6 py-10 min-h-70"
              >
                Ingrese el número de expediente y el año para consultar la información.
              </motion.div>
            ) : null}

            {resultado ? (
              <motion.div variants={container} className="flex flex-col gap-6">
                {/* TÍTULO */}
                <motion.div variants={itemUp}>
                  <h2 className="text-3xl font-extrabold text-blue-700">
                    Resultados de la Búsqueda
                  </h2>

                  <div className="mt-4 text-slate-700 font-semibold text-lg">
                    Nro. de expediente:
                    <span className="ml-3 font-bold text-slate-900">
                      {resultado.doc_vnro_expediente}-{resultado.doc_vanio_expediente}
                    </span>
                  </div>
                </motion.div>

                {/* TABLA */}
                <motion.div variants={itemUp} className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-275">
                    <thead>
                      <tr className="border-b-2 border-slate-300 text-slate-700">
                        <th className="px-3 py-3 text-left font-bold text-base">Expediente</th>
                        <th className="px-3 py-3 text-left font-bold text-base">Asunto</th>
                        <th className="px-3 py-3 text-left font-bold text-base">Administrado</th>
                        <th className="px-3 py-3 text-left font-bold text-base">Documento</th>
                        <th className="px-3 py-3 text-left font-bold text-base">Estado</th>
                        <th className="px-3 py-3 text-left font-bold text-base">Fecha Rec</th>
                        <th className="px-3 py-3 text-left font-bold text-base">Principal</th>
                        <th className="px-3 py-3 text-left font-bold text-base">Ubicación</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr className="border-b border-slate-200 text-slate-800 align-top">
                        <td className="px-3 py-4 font-bold text-blue-700 text-lg whitespace-pre-line">
                          {resultado.doc_vnro_expediente}-{resultado.doc_vanio_expediente}
                        </td>

                        <td className="px-3 py-4 text-base leading-7 min-w-47.5">
                          {resultado.doc_vasunto_ || "-"}
                        </td>

                        <td className="px-3 py-4 text-base leading-7 min-w-42.5">
                          {resultado.doc_vpersona_ || "-"}
                        </td>

                        <td className="px-3 py-4 text-base leading-7 min-w-27.5">
                          {resultado.tip_doc_vabr_ || "-"}
                        </td>

                        <td className="px-3 py-4 text-base leading-7 min-w-30">
                          {resultado.est_doc_vdes_ || "-"}
                        </td>

                        <td className="px-3 py-4 text-base leading-7 min-w-30">
                          {resultado.doc_tfecha_recepcion_ || "-"}
                        </td>

                        <td className="px-3 py-4 text-base leading-7 min-w-40">
                          {resultado.car_vdes_ || "-"}
                        </td>

                        <td className="px-3 py-4 text-base leading-7 min-w-65">
                          {resultado.tip_doc_vdes_ || "-"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </motion.div>
              </motion.div>
            ) : null}
          </motion.div>
        </div>
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