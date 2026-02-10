import { useMemo, useRef, useState, useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BiArrowBack,
  BiHomeAlt2,
  BiCar,
  BiTrafficCone,
  BiBuildingHouse,
  BiChevronRight,
  BiCartAlt,
  BiExit,
  BiX,
} from "react-icons/bi";
import logo from "../assets/logos_juntos.png";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

const clickSound = new Audio("/click.mp3");

function formatPEN(amount) {
  const n = Number(amount || 0);
  return n.toLocaleString("es-PE", { style: "currency", currency: "PEN" });
}

function safePlayClick() {
  try {
    clickSound.currentTime = 0;
    clickSound.play();
  } catch {}
}

function parseDateDMY(dmy) {
  // "DD/MM/YYYY" -> Date
  if (!dmy) return new Date(0);
  const [dd, mm, yyyy] = String(dmy).split("/");
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}

/**
 * ✅ Reglas de habilitación por "año más antiguo":
 * - Encuentra el primer año (más antiguo) que NO está completamente seleccionado.
 * - Solo se habilita ese año; el resto queda disabled.
 */
function buildOldestYearGate(rows, yearGetter, selectedSet) {
  const byYear = new Map();
  for (const r of rows) {
    const y = yearGetter(r);
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y).push(r);
  }

  const years = Array.from(byYear.keys()).sort((a, b) => a - b);

  // Encontrar el primer año incompleto
  let oldestIncompleteYear = null;
  for (const y of years) {
    const list = byYear.get(y) || [];
    const allChecked = list.every((row) => selectedSet.has(row.id));
    if (!allChecked) {
      oldestIncompleteYear = y;
      break;
    }
  }

  // Si todo está completo, habilitamos todo (igual ya está checked)
  if (oldestIncompleteYear === null) {
    return () => true;
  }

  // Solo habilitar filas del año más antiguo pendiente
  return (row) => yearGetter(row) === oldestIncompleteYear;
}

/**
 * ✅ Para tránsito (no hay año en tu estructura):
 * - Ordenado por fecha de infracción (ya lo tienes)
 * - Solo habilita la primera fila NO seleccionada (más antigua pendiente)
 */
function buildOldestRowGateOrdered(rowsOrdered, selectedSet) {
  const firstNotCheckedIndex = rowsOrdered.findIndex((r) => !selectedSet.has(r.id));
  if (firstNotCheckedIndex === -1) return () => true; // todo seleccionado
  return (row) => row.id === rowsOrdered[firstNotCheckedIndex].id;
}

function SummaryCard({ title, icon, amount, bgClass, active, onClick }) {
  return (
    <motion.button
      type="button"
      variants={itemUp}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => {
        safePlayClick();
        onClick?.();
      }}
      className={`
        relative overflow-hidden rounded-none
        ${bgClass}
        text-white
        shadow-xl hover:shadow-2xl transition
        w-full
        min-h-60 md:min-h-70
        flex flex-col justify-between
        p-8
        select-none
        ${active ? "ring-8 ring-white/35" : "ring-0"}
      `}
    >
      <span
        className="
          absolute inset-0
          -translate-x-full hover:translate-x-full
          transition-transform duration-700
          bg-linear-to-r from-transparent via-white/18 to-transparent
        "
      />
      <div className="relative flex items-start justify-between">
        <div className="text-6xl drop-shadow">{icon}</div>
        <div className="text-5xl text-white/60">
          <BiChevronRight />
        </div>
      </div>

      <div className="relative">
        <div className="text-2xl md:text-3xl font-extrabold leading-tight">
          {title}
        </div>
        <div className="mt-3 text-4xl md:text-5xl font-extrabold">
          {formatPEN(amount)}
        </div>
        <div className="mt-2 text-white/85 text-lg">
          {active ? "Mostrando detalle" : "Ver detalle"}
        </div>
      </div>
    </motion.button>
  );
}

function TableShell({ title, subtitle, rightStat, children }) {
  return (
    <div className="mt-12 bg-white shadow-2xl border border-slate-200 rounded-none p-10">
      <div className="flex items-start justify-between gap-8">
        <div>
          <div className="text-slate-500 text-xl">Detalle</div>
          <div className="text-slate-900 text-4xl font-extrabold mt-2">
            {title}
          </div>
          <div className="mt-2 text-slate-600 text-xl">{subtitle}</div>
        </div>

        {rightStat ? (
          <div className="text-right">
            <div className="text-slate-500 text-lg">{rightStat.label}</div>
            <div className="text-slate-900 text-4xl font-extrabold mt-2">
              {rightStat.value}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-10">{children}</div>
    </div>
  );
}

function HeadCell({ children, align = "left" }) {
  return (
    <div
      className={`text-slate-500 text-lg font-extrabold ${
        align === "right"
          ? "text-right"
          : align === "center"
          ? "text-center"
          : ""
      }`}
    >
      {children}
    </div>
  );
}

function BodyCell({ children, align = "left", strong = false, muted = false }) {
  return (
    <div
      className={`text-xl ${
        muted ? "text-slate-400" : strong ? "font-extrabold text-slate-900" : "text-slate-700"
      } ${
        align === "right"
          ? "text-right"
          : align === "center"
          ? "text-center"
          : ""
      }`}
    >
      {children}
    </div>
  );
}

function CheckboxCell({ checked, onToggle, disabled }) {
  return (
    <div className="flex justify-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => {
          if (!disabled) onToggle?.();
        }}
        disabled={disabled}
        className={`w-7 h-7 accent-blue-700 ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}

/**
 * ✅ Scroll X persistente:
 * - Guarda scrollLeft en un ref por "storageKey"
 * - Restaura scrollLeft después de re-renders (useLayoutEffect)
 */
function ScrollXTable({ storageKey, scrollStoreRef, minWidthClass, children }) {
  const scrollerRef = useRef(null);

  // Restaurar scrollLeft (si existe)
  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const saved = scrollStoreRef.current?.[storageKey];
    if (typeof saved === "number") {
      el.scrollLeft = saved;
    }
  });

  return (
    <div
      ref={scrollerRef}
      className="w-full overflow-x-auto"
      onScroll={(e) => {
        scrollStoreRef.current[storageKey] = e.currentTarget.scrollLeft;
      }}
    >
      <div className={minWidthClass}>{children}</div>
    </div>
  );
}

export default function EstadoCuenta() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ viene desde Login
  const nroDoc = location.state?.nroDoc || "";
  const tipoDocLabel = location.state?.tipoDocLabel || "DNI";

  if (!nroDoc) {
    navigate("/login", { replace: true });
    return null;
  }

  // Guardamos scroll por tabla
  const scrollStoreRef = useRef({
    predial: 0,
    vehicular: 0,
    arbitrios: 0,
    transito: 0,
  });

  const contribuyente = useMemo(() => {
    return {
      nombreRazonSocial: "Michell & CIA",
      codigoContribuyente: "227309",
      tipoDoc: tipoDocLabel,
      nroDoc,
    };
  }, [nroDoc, tipoDocLabel]);

  // =========================
  // MOCKS (ESTADO = "A")
  // =========================

  // Predial: ESTADO, AÑO, PERIODO, INSOLUTO, D. EMISION, REAJUSTE, INTERES, BENEFICIO, TOTAL
  const predialRows = useMemo(
    () =>
      [
        {
          id: "pr-1",
          estado: "A",
          anio: 2022,
          periodo: "01",
          insoluto: 1800,
          derEmision: 50,
          reajuste: 0,
          interes: 120,
          beneficio: 0,
          total: 1970,
        },
        {
          id: "pr-2",
          estado: "A",
          anio: 2023,
          periodo: "02",
          insoluto: 2100,
          derEmision: 50,
          reajuste: 30,
          interes: 140,
          beneficio: 0,
          total: 2320,
        },
        {
          id: "pr-3",
          estado: "A",
          anio: 2024,
          periodo: "01",
          insoluto: 2500,
          derEmision: 50,
          reajuste: 0,
          interes: 160,
          beneficio: 0,
          total: 2710,
        },
      ].sort((a, b) => a.anio - b.anio),
    []
  );

  // Vehicular: ESTADO, PLACA, PERIODO, INSOLUTO, DER. EM., REAJUSTE, INTERES, BENEFICIO, TOTAL
  const vehicularRows = useMemo(
    () =>
      [
        {
          id: "vh-1",
          estado: "A",
          placa: "V1A-123",
          periodo: "2023",
          insoluto: 4200,
          derEm: 50,
          reajuste: 0,
          interes: 200,
          beneficio: 0,
          total: 4450,
          anioSort: 2023,
        },
        {
          id: "vh-2",
          estado: "A",
          placa: "V1A-123",
          periodo: "2024",
          insoluto: 4300,
          derEm: 50,
          reajuste: 20,
          interes: 230,
          beneficio: 0,
          total: 4600,
          anioSort: 2024,
        },
      ].sort((a, b) => a.anioSort - b.anioSort),
    []
  );

  // Arbitrios: filtro por predio + ESTADO, CODIGO USO, AÑO, PERIODO, INSOLUTO, INTERES, BENEFICIO, TOTAL
  const arbitriosAllRows = useMemo(
    () =>
      [
        {
          id: "ar-1",
          predio: "Predio 01 - Calle A 123",
          estado: "A",
          codigoUso: "RES",
          anio: 2023,
          periodo: "01",
          insoluto: 500,
          interes: 20,
          beneficio: 0,
          total: 520,
        },
        {
          id: "ar-2",
          predio: "Predio 01 - Calle A 123",
          estado: "A",
          codigoUso: "RES",
          anio: 2024,
          periodo: "02",
          insoluto: 520,
          interes: 25,
          beneficio: 0,
          total: 545,
        },
        {
          id: "ar-3",
          predio: "Predio 02 - Av B 456",
          estado: "A",
          codigoUso: "COM",
          anio: 2023,
          periodo: "01",
          insoluto: 850,
          interes: 30,
          beneficio: 0,
          total: 880,
        },
        {
          id: "ar-4",
          predio: "Predio 02 - Av B 456",
          estado: "A",
          codigoUso: "COM",
          anio: 2024,
          periodo: "01",
          insoluto: 900,
          interes: 35,
          beneficio: 0,
          total: 935,
        },
      ].sort((a, b) => a.anio - b.anio),
    []
  );

  const arbitriosPredios = useMemo(() => {
    const set = new Set(arbitriosAllRows.map((r) => r.predio));
    return Array.from(set);
  }, [arbitriosAllRows]);

  const [arbitriosPredioSel, setArbitriosPredioSel] = useState(
    arbitriosPredios[0] || ""
  );

  const arbitriosRows = useMemo(() => {
    const filtered = arbitriosAllRows.filter((r) =>
      arbitriosPredioSel ? r.predio === arbitriosPredioSel : true
    );
    return [...filtered].sort((a, b) => a.anio - b.anio);
  }, [arbitriosAllRows, arbitriosPredioSel]);

  // Tránsito: NRO. INF., PLACA, TIPO INF., FEC INF., FEC VENC., INFRACTOR, TOTAL, DSCTO, P.ACUENTA, DEUDA
  const transitoRows = useMemo(
    () =>
      [
        {
          id: "tr-1",
          nroInf: "PAP-001",
          placa: "V1A-123",
          tipoInf: "G-40",
          fecInf: "10/01/2024",
          fecVenc: "10/02/2024",
          infractor: "PAULO CIUDAD",
          total: 3200,
          dscto: 0,
          pacuenta: 500,
          deuda: 2700,
        },
        {
          id: "tr-2",
          nroInf: "PAP-044",
          placa: "C3B-777",
          tipoInf: "M-02",
          fecInf: "02/03/2025",
          fecVenc: "02/04/2025",
          infractor: "PAULO CIUDAD",
          total: 5977.2,
          dscto: 200,
          pacuenta: 0,
          deuda: 5777.2,
        },
      ].sort((a, b) => parseDateDMY(a.fecInf) - parseDateDMY(b.fecInf)),
    []
  );

  // =========================
  // Totales
  // =========================
  const totals = useMemo(() => {
    const sum = (arr, key) => arr.reduce((acc, r) => acc + Number(r[key] || 0), 0);

    return {
      predial: sum(predialRows, "total"),
      vehicular: sum(vehicularRows, "total"),
      arbitrios: sum(arbitriosAllRows, "total"),
      transito: sum(transitoRows, "deuda"),
    };
  }, [predialRows, vehicularRows, arbitriosAllRows, transitoRows]);

  const totalGeneral = useMemo(() => {
    return (
      Number(totals.predial || 0) +
      Number(totals.vehicular || 0) +
      Number(totals.arbitrios || 0) +
      Number(totals.transito || 0)
    );
  }, [totals]);

  // Servicio seleccionado
  const [activeService, setActiveService] = useState("predial");

  // Selección por servicio
  const [selectedByService, setSelectedByService] = useState(() => ({
    predial: new Set(),
    vehicular: new Set(),
    arbitrios: new Set(),
    transito: new Set(),
  }));

  function toggleRow(serviceKey, rowId) {
    setSelectedByService((prev) => {
      const next = { ...prev };
      const set = new Set(next[serviceKey]);
      if (set.has(rowId)) set.delete(rowId);
      else set.add(rowId);
      next[serviceKey] = set;
      return next;
    });
  }

  const selectedCount = useMemo(() => {
    let c = 0;
    for (const k of Object.keys(selectedByService)) c += selectedByService[k].size;
    return c;
  }, [selectedByService]);

  const subtotalSeleccionado = useMemo(() => {
    let sum = 0;

    for (const id of selectedByService.predial) {
      const r = predialRows.find((x) => x.id === id);
      if (r) sum += Number(r.total || 0);
    }
    for (const id of selectedByService.vehicular) {
      const r = vehicularRows.find((x) => x.id === id);
      if (r) sum += Number(r.total || 0);
    }
    for (const id of selectedByService.arbitrios) {
      const r = arbitriosAllRows.find((x) => x.id === id);
      if (r) sum += Number(r.total || 0);
    }
    for (const id of selectedByService.transito) {
      const r = transitoRows.find((x) => x.id === id);
      if (r) sum += Number(r.deuda || 0);
    }

    return sum;
  }, [selectedByService, predialRows, vehicularRows, arbitriosAllRows, transitoRows]);

  // =========================
  // ✅ Gates (habilitación secuencial)
  // =========================
  const canSelectPredial = useMemo(
    () => buildOldestYearGate(predialRows, (r) => r.anio, selectedByService.predial),
    [predialRows, selectedByService.predial]
  );

  const canSelectVehicular = useMemo(
    () => buildOldestYearGate(vehicularRows, (r) => r.anioSort, selectedByService.vehicular),
    [vehicularRows, selectedByService.vehicular]
  );

  // Arbitrios: aplico la regla solo sobre el predio filtrado (lo usual en kiosko)
  const canSelectArbitrios = useMemo(
    () => buildOldestYearGate(arbitriosRows, (r) => r.anio, selectedByService.arbitrios),
    [arbitriosRows, selectedByService.arbitrios]
  );

  const canSelectTransito = useMemo(
    () => buildOldestRowGateOrdered(transitoRows, selectedByService.transito),
    [transitoRows, selectedByService.transito]
  );

  // Modal salir
  const [confirmSalir, setConfirmSalir] = useState(false);

  // =========================
  // Tablas
  // =========================

  function PredialTable() {
    return (
      <TableShell
        title="Impuesto Predial"
        subtitle="Solo puede seleccionar el año más antiguo pendiente. Deslice hacia la derecha para ver todas las columnas."
        rightStat={{ label: "Subtotal", value: formatPEN(totals.predial) }}
      >
        <ScrollXTable
          storageKey="predial"
          scrollStoreRef={scrollStoreRef}
          minWidthClass="min-w-[1600px]"
        >
          <div className="grid grid-cols-10 gap-6 pb-3 border-b border-slate-200">
            <HeadCell align="center">ESTADO</HeadCell>
            <HeadCell align="center">AÑO</HeadCell>
            <HeadCell align="center">PERIODO</HeadCell>
            <HeadCell align="right">INSOLUTO</HeadCell>
            <HeadCell align="right">D. EMISIÓN</HeadCell>
            <HeadCell align="right">REAJUSTE</HeadCell>
            <HeadCell align="right">INTERÉS</HeadCell>
            <HeadCell align="right">BENEFICIO</HeadCell>
            <HeadCell align="right">TOTAL</HeadCell>
            <HeadCell align="center">✔</HeadCell>
          </div>

          <div className="mt-2">
            {predialRows.map((r) => {
              const allowed = canSelectPredial(r);
              const checked = selectedByService.predial.has(r.id);
              const disabled = !allowed && !checked;

              return (
                <div
                  key={r.id}
                  className="grid grid-cols-10 gap-6 items-center py-4 border-b border-slate-200"
                >
                  <BodyCell align="center" strong muted={disabled}>
                    {r.estado}
                  </BodyCell>
                  <BodyCell align="center" muted={disabled}>
                    {r.anio}
                  </BodyCell>
                  <BodyCell align="center" muted={disabled}>
                    {r.periodo}
                  </BodyCell>
                  <BodyCell align="right" muted={disabled}>
                    {formatPEN(r.insoluto)}
                  </BodyCell>
                  <BodyCell align="right" muted={disabled}>
                    {formatPEN(r.derEmision)}
                  </BodyCell>
                  <BodyCell align="right" muted={disabled}>
                    {formatPEN(r.reajuste)}
                  </BodyCell>
                  <BodyCell align="right" muted={disabled}>
                    {formatPEN(r.interes)}
                  </BodyCell>
                  <BodyCell align="right" muted={disabled}>
                    {formatPEN(r.beneficio)}
                  </BodyCell>
                  <BodyCell align="right" strong muted={disabled}>
                    {formatPEN(r.total)}
                  </BodyCell>
                  <CheckboxCell
                    checked={checked}
                    disabled={disabled}
                    onToggle={() => toggleRow("predial", r.id)}
                  />
                </div>
              );
            })}
          </div>
        </ScrollXTable>
      </TableShell>
    );
  }

  function VehicularTable() {
    return (
      <TableShell
        title="Impuesto Vehicular"
        subtitle="Solo puede seleccionar el periodo/año más antiguo pendiente. Deslice hacia la derecha para ver todas las columnas."
        rightStat={{ label: "Subtotal", value: formatPEN(totals.vehicular) }}
      >
        <ScrollXTable
          storageKey="vehicular"
          scrollStoreRef={scrollStoreRef}
          minWidthClass="min-w-[1600px]"
        >
          <div className="grid grid-cols-10 gap-6 pb-3 border-b border-slate-200">
            <HeadCell align="center">ESTADO</HeadCell>
            <HeadCell align="center">PLACA</HeadCell>
            <HeadCell align="center">PERIODO</HeadCell>
            <HeadCell align="right">INSOLUTO</HeadCell>
            <HeadCell align="right">DER. EM.</HeadCell>
            <HeadCell align="right">REAJUSTE</HeadCell>
            <HeadCell align="right">INTERÉS</HeadCell>
            <HeadCell align="right">BENEFICIO</HeadCell>
            <HeadCell align="right">TOTAL</HeadCell>
            <HeadCell align="center">✔</HeadCell>
          </div>

          <div className="mt-2">
            {vehicularRows.map((r) => {
              const allowed = canSelectVehicular(r);
              const checked = selectedByService.vehicular.has(r.id);
              const disabled = !allowed && !checked;

              return (
                <div
                  key={r.id}
                  className="grid grid-cols-10 gap-6 items-center py-4 border-b border-slate-200"
                >
                  <BodyCell align="center" strong muted={disabled}>
                    {r.estado}
                  </BodyCell>
                  <BodyCell align="center" strong muted={disabled}>
                    {r.placa}
                  </BodyCell>
                  <BodyCell align="center" muted={disabled}>
                    {r.periodo}
                  </BodyCell>
                  <BodyCell align="right" muted={disabled}>
                    {formatPEN(r.insoluto)}
                  </BodyCell>
                  <BodyCell align="right" muted={disabled}>
                    {formatPEN(r.derEm)}
                  </BodyCell>
                  <BodyCell align="right" muted={disabled}>
                    {formatPEN(r.reajuste)}
                  </BodyCell>
                  <BodyCell align="right" muted={disabled}>
                    {formatPEN(r.interes)}
                  </BodyCell>
                  <BodyCell align="right" muted={disabled}>
                    {formatPEN(r.beneficio)}
                  </BodyCell>
                  <BodyCell align="right" strong muted={disabled}>
                    {formatPEN(r.total)}
                  </BodyCell>
                  <CheckboxCell
                    checked={checked}
                    disabled={disabled}
                    onToggle={() => toggleRow("vehicular", r.id)}
                  />
                </div>
              );
            })}
          </div>
        </ScrollXTable>
      </TableShell>
    );
  }

  function ArbitriosTable() {
    return (
      <TableShell
        title="Arbitrios Municipales"
        subtitle="Seleccione un predio. Solo puede seleccionar el año más antiguo pendiente. Deslice hacia la derecha para ver todas las columnas."
        rightStat={{ label: "Subtotal (todos)", value: formatPEN(totals.arbitrios) }}
      >
        <div className="mb-8">
          <label className="block text-2xl font-extrabold text-slate-800 mb-3">
            Filtrar por predio
          </label>
          <select
            value={arbitriosPredioSel}
            onChange={(e) => setArbitriosPredioSel(e.target.value)}
            className="
              w-full h-20
              border border-slate-300
              px-5 text-2xl
              bg-white
              focus:outline-none focus:ring-4 focus:ring-blue-300
              rounded-none
            "
          >
            {arbitriosPredios.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <ScrollXTable
          storageKey="arbitrios"
          scrollStoreRef={scrollStoreRef}
          minWidthClass="min-w-[1500px]"
        >
          <div className="grid grid-cols-9 gap-6 pb-3 border-b border-slate-200">
            <HeadCell align="center">ESTADO</HeadCell>
            <HeadCell align="center">COD. USO</HeadCell>
            <HeadCell align="center">AÑO</HeadCell>
            <HeadCell align="center">PERIODO</HeadCell>
            <HeadCell align="right">INSOLUTO</HeadCell>
            <HeadCell align="right">INTERÉS</HeadCell>
            <HeadCell align="right">BENEFICIO</HeadCell>
            <HeadCell align="right">TOTAL</HeadCell>
            <HeadCell align="center">✔</HeadCell>
          </div>

          <div className="mt-2">
            {arbitriosRows.map((r) => {
              const allowed = canSelectArbitrios(r);
              const checked = selectedByService.arbitrios.has(r.id);
              const disabled = !allowed && !checked;

              return (
                <div
                  key={r.id}
                  className="grid grid-cols-9 gap-6 items-center py-4 border-b border-slate-200"
                >
                  <BodyCell align="center" strong muted={disabled}>
                    {r.estado}
                  </BodyCell>
                  <BodyCell align="center" strong muted={disabled}>
                    {r.codigoUso}
                  </BodyCell>
                  <BodyCell align="center" muted={disabled}>
                    {r.anio}
                  </BodyCell>
                  <BodyCell align="center" muted={disabled}>
                    {r.periodo}
                  </BodyCell>
                  <BodyCell align="right" muted={disabled}>
                    {formatPEN(r.insoluto)}
                  </BodyCell>
                  <BodyCell align="right" muted={disabled}>
                    {formatPEN(r.interes)}
                  </BodyCell>
                  <BodyCell align="right" muted={disabled}>
                    {formatPEN(r.beneficio)}
                  </BodyCell>
                  <BodyCell align="right" strong muted={disabled}>
                    {formatPEN(r.total)}
                  </BodyCell>
                  <CheckboxCell
                    checked={checked}
                    disabled={disabled}
                    onToggle={() => toggleRow("arbitrios", r.id)}
                  />
                </div>
              );
            })}
          </div>
        </ScrollXTable>
      </TableShell>
    );
  }

  function TransitoTable() {
    return (
      <TableShell
        title="Infracciones de Tránsito"
        subtitle="Solo puede seleccionar la infracción más antigua pendiente. Deslice hacia la derecha para ver todas las columnas."
        rightStat={{ label: "Deuda total", value: formatPEN(totals.transito) }}
      >
        <ScrollXTable
          storageKey="transito"
          scrollStoreRef={scrollStoreRef}
          minWidthClass="min-w-[1900px]"
        >
          <div className="grid grid-cols-11 gap-6 pb-3 border-b border-slate-200">
            <HeadCell align="center">NRO. INF.</HeadCell>
            <HeadCell align="center">PLACA</HeadCell>
            <HeadCell align="center">TIPO INF.</HeadCell>
            <HeadCell align="center">FEC INF.</HeadCell>
            <HeadCell align="center">FEC. VENC.</HeadCell>
            <HeadCell>INFRACTOR</HeadCell>
            <HeadCell align="right">TOTAL</HeadCell>
            <HeadCell align="right">DSCTO</HeadCell>
            <HeadCell align="right">P. ACUENTA</HeadCell>
            <HeadCell align="right">DEUDA</HeadCell>
            <HeadCell align="center">✔</HeadCell>
          </div>

          <div className="mt-2">
            {transitoRows.map((r) => {
              const allowed = canSelectTransito(r);
              const checked = selectedByService.transito.has(r.id);
              const disabled = !allowed && !checked;

              return (
                <div
                  key={r.id}
                  className="grid grid-cols-11 gap-6 items-center py-4 border-b border-slate-200"
                >
                  <BodyCell align="center" strong muted={disabled}>
                    {r.nroInf}
                  </BodyCell>
                  <BodyCell align="center" strong muted={disabled}>
                    {r.placa}
                  </BodyCell>
                  <BodyCell align="center" muted={disabled}>
                    {r.tipoInf}
                  </BodyCell>
                  <BodyCell align="center" muted={disabled}>
                    {r.fecInf}
                  </BodyCell>
                  <BodyCell align="center" muted={disabled}>
                    {r.fecVenc}
                  </BodyCell>
                  <BodyCell muted={disabled}>{r.infractor}</BodyCell>
                  <BodyCell align="right" muted={disabled}>
                    {formatPEN(r.total)}
                  </BodyCell>
                  <BodyCell align="right" muted={disabled}>
                    {formatPEN(r.dscto)}
                  </BodyCell>
                  <BodyCell align="right" muted={disabled}>
                    {formatPEN(r.pacuenta)}
                  </BodyCell>
                  <BodyCell align="right" strong muted={disabled}>
                    {formatPEN(r.deuda)}
                  </BodyCell>
                  <CheckboxCell
                    checked={checked}
                    disabled={disabled}
                    onToggle={() => toggleRow("transito", r.id)}
                  />
                </div>
              );
            })}
          </div>
        </ScrollXTable>
      </TableShell>
    );
  }

  const activeDetail = useMemo(() => {
    switch (activeService) {
      case "predial":
        return <PredialTable />;
      case "vehicular":
        return <VehicularTable />;
      case "arbitrios":
        return <ArbitriosTable />;
      case "transito":
        return <TransitoTable />;
      default:
        return <PredialTable />;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeService,
    selectedByService, // re-render necesario para habilitar/deshabilitar
    arbitriosPredioSel,
    arbitriosRows,
    canSelectPredial,
    canSelectVehicular,
    canSelectArbitrios,
    canSelectTransito,
    totals,
  ]);

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
            alt="Logo"
            className="h-24 md:h-28 object-contain p-3"
          />

          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold">
              Estado de Cuenta
            </h1>
            <p className="text-[#0F70B3] text-xl md:text-2xl mt-2">
              Resumen de deudas pendientes
            </p>
          </div>
        </motion.header>

        {/* BODY */}
        <motion.main
          variants={container}
          className="flex-1 bg-slate-100 px-10 py-10 overflow-auto"
        >
          <div className="max-w-6xl mx-auto">
            {/* Contribuyente */}
            <motion.div
              variants={itemUp}
              className="bg-white shadow-2xl rounded-none p-10 border border-slate-200 mb-10"
            >
              <div className="text-slate-500 text-xl">Contribuyente</div>
              <div className="text-slate-900 text-4xl font-extrabold mt-2 wrap-break-word">
                {contribuyente.nombreRazonSocial}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-8">
                <div className="text-slate-700 text-2xl">
                  <span className="font-extrabold">Código:</span>{" "}
                  {contribuyente.codigoContribuyente}
                </div>
                <div className="text-slate-700 text-2xl text-right">
                  <span className="font-extrabold">Documento:</span>{" "}
                  {contribuyente.tipoDoc} {contribuyente.nroDoc}
                </div>
              </div>
            </motion.div>

            {/* Total + carrito */}
            <motion.div
              variants={itemUp}
              className="
                bg-white shadow-2xl rounded-none p-10 border border-slate-200
                flex items-center justify-between mb-10
              "
            >
              <div>
                <div className="text-slate-500 text-xl">Total pendiente</div>
                <div className="text-slate-900 text-6xl font-extrabold mt-2">
                  {formatPEN(totalGeneral)}
                </div>

                {selectedCount > 0 && (
                  <div className="mt-4 text-slate-700 text-2xl font-extrabold">
                    Seleccionado: {selectedCount} item(s) —{" "}
                    <span className="text-slate-900">
                      {formatPEN(subtotalSeleccionado)}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="text-slate-500 text-lg">Carrito</div>
                <button
                  type="button"
                  onClick={() => navigate("/carrito")}
                  className="
                    mt-3 h-20 px-10
                    bg-amber-500 hover:bg-amber-600
                    text-white text-2xl font-extrabold
                    shadow-xl rounded-none
                    active:scale-[0.98]
                    inline-flex items-center justify-center gap-4
                  "
                >
                  <BiCartAlt className="text-4xl" />
                  Ir al carrito
                  {selectedCount > 0 && (
                    <span className="ml-3 bg-white/20 px-4 py-2 text-xl">
                      {selectedCount}
                    </span>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Dashboard 2x2 */}
            <div className="grid grid-cols-2 gap-10">
              <SummaryCard
                title="Impuesto Predial"
                icon={<BiHomeAlt2 />}
                amount={totals.predial}
                bgClass="bg-blue-700 hover:bg-blue-800"
                active={activeService === "predial"}
                onClick={() => setActiveService("predial")}
              />
              <SummaryCard
                title="Impuesto Vehicular"
                icon={<BiCar />}
                amount={totals.vehicular}
                bgClass="bg-amber-500 hover:bg-amber-600"
                active={activeService === "vehicular"}
                onClick={() => setActiveService("vehicular")}
              />
              <SummaryCard
                title="Arbitrios Municipales"
                icon={<BiBuildingHouse />}
                amount={totals.arbitrios}
                bgClass="bg-slate-700 hover:bg-slate-800"
                active={activeService === "arbitrios"}
                onClick={() => setActiveService("arbitrios")}
              />
              <SummaryCard
                title="Infracciones de Tránsito"
                icon={<BiTrafficCone />}
                amount={totals.transito}
                bgClass="bg-sky-700 hover:bg-sky-800"
                active={activeService === "transito"}
                onClick={() => setActiveService("transito")}
              />
            </div>

            {/* DETALLE */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.18 }}
              >
                {activeDetail}
              </motion.div>
            </AnimatePresence>

            {/* Salir grande */}
            <div className="mt-12">
              <button
                type="button"
                onClick={() => setConfirmSalir(true)}
                className="
                  w-full h-24
                  bg-red-600 hover:bg-red-700
                  text-white text-3xl font-extrabold
                  shadow-2xl rounded-none
                  active:scale-[0.98]
                  inline-flex items-center justify-center gap-4
                "
              >
                <BiExit className="text-5xl" />
                Salir
              </button>
            </div>
          </div>
        </motion.main>

        <motion.footer
          variants={itemUp}
          className="py-6 text-center text-slate-400 text-base bg-white border-t"
        >
          Municipalidad Provincial de Arequipa
        </motion.footer>
      </div>

      {/* MODAL SALIR */}
      <AnimatePresence>
        {confirmSalir && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="
                w-full max-w-3xl
                bg-white rounded-none shadow-2xl
                border border-slate-200 p-10
              "
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="text-slate-900 text-4xl font-extrabold">
                    ¿Desea salir?
                  </div>
                  <div className="mt-3 text-slate-600 text-2xl">
                    Volverá al inicio del kiosko.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setConfirmSalir(false)}
                  className="
                    w-16 h-16
                    bg-slate-100 hover:bg-slate-200
                    text-slate-800 text-4xl
                    rounded-none border border-slate-200
                    flex items-center justify-center
                    active:scale-[0.95]
                  "
                  aria-label="Cerrar"
                >
                  <BiX />
                </button>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-8">
                <button
                  type="button"
                  onClick={() => setConfirmSalir(false)}
                  className="
                    h-24
                    bg-slate-700 hover:bg-slate-800
                    text-white text-3xl font-extrabold
                    shadow-xl rounded-none
                    active:scale-[0.98]
                  "
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setConfirmSalir(false);
                    navigate("/");
                  }}
                  className="
                    h-24
                    bg-red-600 hover:bg-red-700
                    text-white text-3xl font-extrabold
                    shadow-xl rounded-none
                    active:scale-[0.98]
                    inline-flex items-center justify-center gap-4
                  "
                >
                  <BiExit className="text-5xl" />
                  Salir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
