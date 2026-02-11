import { useMemo, useRef, useState, useLayoutEffect, useEffect } from "react";
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
import {
  traerDeudaImpuestos,
  traerPredios,
  traerDeudaArbitrios,
  traerDeudaInfracciones,
} from "../services/impuestosService";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

const clickSound = new Audio("/click.mp3");

function safePlayClick() {
  try {
    clickSound.currentTime = 0;
    clickSound.play();
  } catch {}
}

function formatPEN(amount) {
  const n = Number(amount || 0);
  return n.toLocaleString("es-PE", { style: "currency", currency: "PEN" });
}

function parseDateDMY(dmy) {
  if (!dmy) return new Date(0);
  const [dd, mm, yyyy] = String(dmy).split("/");
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}

function isoToDMY(iso) {
  if (!iso) return "";
  // iso: YYYY-MM-DD
  const [y, m, d] = String(iso).slice(0, 10).split("-");
  if (!y || !m || !d) return "";
  return `${d}/${m}/${y}`;
}

/**
 * Gate por "año más antiguo pendiente" (SOLO Predial y Arbitrios):
 * habilita únicamente el año más antiguo que aún no está completamente seleccionado.
 */
function buildOldestYearGate(rows, yearGetter, selectedSet) {
  const byYear = new Map();
  for (const r of rows) {
    const y = yearGetter(r);
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y).push(r);
  }

  const years = Array.from(byYear.keys()).sort((a, b) => a - b);

  let oldestIncompleteYear = null;
  for (const y of years) {
    const list = byYear.get(y) || [];
    const allChecked = list.every((row) => selectedSet.has(row.id));
    if (!allChecked) {
      oldestIncompleteYear = y;
      break;
    }
  }

  if (oldestIncompleteYear === null) return () => true;
  return (row) => yearGetter(row) === oldestIncompleteYear;
}

/**
 * Scroll X persistente por tabla
 */
function ScrollXTable({ storageKey, scrollStoreRef, minWidthClass, children }) {
  const scrollerRef = useRef(null);

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const saved = scrollStoreRef.current?.[storageKey];
    if (typeof saved === "number") el.scrollLeft = saved;
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

function HeadCell({ children, align = "left" }) {
  return (
    <div
      className={`text-slate-500 text-lg font-extrabold ${
        align === "right" ? "text-right" : align === "center" ? "text-center" : ""
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
      } ${align === "right" ? "text-right" : align === "center" ? "text-center" : ""}`}
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

function TableShell({ title, subtitle, rightStat, children }) {
  return (
    <div className="mt-12 bg-white shadow-2xl border border-slate-200 rounded-none p-10">
      <div className="flex items-start justify-between gap-8">
        <div>
          <div className="text-slate-500 text-xl">Detalle</div>
          <div className="text-slate-900 text-4xl font-extrabold mt-2">{title}</div>
          <div className="mt-2 text-slate-600 text-xl">{subtitle}</div>
        </div>

        {rightStat ? (
          <div className="text-right">
            <div className="text-slate-500 text-lg">{rightStat.label}</div>
            <div className="text-slate-900 text-4xl font-extrabold mt-2">{rightStat.value}</div>
          </div>
        ) : null}
      </div>

      <div className="mt-10">{children}</div>
    </div>
  );
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
        <div className="text-2xl md:text-3xl font-extrabold leading-tight">{title}</div>
        <div className="mt-3 text-4xl md:text-5xl font-extrabold">{formatPEN(amount)}</div>
        <div className="mt-2 text-white/85 text-lg">{active ? "Mostrando detalle" : "Ver detalle"}</div>
      </div>
    </motion.button>
  );
}

/**
 *Tabs tipo navegador (con línea inferior y tab activo “encima”)
 */
function ContribuyenteTabsBrowser({ items, activeIndex, onChange }) {
  const scrollerRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  function updateArrows() {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 5);
    setCanRight(el.scrollLeft < max - 5);
  }

  function scrollByAmount(dir) {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(380, Math.floor(el.clientWidth * 0.65));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  function scrollTabIntoView(idx) {
    const el = scrollerRef.current;
    if (!el) return;

    const tab = el.querySelector(`[data-tab-index="${idx}"]`);
    if (!tab) return;

    const tabLeft = tab.offsetLeft;
    const tabRight = tabLeft + tab.offsetWidth;
    const viewLeft = el.scrollLeft;
    const viewRight = viewLeft + el.clientWidth;

    if (tabLeft < viewLeft) {
      el.scrollTo({ left: Math.max(0, tabLeft - 24), behavior: "smooth" });
    } else if (tabRight > viewRight) {
      el.scrollTo({
        left: Math.min(el.scrollWidth, tabRight - el.clientWidth + 24),
        behavior: "smooth",
      });
    }
  }

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;

    const onResize = () => updateArrows();
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    scrollTabIntoView(activeIndex);
    const t = setTimeout(updateArrows, 250);
    return () => clearTimeout(t);
  }, [activeIndex]);

  return (
    <motion.div
      variants={itemUp}
      className="bg-white shadow-2xl border border-slate-200 rounded-none mb-10"
    >
      <div className="px-8 pt-6 text-slate-500 text-xl">Seleccione contribuyente</div>

      <div className="mt-4 px-4 pb-0">
        <div className="flex items-stretch gap-3">
          <button
            type="button"
            onClick={() => {
              safePlayClick();
              scrollByAmount(-1);
            }}
            disabled={!canLeft}
            className={`
              w-20
              bg-slate-100 hover:bg-slate-200
              border border-slate-200
              text-slate-800
              text-5xl
              rounded-none
              flex items-center justify-center
              active:scale-[0.97]
              ${!canLeft ? "opacity-30 cursor-not-allowed" : ""}
            `}
            aria-label="Desplazar a la izquierda"
          >
            ‹
          </button>

          <div ref={scrollerRef} className="flex-1 overflow-x-auto" onScroll={updateArrows}>
            <div className="min-w-max flex gap-0">
              {items.map((c, idx) => {
                const active = idx === activeIndex;

                return (
                  <button
                    key={`${c.codigo}-${idx}`}
                    data-tab-index={idx}
                    type="button"
                    onClick={() => {
                      safePlayClick();
                      onChange(idx);
                    }}
                    className={`
                      relative
                      px-8 py-4
                      text-2xl font-extrabold
                      whitespace-nowrap
                      border-t border-l border-r
                      ${active ? "bg-white text-slate-900 border-slate-300" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}
                      rounded-t-xl
                      transition
                    `}
                  >
                    <span>{c.nombre}</span>
                    <span className={`ml-4 font-bold ${active ? "text-slate-500" : "text-slate-400"}`}>
                      #{c.codigo}
                    </span>

                    {active && <span className="absolute left-0 right-0 -bottom-0.5 h-0.75 bg-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              safePlayClick();
              scrollByAmount(1);
            }}
            disabled={!canRight}
            className={`
              w-20
              bg-slate-100 hover:bg-slate-200
              border border-slate-200
              text-slate-800
              text-5xl
              rounded-none
              flex items-center justify-center
              active:scale-[0.97]
              ${!canRight ? "opacity-30 cursor-not-allowed" : ""}
            `}
            aria-label="Desplazar a la derecha"
          >
            ›
          </button>
        </div>
      </div>

      <div className="border-b border-slate-300" />

      <div className="px-8 py-6">
        <div className="text-slate-700 text-xl">
          <span className="font-extrabold">Activo:</span> {items[activeIndex]?.nombre} —{" "}
          <span className="font-extrabold">Código:</span> {items[activeIndex]?.codigo}
          {items[activeIndex]?.tipoPersona ? (
            <>
              {" "}
              — <span className="font-extrabold">Tipo:</span> {items[activeIndex].tipoPersona}
            </>
          ) : null}
        </div>

        {items[activeIndex]?.direccion ? (
          <div className="mt-3 text-slate-600 text-xl">
            <span className="font-extrabold">Dirección:</span> {items[activeIndex].direccion}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

export default function EstadoCuenta() {
  const navigate = useNavigate();
  const location = useLocation();

  const nroDoc = location.state?.nroDoc || "";
  const tipoDocLabel = location.state?.tipoDocLabel || "DNI";

  const contribuyentes = useMemo(() => {
    const list = location.state?.contribuyentes;
    if (!Array.isArray(list) || list.length === 0) return [];

    // Normalizamos el response real:
    // adm_vcodigo, per_vnombre_completo, dir_vdireccion_completa, tipadm_vabreviacion
    return list.map((c) => ({
      codigo: c.adm_vcodigo ?? c.codigo ?? "",
      admCodigo: c.adm_vcodigo ?? c.admCodigo ?? "",
      nombre: c.per_vnombre_completo ?? c.nombre ?? "—",
      direccion: c.dir_vdireccion_completa ?? c.direccion ?? "",
      tipoPersona: c.tipadm_vabreviacion ?? c.tipper_vabreviacion ?? c.tipoPersona ?? "",
    }));
  }, [location.state]);

  useEffect(() => {
    if (!nroDoc) navigate("/login", { replace: true });
  }, [nroDoc, navigate]);

  const [contribIndex, setContribIndex] = useState(0);
  const activeContrib = contribuyentes[contribIndex] || contribuyentes[0];

  const scrollStoreRef = useRef({
    predial: 0,
    vehicular: 0,
    arbitrios: 0,
    transito: 0,
  });

  const [activeService, setActiveService] = useState("predial");

  const [selectedByService, setSelectedByService] = useState(() => ({
    predial: new Set(),
    vehicular: new Set(),
    arbitrios: new Set(),
    transito: new Set(),
  }));

  const [confirmSalir, setConfirmSalir] = useState(false);

  // ===== DATA REAL =====
  const [predialRows, setPredialRows] = useState([]);
  const [vehicularRows, setVehicularRows] = useState([]);
  const [arbitriosAllRows, setArbitriosAllRows] = useState([]);
  const [transitoRows, setTransitoRows] = useState([]);

  const [prediosOptions, setPrediosOptions] = useState([]); // [{uso_vcodigo, vdireccion_completa}]
  const [arbitriosPredioSel, setArbitriosPredioSel] = useState("");

  // Fetch por contribuyente activo
  useEffect(() => {
    const admCodigo = String(activeContrib?.admCodigo || "").trim();
    if (!admCodigo) return;

    let alive = true;

    async function loadAll() {
      try {
        const [predialRes, vehicularRes, prediosRes, arbitriosRes, transitoRes] = await Promise.allSettled([
          traerDeudaImpuestos({ conApagId: 1, admCodigo }),
          traerDeudaImpuestos({ conApagId: 2, admCodigo }),
          traerPredios(admCodigo),
          traerDeudaArbitrios(admCodigo),
          traerDeudaInfracciones({ infractorDni: nroDoc }),
        ]);

        if (!alive) return;

        // Predial
        const predialDato = predialRes.status === "fulfilled" ? (predialRes.value?.dato ?? []) : [];
        setPredialRows(
          Array.isArray(predialDato)
            ? predialDato
                .map((r) => ({
                  id: String(r.ctacte_iid ?? `${r.ctacte_ianio}-${r.ctacte_iperiodo}-${Math.random()}`),
                  estado: r.ctacte_vestado ?? "",
                  anio: Number(r.ctacte_ianio ?? 0),
                  periodo: String(r.ctacte_iperiodo ?? ""),
                  insoluto: Number(r.ninsoluto ?? 0),
                  derEmision: Number(r.nderecho ?? 0),
                  reajuste: Number(r.nreajuste ?? 0),
                  interes: Number(r.ninteres ?? 0),
                  beneficio: Number(r.nbeneficio ?? 0),
                  total: Number(r.ntotal ?? 0),
                }))
                .sort((a, b) => (a.anio - b.anio) || String(a.periodo).localeCompare(String(b.periodo)))
            : []
        );

        // Vehicular
        const vehicularDato = vehicularRes.status === "fulfilled" ? (vehicularRes.value?.dato ?? []) : [];
        setVehicularRows(
          Array.isArray(vehicularDato)
            ? vehicularDato
                .map((r) => ({
                  id: String(r.ctacte_iid ?? `${r.ctacte_ianio}-${r.ctacte_iperiodo}-${r.ctacte_vplaca}-${Math.random()}`),
                  estado: r.ctacte_vestado ?? "",
                  placa: r.ctacte_vplaca ?? "",
                  periodo: r.periodo ?? String(r.ctacte_ianio ?? ""),
                  insoluto: Number(r.ninsoluto ?? 0),
                  derEm: Number(r.nderecho ?? 0),
                  reajuste: Number(r.nreajuste ?? 0),
                  interes: Number(r.ninteres ?? 0),
                  beneficio: Number(r.nbeneficio ?? 0),
                  total: Number(r.ntotal ?? 0),
                }))
                .sort((a, b) => String(a.periodo).localeCompare(String(b.periodo)))
            : []
        );

        // Predios (combo)
        const prediosDato = prediosRes.status === "fulfilled" ? (prediosRes.value?.dato ?? []) : [];
        const prediosArr = Array.isArray(prediosDato) ? prediosDato : [];
        setPrediosOptions(prediosArr);

        // Selección inicial de predio
        const firstUso = prediosArr[0]?.uso_vcodigo ?? "";
        setArbitriosPredioSel((prev) => prev || firstUso);

        // Arbitrios
        const arbitriosDato = arbitriosRes.status === "fulfilled" ? (arbitriosRes.value?.dato ?? []) : [];
        setArbitriosAllRows(
          Array.isArray(arbitriosDato)
            ? arbitriosDato
                .map((r) => ({
                  id: `${r.uso_vcodigo}-${r.ctacte_ianio}-${r.ctacte_iperiodo}-${r.ctacte_iid_tem ?? "0"}`,
                  predio: String(r.uso_vcodigo ?? ""), // value real (uso_vcodigo)
                  estado: r.ctacte_vestado ?? "",
                  codigoUso: String(r.uso_vcodigo ?? ""),
                  anio: Number(r.ctacte_ianio ?? 0),
                  periodo: String(r.ctacte_iperiodo ?? ""),
                  insoluto: Number(r.ninsoluto ?? 0),
                  interes: Number(r.ninteres ?? 0),
                  beneficio: Number(r.nbeneficio ?? 0),
                  total: Number(r.ntotal ?? 0),
                }))
                .sort((a, b) => (a.anio - b.anio) || String(a.periodo).localeCompare(String(b.periodo)))
            : []
        );

        // Tránsito (infracciones)
        const transitoDato = transitoRes.status === "fulfilled" ? (transitoRes.value?.dato ?? []) : [];
        setTransitoRows(
          Array.isArray(transitoDato)
            ? transitoDato
                .map((r) => ({
                  id: String(r.ctacte_id ?? `${r.nro_doc_cargo}-${Math.random()}`),
                  nroInf: r.nro_doc_cargo ?? "",
                  placa: r.placa_ ?? "",
                  tipoInf: r.tipo_inf ?? "",
                  fecInf: isoToDMY(r.fecha_cargo),
                  fecVenc: isoToDMY(r.fecha_ven_cargo),
                  infractor: r.nomcompleto_inf ?? "",
                  total: Number(r.total_ ?? 0),
                  dscto: Number(r.dsct_ ?? 0),
                  pacuenta: Number(r.pago_acuenta ?? 0),
                  deuda: Number(r.saldo_ ?? 0),
                }))
                .sort((a, b) => parseDateDMY(a.fecInf) - parseDateDMY(b.fecInf))
            : []
        );
      } catch {
        if (!alive) return;
        setPredialRows([]);
        setVehicularRows([]);
        setArbitriosAllRows([]);
        setTransitoRows([]);
        setPrediosOptions([]);
        setArbitriosPredioSel("");
      }
    }

    loadAll();

    return () => {
      alive = false;
    };
  }, [activeContrib?.admCodigo, nroDoc]);

  const arbitriosRows = useMemo(() => {
    const uso = String(arbitriosPredioSel || "");
    const filtered = arbitriosAllRows.filter((r) => (uso ? r.predio === uso : true));
    return [...filtered].sort((a, b) => a.anio - b.anio);
  }, [arbitriosAllRows, arbitriosPredioSel]);

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

  const canSelectPredial = useMemo(
    () => buildOldestYearGate(predialRows, (r) => r.anio, selectedByService.predial),
    [predialRows, selectedByService.predial]
  );

  const canSelectArbitrios = useMemo(
    () => buildOldestYearGate(arbitriosRows, (r) => r.anio, selectedByService.arbitrios),
    [arbitriosRows, selectedByService.arbitrios]
  );

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

  useEffect(() => {
    setSelectedByService({
      predial: new Set(),
      vehicular: new Set(),
      arbitrios: new Set(),
      transito: new Set(),
    });
    scrollStoreRef.current = { predial: 0, vehicular: 0, arbitrios: 0, transito: 0 };
    setActiveService("predial");
  }, [contribIndex]);

  // ===== TABLAS =====

  function PredialTable() {
    return (
      <TableShell
        title="Impuesto Predial"
        subtitle="Solo puede seleccionar el año más antiguo pendiente. Deslice hacia la derecha para ver todas las columnas."
        rightStat={{ label: "Subtotal", value: formatPEN(totals.predial) }}
      >
        <ScrollXTable storageKey="predial" scrollStoreRef={scrollStoreRef} minWidthClass="min-w-[1600px]">
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
                <div key={r.id} className="grid grid-cols-10 gap-6 items-center py-4 border-b border-slate-200">
                  <BodyCell align="center" strong muted={disabled}>{r.estado}</BodyCell>
                  <BodyCell align="center" muted={disabled}>{r.anio}</BodyCell>
                  <BodyCell align="center" muted={disabled}>{r.periodo}</BodyCell>
                  <BodyCell align="right" muted={disabled}>{formatPEN(r.insoluto)}</BodyCell>
                  <BodyCell align="right" muted={disabled}>{formatPEN(r.derEmision)}</BodyCell>
                  <BodyCell align="right" muted={disabled}>{formatPEN(r.reajuste)}</BodyCell>
                  <BodyCell align="right" muted={disabled}>{formatPEN(r.interes)}</BodyCell>
                  <BodyCell align="right" muted={disabled}>{formatPEN(r.beneficio)}</BodyCell>
                  <BodyCell align="right" strong muted={disabled}>{formatPEN(r.total)}</BodyCell>
                  <CheckboxCell checked={checked} disabled={disabled} onToggle={() => toggleRow("predial", r.id)} />
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
        subtitle="Puede seleccionar cualquier periodo. Deslice hacia la derecha para ver todas las columnas."
        rightStat={{ label: "Subtotal", value: formatPEN(totals.vehicular) }}
      >
        <ScrollXTable storageKey="vehicular" scrollStoreRef={scrollStoreRef} minWidthClass="min-w-[1600px]">
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
              const checked = selectedByService.vehicular.has(r.id);

              return (
                <div key={r.id} className="grid grid-cols-10 gap-6 items-center py-4 border-b border-slate-200">
                  <BodyCell align="center" strong>{r.estado}</BodyCell>
                  <BodyCell align="center" strong>{r.placa}</BodyCell>
                  <BodyCell align="center">{r.periodo}</BodyCell>
                  <BodyCell align="right">{formatPEN(r.insoluto)}</BodyCell>
                  <BodyCell align="right">{formatPEN(r.derEm)}</BodyCell>
                  <BodyCell align="right">{formatPEN(r.reajuste)}</BodyCell>
                  <BodyCell align="right">{formatPEN(r.interes)}</BodyCell>
                  <BodyCell align="right">{formatPEN(r.beneficio)}</BodyCell>
                  <BodyCell align="right" strong>{formatPEN(r.total)}</BodyCell>
                  <CheckboxCell checked={checked} onToggle={() => toggleRow("vehicular", r.id)} />
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
          <label className="block text-2xl font-extrabold text-slate-800 mb-3">Filtrar por predio</label>
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
            {prediosOptions.map((p) => (
              <option key={p.uso_vcodigo} value={p.uso_vcodigo}>
                {p.vdireccion_completa}
              </option>
            ))}
          </select>
        </div>

        <ScrollXTable storageKey="arbitrios" scrollStoreRef={scrollStoreRef} minWidthClass="min-w-[1500px]">
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
                <div key={r.id} className="grid grid-cols-9 gap-6 items-center py-4 border-b border-slate-200">
                  <BodyCell align="center" strong muted={disabled}>{r.estado}</BodyCell>
                  <BodyCell align="center" strong muted={disabled}>{r.codigoUso}</BodyCell>
                  <BodyCell align="center" muted={disabled}>{r.anio}</BodyCell>
                  <BodyCell align="center" muted={disabled}>{r.periodo}</BodyCell>
                  <BodyCell align="right" muted={disabled}>{formatPEN(r.insoluto)}</BodyCell>
                  <BodyCell align="right" muted={disabled}>{formatPEN(r.interes)}</BodyCell>
                  <BodyCell align="right" muted={disabled}>{formatPEN(r.beneficio)}</BodyCell>
                  <BodyCell align="right" strong muted={disabled}>{formatPEN(r.total)}</BodyCell>
                  <CheckboxCell checked={checked} disabled={disabled} onToggle={() => toggleRow("arbitrios", r.id)} />
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
        subtitle="Puede seleccionar cualquier infracción. Deslice hacia la derecha para ver todas las columnas."
        rightStat={{ label: "Deuda total", value: formatPEN(totals.transito) }}
      >
        <ScrollXTable storageKey="transito" scrollStoreRef={scrollStoreRef} minWidthClass="min-w-[1900px]">
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
              const checked = selectedByService.transito.has(r.id);

              return (
                <div key={r.id} className="grid grid-cols-11 gap-6 items-center py-4 border-b border-slate-200">
                  <BodyCell align="center" strong>{r.nroInf}</BodyCell>
                  <BodyCell align="center" strong>{r.placa}</BodyCell>
                  <BodyCell align="center">{r.tipoInf}</BodyCell>
                  <BodyCell align="center">{r.fecInf}</BodyCell>
                  <BodyCell align="center">{r.fecVenc}</BodyCell>
                  <BodyCell>{r.infractor}</BodyCell>
                  <BodyCell align="right">{formatPEN(r.total)}</BodyCell>
                  <BodyCell align="right">{formatPEN(r.dscto)}</BodyCell>
                  <BodyCell align="right">{formatPEN(r.pacuenta)}</BodyCell>
                  <BodyCell align="right" strong>{formatPEN(r.deuda)}</BodyCell>
                  <CheckboxCell checked={checked} onToggle={() => toggleRow("transito", r.id)} />
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
  }, [activeService, selectedByService, arbitriosPredioSel, arbitriosRows, canSelectPredial, canSelectArbitrios, totals]);

  return (
    <motion.div className="w-screen h-screen bg-slate-200" variants={container} initial="hidden" animate="show">
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

          <img src={logo} alt="Logo" className="h-24 md:h-28 object-contain p-3" />

          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold">Estado de Cuenta</h1>
            <p className="text-[#0F70B3] text-xl md:text-2xl mt-2">
              Documento: <span className="font-extrabold">{tipoDocLabel} {nroDoc}</span>
            </p>
          </div>
        </motion.header>

        {/* BODY */}
        <motion.main variants={container} className="flex-1 bg-slate-100 px-10 py-10 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {contribuyentes.length >= 2 && (
              <ContribuyenteTabsBrowser items={contribuyentes} activeIndex={contribIndex} onChange={setContribIndex} />
            )}

            <motion.div variants={itemUp} className="bg-white shadow-2xl rounded-none p-10 border border-slate-200 mb-10">
              <div className="text-slate-500 text-xl">Contribuyente activo</div>
              <div className="text-slate-900 text-4xl font-extrabold mt-2 wrap-break-word">
                {activeContrib?.nombre || "—"}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-8">
                <div className="text-slate-700 text-2xl">
                  <span className="font-extrabold">Código:</span> {activeContrib?.codigo || "—"}
                </div>
                <div className="text-slate-700 text-2xl text-right">
                  <span className="font-extrabold">Documento:</span> {tipoDocLabel} {nroDoc}
                </div>
              </div>

              {activeContrib?.direccion && (
                <div className="mt-6 text-slate-700 text-2xl">
                  <span className="font-extrabold">Dirección:</span> {activeContrib.direccion}
                </div>
              )}
            </motion.div>

            <motion.div
              variants={itemUp}
              className="
                bg-white shadow-2xl rounded-none p-10 border border-slate-200
                flex items-center justify-between mb-10
              "
            >
              <div>
                <div className="text-slate-500 text-xl">Total pendiente</div>
                <div className="text-slate-900 text-6xl font-extrabold mt-2">{formatPEN(totalGeneral)}</div>

                {selectedCount > 0 && (
                  <div className="mt-4 text-slate-700 text-2xl font-extrabold">
                    Seleccionado: {selectedCount} item(s) —{" "}
                    <span className="text-slate-900">{formatPEN(subtotalSeleccionado)}</span>
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
                    <span className="ml-3 bg-white/20 px-4 py-2 text-xl">{selectedCount}</span>
                  )}
                </button>
              </div>
            </motion.div>

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

        <motion.footer variants={itemUp} className="py-6 text-center text-slate-400 text-base bg-white border-t">
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
                  <div className="text-slate-900 text-4xl font-extrabold">¿Desea salir?</div>
                  <div className="mt-3 text-slate-600 text-2xl">Volverá al inicio del kiosko.</div>
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
