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

function nowISO() {
  return new Date().toISOString();
}

export default function Register() {
  const navigate = useNavigate();

  // Auto: fecha de registro (frontend)
  const fechaRegistro = useMemo(() => nowISO(), []);

  const [form, setForm] = useState({
    nombres: "",
    apellidoP: "",
    apellidoM: "",
    usuValias: "",
    correoElectronico: "",
    password: "",
    password1: "",
  });

  const [error, setError] = useState("");

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validaciones básicas frontend
    if (!form.nombres.trim()) return setError("Ingrese nombres.");
    if (!form.apellidoP.trim()) return setError("Ingrese apellido paterno.");
    if (!form.apellidoM.trim()) return setError("Ingrese apellido materno.");
    if (!form.usuValias.trim()) return setError("Ingrese un usuario.");
    if (!form.correoElectronico.trim()) return setError("Ingrese un correo.");
    if (!form.password) return setError("Ingrese una contraseña.");
    if (form.password !== form.password1) return setError("Las contraseñas no coinciden.");

    // Payload listo para tu API
    const payload = {
      nombres: form.nombres.trim(),
      apellidoM: form.apellidoM.trim(),
      apellidoP: form.apellidoP.trim(),
      usuValias: form.usuValias.trim(),
      password: form.password,
      password1: form.password1,
      correoElectronico: form.correoElectronico.trim(),
      ipCliente: "PENDIENTE_BACKEND", // ✅ Lo ideal: backend lo calcula
      fechaRegistro, // ✅ frontend (o backend)
    };

    console.log("REGISTER PAYLOAD =>", payload);

    // Por ahora: simulamos éxito y volvemos a login
    navigate("/login");
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
          onClick={() => navigate("/login")}
          className="absolute left-4 top-4 w-12 h-12 rounded-xl bg-slate-100 text-2xl flex items-center justify-center active:scale-[0.95]"
          aria-label="Volver"
        >
          ⬅
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
          Registro
        </motion.h1>

        <motion.p className="mt-1 text-slate-500 text-center" variants={itemUp}>
          Cree su cuenta para pagos en línea
        </motion.p>
      </header>

      {/* Form */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-5"
          variants={container}
        >
          {/* Mensaje error */}
          {error && (
            <motion.div
              variants={itemUp}
              className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-4 font-bold"
            >
              {error}
            </motion.div>
          )}

          {/* Auto info */}
          <motion.div variants={itemUp} className="text-xs text-slate-500">
            Fecha registro: <span className="font-mono">{fechaRegistro}</span>
            <br />
            IP cliente: <span className="font-mono">Se crea la variable en backend</span>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={itemUp} className="flex flex-col gap-2">
              <label className="text-base font-bold text-slate-700">Nombres</label>
              <input
                name="nombres"
                value={form.nombres}
                onChange={onChange}
                placeholder="Ej. Juan Carlos"
                className="h-14 rounded-xl border border-slate-300 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>

            <motion.div variants={itemUp} className="flex flex-col gap-2">
              <label className="text-base font-bold text-slate-700">Usuario</label>
              <input
                name="usuValias"
                value={form.usuValias}
                onChange={onChange}
                placeholder="Ej. jcar123"
                className="h-14 rounded-xl border border-slate-300 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="username"
              />
            </motion.div>

            <motion.div variants={itemUp} className="flex flex-col gap-2">
              <label className="text-base font-bold text-slate-700">Apellido Paterno</label>
              <input
                name="apellidoP"
                value={form.apellidoP}
                onChange={onChange}
                placeholder="Ej. Pérez"
                className="h-14 rounded-xl border border-slate-300 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>

            <motion.div variants={itemUp} className="flex flex-col gap-2">
              <label className="text-base font-bold text-slate-700">Apellido Materno</label>
              <input
                name="apellidoM"
                value={form.apellidoM}
                onChange={onChange}
                placeholder="Ej. Gómez"
                className="h-14 rounded-xl border border-slate-300 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>

            <motion.div variants={itemUp} className="flex flex-col gap-2 md:col-span-2">
              <label className="text-base font-bold text-slate-700">Correo Electrónico</label>
              <input
                type="email"
                name="correoElectronico"
                value={form.correoElectronico}
                onChange={onChange}
                placeholder="correo@ejemplo.com"
                className="h-14 rounded-xl border border-slate-300 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="email"
              />
            </motion.div>

            <motion.div variants={itemUp} className="flex flex-col gap-2">
              <label className="text-base font-bold text-slate-700">Contraseña</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="********"
                className="h-14 rounded-xl border border-slate-300 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="new-password"
              />
            </motion.div>

            <motion.div variants={itemUp} className="flex flex-col gap-2">
              <label className="text-base font-bold text-slate-700">Confirmar Contraseña</label>
              <input
                type="password"
                name="password1"
                value={form.password1}
                onChange={onChange}
                placeholder="********"
                className="h-14 rounded-xl border border-slate-300 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="new-password"
              />
            </motion.div>
          </div>

          {/* Botones */}
          <motion.button
            variants={itemUp}
            whileTap={{ scale: 0.96 }}
            className="h-16 rounded-2xl bg-blue-600 text-white text-xl font-extrabold shadow-lg active:bg-blue-800 transition"
            type="submit"
          >
            ✅ Crear cuenta
          </motion.button>

          <motion.button
            variants={itemUp}
            type="button"
            onClick={() => navigate("/login")}
            className="h-14 rounded-2xl bg-slate-100 text-slate-800 text-lg font-extrabold shadow-sm active:scale-[0.98] transition"
          >
            Ya tengo cuenta → Ingresar
          </motion.button>
        </motion.form>
      </main>

      <motion.footer variants={itemUp} className="py-4 text-center text-sm text-slate-400">
        Municipalidad Provincial de Arequipa
      </motion.footer>
    </motion.div>
  );
}
