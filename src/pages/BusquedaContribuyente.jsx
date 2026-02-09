import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BiArrowBack, BiSearchAlt } from "react-icons/bi";
import logo from "../assets/logos_juntos.png";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

// ✅ MOCK: luego lo cambias por API real
async function mockBuscarContribuyentePorDocumento(nroDoc) {
  await new Promise((r) => setTimeout(r, 600));

  // Simula "no encontrado"
  if (nroDoc === "00000000") {
    return null;
  }

  return {
    contribuyente: {
      nombreRazonSocial: "Michell & CIA",
      codigoContribuyente: "227309",
      tipoDoc: "RUC",
      nroDoc,
    },
    deudas: {
      predial: 16459.1,
      vehicular: 9100.0,
      arbitrios: 22104.4,
      transito: 9177.2,
    },
  };
}

export default function BusquedaContribuyente() {
  const navigate = useNavigate();

  const [doc, setDoc] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleBuscar(e) {
    e.preventDefault();
    setError("");

    const nroDoc = doc.trim();
    if (!nroDoc) return setError("Ingrese su número de documento.");
    if (nroDoc.length < 8) return setError("Documento inválido.");

    try {
      setLoading(true);

      const result = await mockBuscarContribuyentePorDocumento(nroDoc);

      if (!result) {
        setError("No se encontró contribuyente con ese documento.");
        return;
      }

      // 👉 Pasamos la data a EstadoCuenta por navigation state
      navigate("/estado-cuenta", { state: result });
    } catch (err) {
      setError(err?.message || "No se pudo realizar la búsqueda.");
    } finally {
      setLoading(false);
    }
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
            bg-linear-to-b from-white-100 to-slate-200
            text-[#0F70B3]
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
              bg-black/15 border border-black/35
              text-black text-4xl
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
            className="h-24 md:h-70 object-contain p-3"
          />

          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold">
              Búsqueda de Contribuyente
            </h1>
            <p className="text-[#0F70B3] text-xl md:text-2xl mt-2">
              Ingrese el número de documento
            </p>
          </div>
        </motion.header>

        {/* BODY */}
        <motion.main
          variants={container}
          className="flex-1 bg-slate-100 px-10 py-10 flex items-start justify-center"
        >
          <motion.form
            onSubmit={handleBuscar}
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
            {error && (
              <motion.div
                variants={itemUp}
                className="border border-red-200 bg-red-50 text-red-700 p-5 font-extrabold text-xl"
              >
                {error}
              </motion.div>
            )}

            <motion.div variants={itemUp} className="flex flex-col gap-3">
              <label className="text-2xl font-extrabold text-slate-800">
                Número de documento
              </label>
              <input
                value={doc}
                onChange={(e) => setDoc(onlyDigits(e.target.value))}
                disabled={loading}
                placeholder="Ingrese DNI / RUC / etc."
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
            </motion.div>

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
                rounded-none
              "
              style={{ backgroundColor: "#0B6FB3", opacity: loading ? 0.8 : 1 }}
              type="submit"
              disabled={loading}
            >
              <span className="inline-flex items-center justify-center gap-4">
                <BiSearchAlt className="text-5xl" />
                {loading ? "Buscando..." : "Buscar"}
              </span>
            </motion.button>
          </motion.form>
        </motion.main>

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
