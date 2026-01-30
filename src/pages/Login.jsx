import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logos_juntos.png";
import { BiArrowBack } from "react-icons/bi";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

function getOrCreateKioskId() {
  const key = "kiosk_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    localStorage.setItem(key, id);
  }
  return id;
}

export default function Login() {
  const navigate = useNavigate();
  const kioskId = useMemo(() => getOrCreateKioskId(), []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    // Payload listo para backend
    const payload = {
      kioskId,
      username,
      password,
    };

    console.log("LOGIN PAYLOAD =>", payload);

    // Por ahora solo navega (Cuando se tenga backend aquí va la llamada)
    navigate("/dashboard");
  }

  return (
    <motion.div
      className="min-h-screen bg-slate-200 flex flex-col"
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
          src={logo}
          alt="Logo"
          className="w-full max-w-[320px] object-contain"
          variants={itemUp}
        />

        <motion.h1
          className="mt-6 text-2xl font-extrabold text-slate-800 text-center"
          variants={itemUp}
        >
          Pagos en Línea
        </motion.h1>

        <motion.p className="mt-1 text-slate-500 text-center" variants={itemUp}>
          Inicie sesión para continuar
        </motion.p>
      </header>

      {/* Form */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-5"
          variants={container}
        >
          {/* Kiosk ID (se manda al backend, no editable) */}
          <motion.div variants={itemUp} className="text-xs text-slate-500">
            ID del kiosko: <span className="font-mono">{kioskId}</span>
          </motion.div>

          <motion.div variants={itemUp} className="flex flex-col gap-2">
            <label className="text-lg font-bold text-slate-700">Usuario</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese su usuario"
              className="h-14 rounded-xl border border-slate-300 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="username"
            />
          </motion.div>

          <motion.div variants={itemUp} className="flex flex-col gap-2">
            <label className="text-lg font-bold text-slate-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              className="h-14 rounded-xl border border-slate-300 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="current-password"
            />
          </motion.div>

          <motion.button
            variants={itemUp}
            whileTap={{ scale: 0.96 }}
            className="h-16 rounded-2xl bg-blue-600 text-white text-xl font-extrabold shadow-lg active:bg-blue-800 transition"
            type="submit"
          >
            Iniciar Sesión
          </motion.button>

          {/* Links */}
          <motion.div
            variants={itemUp}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2"
          >
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-blue-700 font-bold underline underline-offset-4 active:opacity-70"
            >
              ¿Olvidaste tu contraseña?
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-slate-700 font-bold underline underline-offset-4 active:opacity-70"
            >
              Registrarse
            </button>
          </motion.div>
        </motion.form>
      </main>

      <motion.footer
        variants={itemUp}
        className="py-4 text-center text-sm text-slate-400"
      >
        Municipalidad Provincial de Arequipa
      </motion.footer>
    </motion.div>
  );
}
