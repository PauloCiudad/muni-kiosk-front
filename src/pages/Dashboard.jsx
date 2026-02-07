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
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

const DOC_TYPES = [
  { value: "1", label: "DNI" },
  { value: "2", label: "RUC" },
  { value: "3", label: "Pasaporte" },
  { value: "4", label: "Carnet de Extranjería" },
  { value: "5", label: "S/D" },
];

const COLORS = {
  azul: "#0B6FB3",
  azulProfundo: "#0A4A78",
};

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

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

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const nroDocFinal = isSD ? "0" : nroDoc.trim();

    if (!tipoDoc) return setError("Seleccione el tipo de documento.");
    if (!isSD && !nroDocFinal) return setError("Ingrese el número de documento.");
    if (!correo.trim()) return setError("Ingrese el correo electrónico.");
    if (!celular.trim()) return setError("Ingrese el número de celular.");

    if (!correo.includes("@")) return setError("Correo inválido.");
    if (celular.length < 9) return setError("El celular debe tener 9 dígitos.");

    const payload = {
      tipo_doc: Number(tipoDoc),
      nro_doc: nroDocFinal,
      correo_electronico: correo.trim(),
      celular: celular.trim(),
    };

    console.log("LOGIN PAYLOAD =>", payload);

    // Simulación: luego lo conectas a API
    navigate("/dashboard");
  }

  return (
    <motion.div
      className="w-screen h-screen bg-slate-200"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="w-full h-full flex flex-col bg-white overflow-hidden">
        {/* HEADER (mismo concepto Home) */}
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
            onClick={() => navigate("/")}
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
            alt="Municipalidad Provincial de Arequipa"
            className="h-24 md:h-28 object-contain bg-white/90 p-3"
          />

          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold">
              Pagos en Línea
            </h1>
            <p className="text-white/85 text-xl md:text-2xl mt-2">
              Ingrese sus datos para continuar
            </p>
          </div>
        </motion.header>

        {/* BODY */}
        <motion.main
          variants={container}
          className="flex-1 bg-slate-100 px-10 py-10 flex items-start justify-center"
        >
          <motion.form
            onSubmit={handleSubmit}
            variants={container}
            className="
              w-full
              max-w-245
              bg-white
              shadow-2xl
              rounded-none
              p-10
              flex flex-col gap-8
            "
          >
            {/* Error */}
            {error && (
              <motion.div
                variants={itemUp}
                className="border border-red-200 bg-red-50 text-red-700 p-5 font-extrabold text-xl"
              >
                {error}
              </motion.div>
            )}

            {/* FILA 1: Tipo doc + Nro doc (2 columnas) */}
            <div className="grid grid-cols-2 gap-8">
              <motion.div variants={itemUp} className="flex flex-col gap-3">
                <label className="text-2xl font-extrabold text-slate-800">
                  Tipo de Documento
                </label>
                <select
                  value={tipoDoc}
                  onChange={(e) => setTipoDoc(e.target.value)}
                  className="
                    h-20
                    border border-slate-300
                    px-5
                    text-2xl
                    bg-white
                    focus:outline-none focus:ring-4 focus:ring-blue-300
                  "
                >
                  {DOC_TYPES.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div variants={itemUp} className="flex flex-col gap-3">
                <label className="text-2xl font-extrabold text-slate-800">
                  Nro. de Documento
                </label>
                <input
                  value={nroDoc}
                  onChange={(e) => setNroDoc(onlyDigits(e.target.value))}
                  disabled={isSD}
                  placeholder={isSD ? "S/D usa 0 automáticamente" : `Ingrese ${tipoDocLabel}`}
                  className={`
                    h-20
                    border
                    px-5
                    text-2xl
                    focus:outline-none focus:ring-4 focus:ring-blue-300
                    ${isSD ? "border-slate-200 bg-slate-100 text-slate-400" : "border-slate-300 bg-white"}
                  `}
                  inputMode="numeric"
                />
                {isSD && (
                  <div className="text-sm text-slate-500">
                    * S/D: se enviará nro_doc = 0
                  </div>
                )}
              </motion.div>
            </div>

            {/* FILA 2: Correo */}
            <motion.div variants={itemUp} className="flex flex-col gap-3">
              <label className="text-2xl font-extrabold text-slate-800">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="
                  h-20
                  border border-slate-300
                  px-5
                  text-2xl
                  bg-white
                  focus:outline-none focus:ring-4 focus:ring-blue-300
                "
                autoComplete="email"
              />
            </motion.div>

            {/* FILA 3: Celular */}
            <motion.div variants={itemUp} className="flex flex-col gap-3">
              <label className="text-2xl font-extrabold text-slate-800">
                Número de Celular
              </label>
              <input
                value={celular}
                onChange={(e) => setCelular(onlyDigits(e.target.value).slice(0, 9))}
                placeholder="Ej. 987654321"
                className="
                  h-20
                  border border-slate-300
                  px-5
                  text-2xl
                  bg-white
                  focus:outline-none focus:ring-4 focus:ring-blue-300
                "
                inputMode="numeric"
              />
              <div className="text-sm text-slate-500">
                * Solo números (9 dígitos)
              </div>
            </motion.div>

            {/* SUBMIT */}
            <motion.button
              variants={itemUp}
              whileTap={{ scale: 0.97 }}
              className="
                h-24
                text-white
                text-3xl
                font-extrabold
                shadow-xl
                active:opacity-95
              "
              style={{ backgroundColor: COLORS.azul }}
              type="submit"
            >
              <span className="inline-flex items-center justify-center gap-4">
                <BiLogInCircle className="text-5xl" />
                Buscar
              </span>
            </motion.button>

            <motion.div
              variants={itemUp}
              className="text-center text-slate-400 text-base"
            >
              Municipalidad Provincial de Arequipa
            </motion.div>
          </motion.form>
        </motion.main>

        {/* FOOTER */}
        <motion.footer
          variants={itemUp}
          className="py-6 text-center text-slate-400 text-base bg-white border-t"
        >
          © Kiosko Municipal
        </motion.footer>
      </div>
    </motion.div>
  );
}
