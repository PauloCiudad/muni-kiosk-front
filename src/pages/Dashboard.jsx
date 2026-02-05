import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BiArrowBack, BiChevronDown, BiChevronUp } from "react-icons/bi";
import logo from "../assets/logos_juntos.png";

// Helpers
const money = (n) =>
  "S/ " +
  Number(n || 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

// =========================
// MOCKS
// =========================
function useMockData() {
  // Estructura similar a lo que necesitas mostrar
  return {
    ruc: "20382036655",
    contribuyente: "227309",
    predial: {
      title: "Impuesto predial",
      rows: [
        { id: "pred-2026-0", anioCuota: "2026-0", docPago: "0000227309P26", venc: "", estado: "", deuda: 16459.10, pagado: 0 },
        { id: "pred-2026-1", anioCuota: "2026-1", docPago: "12600217401", venc: "27/02/2026", estado: "Pendiente", deuda: 4115.90, pagado: 0 },
        { id: "pred-2026-2", anioCuota: "2026-2", docPago: "12601326841", venc: "29/05/2026", estado: "Pendiente", deuda: 4114.40, pagado: 0 },
        { id: "pred-2026-3", anioCuota: "2026-3", docPago: "12602370631", venc: "31/08/2026", estado: "Pendiente", deuda: 4114.40, pagado: 0 },
        { id: "pred-2026-4", anioCuota: "2026-4", docPago: "12603414423", venc: "30/11/2026", estado: "Pendiente", deuda: 4114.40, pagado: 0 },
      ],
    },
    arbitrios: {
      title: "Arbitrios municipales",
      referencia: "Predio: JR CARABAYA N° 400-408, CERCADO DE LIMA - Ref: UNID INMOB 1",
      rows: [
        { id: "arb-2026-0", anioCuota: "2026-0", docPago: "1001065285A26", venc: "", estado: "", deuda: 22104.40, pagado: 0 },
        { id: "arb-2026-1", anioCuota: "2026-1", docPago: "12606241681", venc: "27/02/2026", estado: "Pendiente", deuda: 6007.36, pagado: 0 },
        { id: "arb-2026-2", anioCuota: "2026-2", docPago: "12606241692", venc: "29/05/2026", estado: "Pendiente", deuda: 6006.36, pagado: 0 },
        { id: "arb-2026-3", anioCuota: "2026-3", docPago: "12606241709", venc: "31/08/2026", estado: "Pendiente", deuda: 6006.36, pagado: 0 },
        { id: "arb-2026-4", anioCuota: "2026-4", docPago: "12606241711", venc: "30/11/2026", estado: "Pendiente", deuda: 6006.36, pagado: 0 },
      ],
    },
    papeletas: {
      title: "Papeletas",
      rows: [
        { id: "pap-A4L722", referencia: "Referencia:", placa: "A4L722", deuda: 900.0, pagado: 0 },
        { id: "pap-A7F754", referencia: "Referencia:", placa: "A7F754", deuda: 850.0, pagado: 0 },
        { id: "pap-A7S771", referencia: "Referencia:", placa: "A7S771", deuda: 1100.0, pagado: 0 },
        { id: "pap-A9K714", referencia: "Referencia:", placa: "A9K714", deuda: 1200.0, pagado: 0 },
        { id: "pap-A2A874", referencia: "Referencia:", placa: "A2A874", deuda: 900.0, pagado: 0 },
        { id: "pap-A3C747", referencia: "Referencia:", placa: "A3C747", deuda: 1247.2, pagado: 0 },
        { id: "pap-A7J824", referencia: "Referencia:", placa: "A7J824", deuda: 1000.0, pagado: 0 },
        { id: "pap-B7V764", referencia: "Referencia:", placa: "B7V764", deuda: 1000.0, pagado: 0 },
      ],
    },
    vehicular: {
      title: "Impuesto vehicular",
      rows: [
        // si no hay deudas, se deja vacío
      ],
    },
  };
}

function Section({ title, total, open, onToggle, children, accent = "bg-slate-200" }) {
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className={`w-full px-4 py-3 flex items-center justify-between ${accent}`}
      >
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-slate-800">{title}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-extrabold text-slate-800">TOTAL:</span>
          <span className="font-extrabold text-slate-800">{money(total)}</span>
          {open ? <BiChevronUp className="text-2xl" /> : <BiChevronDown className="text-2xl" />}
        </div>
      </button>

      {open && <div className="p-4">{children}</div>}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const data = useMockData();

  // Colapsables
  const [openPredial, setOpenPredial] = useState(true);
  const [openArb, setOpenArb] = useState(true);
  const [openPap, setOpenPap] = useState(true);
  const [openVeh, setOpenVeh] = useState(false);

  // Selección (simula carrito)
  const [selected, setSelected] = useState(() => new Set());

  const predialRows = useMemo(
    () => data.predial.rows.filter((r) => r.pagado === 0),
    [data.predial.rows]
  );
  const arbRows = useMemo(
    () => data.arbitrios.rows.filter((r) => r.pagado === 0),
    [data.arbitrios.rows]
  );
  const papRows = useMemo(
    () => data.papeletas.rows.filter((r) => r.pagado === 0),
    [data.papeletas.rows]
  );
  const vehRows = useMemo(
    () => data.vehicular.rows.filter((r) => r.pagado === 0),
    [data.vehicular.rows]
  );

  const totalPredial = useMemo(() => predialRows.reduce((a, r) => a + (r.deuda || 0), 0), [predialRows]);
  const totalArb = useMemo(() => arbRows.reduce((a, r) => a + (r.deuda || 0), 0), [arbRows]);
  const totalPap = useMemo(() => papRows.reduce((a, r) => a + (r.deuda || 0), 0), [papRows]);
  const totalVeh = useMemo(() => vehRows.reduce((a, r) => a + (r.deuda || 0), 0), [vehRows]);
  const totalGeneral = totalPredial + totalArb + totalPap + totalVeh;

  const allIds = useMemo(() => {
    return [...predialRows, ...arbRows, ...papRows, ...vehRows].map((x) => x.id);
  }, [predialRows, arbRows, papRows, vehRows]);

  const allSelected = selected.size > 0 && allIds.every((id) => selected.has(id));

  function toggleOne(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      const shouldSelectAll = !allIds.every((id) => next.has(id));
      if (shouldSelectAll) allIds.forEach((id) => next.add(id));
      else allIds.forEach((id) => next.delete(id));
      return next;
    });
  }

  function goPagar() {
    // Por ahora solo muestra payload mock en consola
    const payload = {
      ruc: data.ruc,
      contribuyente: data.contribuyente,
      seleccionados: Array.from(selected),
      totalSeleccionado: Array.from(selected).reduce((sum, id) => {
        const all = [...predialRows, ...arbRows, ...papRows, ...vehRows];
        const row = all.find((x) => x.id === id);
        return sum + (row?.deuda || 0);
      }, 0),
    };
    console.log("PAGO PAYLOAD =>", payload);
    alert("Mock: items seleccionados enviados a pago (mira consola).");
  }

  return (
    <motion.div
      className="min-h-screen bg-slate-100 flex flex-col"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <header className="relative bg-white shadow px-4 py-6">
        <motion.button
          variants={itemUp}
          onClick={() => navigate("/dashboard")}
          className="absolute left-4 top-4 w-12 h-12 rounded-xl bg-slate-100 text-2xl flex items-center justify-center active:scale-[0.95]"
          aria-label="Volver"
        >
          <BiArrowBack />
        </motion.button>

        <div className="flex items-center justify-center">
          <motion.img
            variants={itemUp}
            src={logo}
            alt="Municipalidad Provincial de Arequipa"
            className="w-full max-w-220px object-contain"
          />
        </div>

        <motion.div variants={itemUp} className="mt-4 flex flex-col gap-1">
          <div className="text-slate-700 font-extrabold">
            RUC: <span className="font-mono">{data.ruc}</span>
          </div>
          <div className="text-slate-500">
            Total deudas: <span className="font-extrabold text-slate-800">{money(totalGeneral)}</span>
          </div>
        </motion.div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-5xl w-full mx-auto flex flex-col gap-4">
        {/* Pagar total */}
        <motion.div variants={itemUp} className="bg-white rounded-2xl shadow p-4 flex items-center justify-between">
          <label className="flex items-center gap-3 text-slate-800 font-extrabold">
            <input
              type="checkbox"
              className="w-6 h-6 accent-blue-600"
              checked={allSelected}
              onChange={toggleAll}
            />
            Pagar el total
          </label>

          <button
            onClick={goPagar}
            className="h-12 px-5 rounded-2xl bg-blue-600 text-white font-extrabold active:scale-[0.98]"
            type="button"
            disabled={selected.size === 0}
            style={{ opacity: selected.size === 0 ? 0.5 : 1 }}
          >
            Ir a pagar ({selected.size})
          </button>
        </motion.div>

        {/* Secciones */}
        <Section
          title={data.predial.title}
          total={totalPredial}
          open={openPredial}
          onToggle={() => setOpenPredial((s) => !s)}
          accent="bg-slate-200"
        >
          <div className="text-sm text-slate-500 mb-3">
            Cod. Contribuyente: <span className="font-mono">{data.contribuyente}</span>
          </div>

          <div className="overflow-auto">
            <table className="w-full min-w-900px">
              <thead>
                <tr className="text-left text-slate-600">
                  <th className="py-2 px-2"> </th>
                  <th className="py-2 px-2 font-extrabold">Año-cuota</th>
                  <th className="py-2 px-2 font-extrabold">Doc. de pago</th>
                  <th className="py-2 px-2 font-extrabold">Fec. venc.</th>
                  <th className="py-2 px-2 font-extrabold">Estado</th>
                  <th className="py-2 px-2 font-extrabold text-right">Deuda a la fecha</th>
                </tr>
              </thead>
              <tbody>
                {predialRows.map((r) => (
                  <tr key={r.id} className="border-t border-slate-200">
                    <td className="py-3 px-2">
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-blue-600"
                        checked={selected.has(r.id)}
                        onChange={() => toggleOne(r.id)}
                      />
                    </td>
                    <td className="py-3 px-2">{r.anioCuota}</td>
                    <td className="py-3 px-2">{r.docPago}</td>
                    <td className="py-3 px-2">{r.venc}</td>
                    <td className="py-3 px-2">
                      <span className="text-green-700 font-bold">{r.estado || "Pendiente"}</span>
                    </td>
                    <td className="py-3 px-2 text-right font-extrabold">{money(r.deuda)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          title={data.arbitrios.title}
          total={totalArb}
          open={openArb}
          onToggle={() => setOpenArb((s) => !s)}
          accent="bg-slate-200"
        >
          <div className="text-sm text-slate-500 mb-3">{data.arbitrios.referencia}</div>

          <div className="overflow-auto">
            <table className="w-full min-w-900px">
              <thead>
                <tr className="text-left text-slate-600">
                  <th className="py-2 px-2"> </th>
                  <th className="py-2 px-2 font-extrabold">Año-cuota</th>
                  <th className="py-2 px-2 font-extrabold">Doc. de pago</th>
                  <th className="py-2 px-2 font-extrabold">Fec. venc.</th>
                  <th className="py-2 px-2 font-extrabold">Estado</th>
                  <th className="py-2 px-2 font-extrabold text-right">Deuda a la fecha</th>
                </tr>
              </thead>
              <tbody>
                {arbRows.map((r) => (
                  <tr key={r.id} className="border-t border-slate-200">
                    <td className="py-3 px-2">
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-blue-600"
                        checked={selected.has(r.id)}
                        onChange={() => toggleOne(r.id)}
                      />
                    </td>
                    <td className="py-3 px-2">{r.anioCuota}</td>
                    <td className="py-3 px-2">{r.docPago}</td>
                    <td className="py-3 px-2">{r.venc}</td>
                    <td className="py-3 px-2">
                      <span className="text-green-700 font-bold">{r.estado || "Pendiente"}</span>
                    </td>
                    <td className="py-3 px-2 text-right font-extrabold">{money(r.deuda)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          title={data.papeletas.title}
          total={totalPap}
          open={openPap}
          onToggle={() => setOpenPap((s) => !s)}
          accent="bg-slate-200"
        >
          <div className="flex flex-col gap-2">
            {papRows.map((r) => (
              <div key={r.id} className="border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-600"
                    checked={selected.has(r.id)}
                    onChange={() => toggleOne(r.id)}
                  />
                  <span className="text-slate-600">{r.referencia}</span>
                  <span className="font-extrabold text-slate-800">Placa: {r.placa}</span>
                </label>
                <span className="font-extrabold">{money(r.deuda)}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title={data.vehicular.title}
          total={totalVeh}
          open={openVeh}
          onToggle={() => setOpenVeh((s) => !s)}
          accent="bg-slate-200"
        >
          {vehRows.length === 0 ? (
            <div className="text-slate-500">No se encontraron deudas vehiculares.</div>
          ) : (
            <div className="text-slate-500">Aquí irá la tabla vehicular.</div>
          )}
        </Section>
      </main>
    </motion.div>
  );
}
