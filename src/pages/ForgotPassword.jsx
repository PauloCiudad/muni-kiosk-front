import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logos_juntos.png";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12 } } };
const itemUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    console.log("RECOVER =>", { email });
    navigate("/login");
  }

  return (
    <motion.div className="min-h-screen bg-slate-200 flex flex-col" variants={container} initial="hidden" animate="show">
      <header className="relative flex flex-col items-center justify-center py-8 px-4 bg-white shadow">
        <motion.button variants={itemUp} onClick={() => navigate("/login")}
          className="absolute left-4 top-4 w-12 h-12 rounded-xl bg-slate-100 text-2xl flex items-center justify-center active:scale-[0.95]">
          ⬅
        </motion.button>

        <motion.img src={logo} alt="Logo" className="w-full max-w-[320px] object-contain" variants={itemUp} />
        <motion.h1 className="mt-6 text-2xl font-extrabold text-slate-800 text-center" variants={itemUp}>
          Recuperar contraseña
        </motion.h1>
        <motion.p className="mt-1 text-slate-500 text-center" variants={itemUp}>
          Ingrese su correo para recuperar el acceso
        </motion.p>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-5" variants={container}>
          <motion.div variants={itemUp} className="flex flex-col gap-2">
            <label className="text-lg font-bold text-slate-700">Correo</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="h-14 rounded-xl border border-slate-300 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          <motion.button variants={itemUp} whileTap={{ scale: 0.96 }}
            className="h-16 rounded-2xl bg-blue-600 text-white text-xl font-extrabold shadow-lg active:bg-blue-800 transition" type="submit">
            📩 Enviar
          </motion.button>
        </motion.form>
      </main>

      <motion.footer variants={itemUp} className="py-4 text-center text-sm text-slate-400">
        Municipalidad Provincial de Arequipa
      </motion.footer>
    </motion.div>
  );
}
