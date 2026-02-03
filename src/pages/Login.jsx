import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BiArrowBack, BiLogInCircle } from "react-icons/bi";
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

// Colores inspirados en el escudo (aprox)
const COLORS = {
  azul: "#0B6FB3",
  azulProfundo: "#0A4A78",
  dorado: "#D4A83E",
  rojo: "#D62828",
};

export default function Login() {
  const navigate = useNavigate();

  const [tipoDoc, setTipoDoc] = useState("1");
  const [nroDoc, setNroDoc] = useState("");
  const [correo, setCorreo] = useState("");
  const [celular, setCelular] = useState("");
  const [error, setError] = useState("");

  const isSD = tipoDoc === "5";

  const tipoDocLabel = useMemo(() => {
    return DOC_TYPES.find((d) => d.value === tipoDoc)?.label ?? "";
  }, [tipoDoc]);

  function onlyDigits(value) {
    return value.replace(/\D/g, "");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const nroDocFinal = isSD ? "0" : nroDoc.trim();

    // Validaciones frontend (simples)
    if (!tipoDoc) return setError("Seleccione el tipo de documento.");
    if (!isSD && !nroDocFinal) return setError("Ingrese el número de documento.");
    if (!correo.trim()) return setError("Ingrese el correo electrónico.");
    if (!celular.trim()) return setError("Ingrese el número de celular.");

    if (!correo.includes("@")) return setError("Correo inválido.");
    if (celular.length < 9) return setError("El celular debe tener al menos 9 dígitos.");

    // Payload listo para API futura
    const payload = {
      tipo_doc: Number(tipoDoc),
      nro_doc: nroDocFinal, // "0" si S/D
      correo_electronico: correo.trim(),
      celular: celular.trim(),
    };

    console.log("LOGIN PAYLOAD =>", payload);

    // Por ahora: simulamos éxito y vamos al dashboard
    navigate("/dashboard");
  }

  return (
    <motion.div
      className="min-h-screen bg-slate-100 flex flex-col"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <header className="relative flex flex-col items-center justify-center py-8 px-4 bg-white shadow">
        <motion.button
          variants={itemUp}
          onClick={() => navigate("/")}
          className="absolute left-4 top-4 w-12 h-12 rounded-xl bg-slate-100 text-2xl flex items-center justify-center active:scale-[0.95]"
          aria-label="Volver"
        >
          <BiArrowBack />
        </motion.button>

        <motion.img
          variants={itemUp}
          src={logo}
          alt="Municipalidad Provincial de Arequipa"
          className="w-full max-w-260px object-contain"
        />

        <motion.h1
          variants={itemUp}
          className="mt-6 text-3xl md:text-4xl font-extrabold text-slate-800 text-center"
        >
          Pagos en Línea
        </motion.h1>

        <motion.p
          variants={itemUp}
          className="mt-2 text-slate-500 text-lg text-center"
        >
          Ingrese sus datos para continuar
        </motion.p>
      </header>

      {/* Form */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-5"
          variants={container}
        >
          {error && (
            <motion.div
              variants={itemUp}
              className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-4 font-bold"
            >
              {error}
            </motion.div>
          )}

          {/* Tipo doc */}
          <motion.div variants={itemUp} className="flex flex-col gap-2">
            <label className="text-lg font-extrabold text-slate-700">
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

          {/* Nro doc */}
          <motion.div variants={itemUp} className="flex flex-col gap-2">
            <label className="text-lg font-extrabold text-slate-700">
              Nro. de Documento
            </label>
            <input
              value={nroDoc}
              onChange={(e) => setNroDoc(onlyDigits(e.target.value))}
              disabled={isSD}
              placeholder={isSD ? "S/D usa 0 automáticamente" : `Ingrese ${tipoDocLabel}`}
              className={`h-14 rounded-xl border px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isSD
                  ? "border-slate-200 bg-slate-100 text-slate-400"
                  : "border-slate-300 bg-white"
              }`}
              inputMode="numeric"
            />
            {isSD && (
              <div className="text-xs text-slate-500">
                * S/D significa sin documento, se enviará nro_doc = 0
              </div>
            )}
          </motion.div>

          {/* Correo */}
          <motion.div variants={itemUp} className="flex flex-col gap-2">
            <label className="text-lg font-extrabold text-slate-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="h-14 rounded-xl border border-slate-300 px-4 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="email"
            />
          </motion.div>

          {/* Celular */}
          <motion.div variants={itemUp} className="flex flex-col gap-2">
            <label className="text-lg font-extrabold text-slate-700">
              Número de Celular
            </label>
            <input
              value={celular}
              onChange={(e) => setCelular(onlyDigits(e.target.value).slice(0, 9))}
              placeholder="Ej. 987654321"
              className="h-14 rounded-xl border border-slate-300 px-4 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              inputMode="numeric"
            />
            <div className="text-xs text-slate-500">
              * Solo números (9 dígitos)
            </div>
          </motion.div>

          {/* Submit */}
          <motion.button
            variants={itemUp}
            whileTap={{ scale: 0.96 }}
            className="h-16 rounded-2xl text-white text-xl font-extrabold shadow-lg transition"
            style={{ backgroundColor: COLORS.azul }}
            type="submit"
          >
            <span className="inline-flex items-center justify-center gap-3">
              <BiLogInCircle className="text-3xl" />
              Continuar
            </span>
          </motion.button>

          <motion.div variants={itemUp} className="text-center text-sm text-slate-400">
            Municipalidad Provincial de Arequipa
          </motion.div>
        </motion.form>
      </main>

      <motion.footer variants={itemUp} className="py-4 text-center text-sm text-slate-400">
        © Kiosko Municipal
      </motion.footer>
    </motion.div>
  );
}
