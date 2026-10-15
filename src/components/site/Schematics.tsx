import type { ReactNode } from "react";

/*
 * Schematics: hairline technical drawings for the "lighting studio" redesign.
 *
 * Every stroked element carries pathLength={1} and the `schem-draw` class so the
 * site can animate stroke-dashoffset 1 -> 0 and have the drawing draw itself.
 * Elements are authored in drawing order: outline, structure, detail, accent.
 *   schem-draw    line work that draws on
 *   schem-accent  tungsten accent (stroke: var(--spark))
 *   schem-dim     dashed construction / hidden lines that fade in instead
 *   schem-dot     tiny solid terminals and rivets
 */

export type SchematicProps = { className?: string; title?: string };

const NS = "non-scaling-stroke";

/** Primary line work (stroke inherited: currentColor). */
const draw = { className: "schem-draw", pathLength: 1, vectorEffect: NS } as const;
/** Tungsten accent line work. */
const accent = {
  className: "schem-draw schem-accent",
  pathLength: 1,
  vectorEffect: NS,
  stroke: "var(--spark)",
} as const;
/** Dashed construction / hidden lines (fade, never draw). */
const dim = {
  className: "schem-dim",
  strokeDasharray: "2 4",
  strokeWidth: 0.5,
  vectorEffect: NS,
} as const;
/** Small solid terminals and rivets. */
const dot = { className: "schem-dot", fill: "currentColor", stroke: "none" } as const;

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Architectural slash tick centred on a dimension end point. */
const tick = (x: number, y: number) => `M${x - 4} ${y + 4} L${x + 4} ${y - 4}`;

/** Arc below a centre point, from `a0` to `a1` degrees (0 = right, 90 = straight down). */
function arcBelow(cx: number, cy: number, r: number, a0 = 36, a1 = 144) {
  const p = (deg: number) => {
    const t = (deg * Math.PI) / 180;
    return `${r2(cx + r * Math.cos(t))} ${r2(cy + r * Math.sin(t))}`;
  };
  return `M${p(a0)} A${r} ${r} 0 0 1 ${p(a1)}`;
}

/** Looped (prolate cycloid) filament between two support tips. */
function loopedFilament(x0: number, x1: number, y: number, loops: number, b: number) {
  const steps = loops * 32;
  const T = loops * 2 * Math.PI;
  const a = (x1 - x0) / T;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * T;
    pts.push(`${r2(x0 + a * t - b * Math.sin(t))} ${r2(y + b * (1 - Math.cos(t)))}`);
  }
  return `M${pts.join(" L")}`;
}

function Frame({
  className,
  title,
  viewBox,
  children,
}: {
  className?: string | undefined;
  title?: string | undefined;
  viewBox: string;
  children: ReactNode;
}) {
  const a11y = title ? { role: "img" } : { "aria-hidden": true as const };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...a11y}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------------------- */
/* 1. Distribution board                                                      */
/* ------------------------------------------------------------------------- */

type BoardBreaker = { x: number; w: number; kind: "main" | "rcd" | "mcb" };

const BOARD_BREAKERS: BoardBreaker[] = [
  { x: 114, w: 40, kind: "main" },
  { x: 158, w: 40, kind: "rcd" },
  ...Array.from({ length: 7 }, (_, i) => ({ x: 202 + i * 24, w: 20, kind: "mcb" as const })),
];
const BRK_TOP = 216;
const BRK_H = 96;
const terminalsOf = (b: BoardBreaker) => (b.kind === "mcb" ? [b.x + 10] : [b.x + 10, b.x + 30]);
const BOARD_TERMINALS = BOARD_BREAKERS.flatMap(terminalsOf);
const MCB_CENTRES = BOARD_BREAKERS.filter((b) => b.kind === "mcb").map((b) => b.x + 10);
const BAR_TERMINALS = Array.from({ length: 6 }, (_, i) => i * 16);

export function SchematicBoard({ className, title }: SchematicProps) {
  return (
    <Frame className={className} title={title} viewBox="0 0 480 600">
      {/* Enclosure */}
      <rect x={64} y={96} width={352} height={424} rx={6} {...draw} />
      <g strokeWidth={0.75}>
        <rect x={80} y={112} width={320} height={392} rx={2} {...draw} />
        <path d="M64 168 H60 V200 H64" {...draw} />
        <path d="M64 416 H60 V448 H64" {...draw} />
        {/* Cable glands */}
        <rect x={112} y={88} width={44} height={8} rx={1} {...draw} />
        <rect x={262} y={88} width={44} height={8} rx={1} {...draw} />
      </g>

      {/* DIN rail (visible ends; the rail runs behind the breakers) */}
      <g strokeWidth={0.75}>
        <path d="M114 248 H88 V280 H114" {...draw} />
        <path d="M114 252 H92 V276 H114" {...draw} />
        <path d="M366 248 H392 V280 H366" {...draw} />
        <path d="M366 252 H388 V276 H366" {...draw} />
        <rect x={97} y={258} width={8} height={12} rx={4} {...draw} />
        <rect x={375} y={258} width={8} height={12} rx={4} {...draw} />
      </g>

      {/* Breaker bodies */}
      {BOARD_BREAKERS.map((b) => (
        <rect key={`body-${b.x}`} x={b.x} y={BRK_TOP} width={b.w} height={BRK_H} rx={2} {...draw} />
      ))}

      {/* Bus bar, neutral bar, earth bar */}
      <rect x={114} y={324} width={252} height={8} rx={1} {...draw} />
      <rect x={112} y={376} width={112} height={16} rx={2} {...draw} />
      <rect x={256} y={376} width={112} height={16} rx={2} {...draw} />

      {/* Breaker faces: toggles, test button, rating lines */}
      <g strokeWidth={0.75}>
        {BOARD_BREAKERS.map((b) => {
          if (b.kind === "main")
            return (
              <rect key={`tg-${b.x}`} x={b.x + 6} y={248} width={28} height={20} rx={1} {...draw} />
            );
          if (b.kind === "rcd")
            return (
              <rect key={`tg-${b.x}`} x={b.x + 4} y={248} width={16} height={20} rx={1} {...draw} />
            );
          return (
            <rect key={`tg-${b.x}`} x={b.x + 5} y={248} width={10} height={20} rx={1} {...draw} />
          );
        })}
        <circle cx={189} cy={258} r={4} {...draw} />
        {BOARD_BREAKERS.map((b) => (
          <path key={`lb-${b.x}`} d={`M${b.x + 5} 284 H${b.x + b.w - 5}`} {...draw} />
        ))}
      </g>

      {/* Terminals top and bottom */}
      <g strokeWidth={0.75}>
        {BOARD_TERMINALS.map((x) => (
          <circle key={`tt-${x}`} cx={x} cy={228} r={3} {...draw} />
        ))}
        {BOARD_TERMINALS.map((x) => (
          <circle key={`tb-${x}`} cx={x} cy={300} r={3} {...draw} />
        ))}
        {/* Bus bar fingers */}
        {BOARD_TERMINALS.map((x) => (
          <path key={`bf-${x}`} d={`M${x} 303 V324`} {...draw} />
        ))}
        {/* Bar terminals */}
        {BAR_TERMINALS.map((dx) => (
          <circle key={`nt-${dx}`} cx={128 + dx} cy={384} r={3} {...draw} />
        ))}
        {BAR_TERMINALS.map((dx) => (
          <circle key={`et-${dx}`} cx={272 + dx} cy={384} r={3} {...draw} />
        ))}
      </g>

      {/* Circuit schedule card */}
      <g strokeWidth={0.75}>
        <rect x={112} y={432} width={208} height={48} rx={2} {...draw} />
        <path d="M124 448 H308" {...draw} />
        <path d="M124 464 H308" {...draw} />
        <path d="M164 440 V472" {...draw} />
      </g>

      {/* Circuit cables: bundle enters top and fans to each breaker */}
      <g strokeWidth={0.75}>
        <path d="M116 40 V88" {...draw} />
        <path d="M152 40 V88" {...draw} />
        <path d="M264 40 V88" {...draw} />
        <path d="M304 40 V88" {...draw} />
        {MCB_CENTRES.map((tx, i) => (
          <path key={`cb-${tx}`} d={`M${272 + i * 4} 40 V128 L${tx} 192 V225`} {...draw} />
        ))}
        <rect x={266} y={112} width={36} height={8} rx={2} {...draw} />
        <path d="M144 40 V225" {...draw} />
      </g>

      {/* Earth conductor out through the base */}
      <path d="M352 392 V532" strokeWidth={0.75} {...draw} />
      <path d="M340 532 H364" {...draw} />
      <path d="M344 538 H360" {...draw} />
      <path d="M348 544 H356" {...draw} />

      {/* Rivets */}
      <circle cx={92} cy={124} r={2} {...dot} />
      <circle cx={388} cy={124} r={2} {...dot} />
      <circle cx={92} cy={492} r={2} {...dot} />
      <circle cx={388} cy={492} r={2} {...dot} />
      <circle cx={118} cy={384} r={1.5} {...dot} />
      <circle cx={218} cy={384} r={1.5} {...dot} />
      <circle cx={262} cy={384} r={1.5} {...dot} />
      <circle cx={362} cy={384} r={1.5} {...dot} />

      {/* Dimensions */}
      <path d="M420 96 H444" {...dim} />
      <path d="M420 520 H444" {...dim} />
      <path d="M440 96 V520" {...dim} />
      <path d="M64 524 V560" {...dim} />
      <path d="M416 524 V560" {...dim} />
      <path d="M64 556 H416" {...dim} />
      <g strokeWidth={0.75}>
        <path d={tick(440, 96)} {...draw} />
        <path d={tick(440, 520)} {...draw} />
        <path d={tick(64, 556)} {...draw} />
        <path d={tick(416, 556)} {...draw} />
      </g>

      {/* Accent: live supply conductor and main switch lever */}
      <path d="M124 40 V225" {...accent} />
      <path d="M124 254 H144" {...accent} />
    </Frame>
  );
}

/* ------------------------------------------------------------------------- */
/* 2. Circuit breaker with contact-mechanism detail                           */
/* ------------------------------------------------------------------------- */

const COIL_TURNS = [268, 276, 284, 292, 300];
const CHUTE_PLATES = [336, 344, 352, 360, 368, 376];

export function SchematicBreaker({ className, title }: SchematicProps) {
  return (
    <Frame className={className} title={title} viewBox="0 0 480 600">
      {/* Body */}
      <rect x={104} y={96} width={144} height={408} rx={8} {...draw} />
      <path d="M104 184 H248" {...draw} />
      <path d="M104 416 H248" {...draw} />
      <rect x={112} y={192} width={128} height={216} rx={4} strokeWidth={0.75} {...draw} />
      <path d="M164 504 V512 H188 V504" strokeWidth={0.75} {...draw} />

      {/* Terminal screws */}
      <g strokeWidth={0.75}>
        <circle cx={176} cy={140} r={16} {...draw} />
        <circle cx={176} cy={140} r={11} {...draw} />
        <path d="M168 140 H184" {...draw} />
        <path d="M176 132 V148" {...draw} />
        <circle cx={176} cy={460} r={16} {...draw} />
        <circle cx={176} cy={460} r={11} {...draw} />
        <path d="M168 460 H184" {...draw} />
        <path d="M176 452 V468" {...draw} />
      </g>

      {/* Incoming cable: insulation and ferrule */}
      <g strokeWidth={0.75}>
        <path d="M166 40 V80" {...draw} />
        <path d="M186 40 V80" {...draw} />
        <path d="M166 80 Q166 84 170 84 H182 Q186 84 186 80" {...draw} />
        <rect x={172} y={84} width={8} height={12} rx={1} {...draw} />
      </g>

      {/* Toggle */}
      <rect x={152} y={224} width={48} height={96} rx={4} {...draw} />
      <g strokeWidth={0.75}>
        <rect x={158} y={230} width={36} height={44} rx={2} {...draw} />
        <path d="M166 242 H186" {...draw} />
        <path d="M166 250 H186" {...draw} />
        <path d="M166 258 H186" {...draw} />
        <path d="M176 274 V296" {...draw} />
        {/* On / off marks */}
        <path d="M136 236 V248" {...draw} />
        <circle cx={136} cy={306} r={5} {...draw} />
      </g>

      {/* Rating plate with breaker symbol */}
      <g strokeWidth={0.75}>
        <rect x={136} y={364} width={80} height={32} rx={2} {...draw} />
        <path d="M148 380 H164 L180 370" {...draw} />
        <path d="M184 376 L192 384 M192 376 L184 384" {...draw} />
        <path d="M188 380 H204" {...draw} />
      </g>

      {/* Detail callout */}
      <circle cx={224} cy={288} r={16} {...dim} />
      <path d="M240 288 H288" {...dim} />

      {/* Detail inset: contact mechanism */}
      <circle cx={360} cy={288} r={72} {...draw} />
      <g strokeWidth={0.75}>
        <path d="M360 206 V218" {...draw} />
        <path d="M360 358 V370" {...draw} />
        <path d="M430 288 H442" {...draw} />
        {/* Trip coil */}
        <rect x={304} y={260} width={24} height={48} rx={2} {...draw} />
        {COIL_TURNS.map((y) => (
          <path key={`coil-${y}`} d={`M304 ${y + 3} L328 ${y - 3}`} {...draw} />
        ))}
        <path d="M328 268 H340 M340 264 V272" {...draw} />
        {/* Arc chute splitter plates */}
        {CHUTE_PLATES.map((x) => (
          <path key={`plate-${x}`} d={`M${x} 232 V252`} {...draw} />
        ))}
        {/* Fixed contact */}
        <path d="M304 332 H344 V320" {...draw} />
        <rect x={336} y={314} width={16} height={6} rx={1} {...draw} />
        {/* Moving contact on pivot */}
        <circle cx={408} cy={328} r={4} {...draw} />
        <path d="M405.17 325.17 L354.83 274.83" {...draw} />
        <circle cx={352} cy={272} r={4} {...draw} />
        {/* Return spring */}
        <path d="M392 244 H408" {...draw} />
        <path
          d="M400 244 V252 L394 256 L406 262 L394 268 L406 274 L394 280 L406 286 L394 292 L406 298 L400 302 V320"
          {...draw}
        />
      </g>

      {/* Dimensions */}
      <path d="M60 96 H100" {...dim} />
      <path d="M60 504 H100" {...dim} />
      <path d="M64 96 V504" {...dim} />
      <path d="M104 508 V540" {...dim} />
      <path d="M248 508 V540" {...dim} />
      <path d="M104 536 H248" {...dim} />
      <g strokeWidth={0.75}>
        <path d={tick(64, 96)} {...draw} />
        <path d={tick(64, 504)} {...draw} />
        <path d={tick(104, 536)} {...draw} />
        <path d={tick(248, 536)} {...draw} />
      </g>

      {/* Accent: live conductor, trip window, fault arc */}
      <path d="M176 40 V84 M176 96 V124" {...accent} />
      <rect x={160} y={340} width={32} height={12} rx={2} {...accent} />
      <path d="M351 277 L344 284 L354 290 L341 297 L351 304 L344 313" {...accent} />
      <path d="M359 290 L365 288 M337 292 L332 290" {...accent} />
    </Frame>
  );
}

/* ------------------------------------------------------------------------- */
/* 3. Pendant light                                                           */
/* ------------------------------------------------------------------------- */

const CEILING_HATCH = Array.from({ length: 22 }, (_, i) => 64 + i * 16);
const BULB = { cx: 240, cy: 404, r: 40 };
const RIM_Y = 384;
const RIM_DX = r2(Math.sqrt(BULB.r ** 2 - (BULB.cy - RIM_Y) ** 2));
const NECK_Y = r2(BULB.cy - Math.sqrt(BULB.r ** 2 - 12 ** 2));
const FALLOFF = [64, 96, 128].map((r) => arcBelow(BULB.cx, BULB.cy, r));
const FILAMENT = loopedFilament(222, 258, 408, 4, 6);

export function SchematicLight({ className, title }: SchematicProps) {
  const L = BULB.cx - RIM_DX;
  const R = BULB.cx + RIM_DX;
  return (
    <Frame className={className} title={title} viewBox="0 0 480 600">
      {/* Ceiling plane in section */}
      <path d="M64 64 H416" {...draw} />
      <g strokeWidth={0.5}>
        {CEILING_HATCH.map((x) => (
          <path key={`h-${x}`} d={`M${x} 64 L${x + 16} 48`} {...draw} />
        ))}
      </g>

      {/* Canopy, cord grip, cord */}
      <path d="M200 64 V68 Q200 72 204 72 H276 Q280 72 280 68 V64" {...draw} />
      <g strokeWidth={0.75}>
        <rect x={234} y={72} width={12} height={12} rx={2} {...draw} />
        <path d="M240 84 V260" {...draw} />
      </g>

      {/* Shade */}
      <rect x={228} y={260} width={24} height={20} rx={2} {...draw} />
      <path d="M136 384 A104 104 0 0 1 344 384" {...draw} />
      <path d="M128 384 H352" {...draw} />
      <g strokeWidth={0.75}>
        <path d="M228 268 H252" {...draw} />
        <path d="M144 384 A96 96 0 0 1 336 384" {...draw} />
        <path d="M158 320 H322" {...draw} />
        <path d="M236 248 H244 M236 252 H244" {...draw} />
      </g>

      {/* Hidden: lamp holder, neck and upper globe inside the shade */}
      <rect x={226} y={296} width={28} height={48} rx={2} {...dim} />
      <path d={`M228 344 V${NECK_Y}`} {...dim} />
      <path d={`M252 344 V${NECK_Y}`} {...dim} />
      <path d={`M${L} ${RIM_Y} A${BULB.r} ${BULB.r} 0 0 1 228 ${NECK_Y}`} {...dim} />
      <path d={`M252 ${NECK_Y} A${BULB.r} ${BULB.r} 0 0 1 ${R} ${RIM_Y}`} {...dim} />

      {/* Globe, filament supports, stem */}
      <path d={`M${L} ${RIM_Y} A${BULB.r} ${BULB.r} 0 1 0 ${R} ${RIM_Y}`} {...draw} />
      <g strokeWidth={0.75}>
        <path d="M222 388 V408" {...draw} />
        <path d="M258 388 V408" {...draw} />
        <path d="M240 388 V398" {...draw} />
      </g>
      <circle cx={240} cy={400} r={1.5} {...dot} />

      {/* Table plane */}
      <path d="M64 552 H416" {...draw} />

      {/* Light falloff and beam */}
      {FALLOFF.map((d) => (
        <path key={d} d={d} {...dim} />
      ))}
      <path d="M136 388 L96 548" {...dim} />
      <path d="M344 388 L384 548" {...dim} />
      <path d="M240 452 V548" {...dim} />

      {/* Drop dimensions */}
      <path d="M356 384 H428" {...dim} />
      <path d="M424 64 V552" {...dim} />
      <g strokeWidth={0.75}>
        <path d={tick(424, 64)} {...draw} />
        <path d={tick(424, 384)} {...draw} />
        <path d={tick(424, 552)} {...draw} />
      </g>

      {/* Accent: the filament */}
      <path d={FILAMENT} {...accent} />
    </Frame>
  );
}

/* ------------------------------------------------------------------------- */
/* 4. SA 15A socket outlet with rocker switch, plus side elevation            */
/* ------------------------------------------------------------------------- */

export function SchematicSocket({ className, title }: SchematicProps) {
  return (
    <Frame className={className} title={title} viewBox="0 0 480 600">
      {/* Front elevation: plate */}
      <rect x={88} y={80} width={192} height={384} rx={12} {...draw} />
      <rect x={96} y={88} width={176} height={368} rx={8} strokeWidth={0.75} {...draw} />

      {/* Modules */}
      <rect x={112} y={120} width={144} height={144} rx={10} {...draw} />
      <rect x={136} y={288} width={96} height={128} rx={10} {...draw} />

      {/* Socket face, 15A three round pins in a triangle */}
      <g strokeWidth={0.75}>
        <circle cx={184} cy={192} r={64} {...draw} />
        <circle cx={184} cy={192} r={60} {...draw} />
        <circle cx={184} cy={164} r={10} {...draw} />
        <circle cx={158} cy={220} r={8} {...draw} />
        <circle cx={210} cy={220} r={8} {...draw} />
        <circle cx={184} cy={164} r={5} {...draw} />
        <circle cx={158} cy={220} r={4} {...draw} />
        <circle cx={210} cy={220} r={4} {...draw} />
      </g>

      {/* Rocker */}
      <rect x={148} y={300} width={72} height={104} rx={6} {...draw} />
      <g strokeWidth={0.75}>
        <path d="M148 352 H220" {...draw} />
        <path d="M152 356 H216" {...draw} />
        <path d="M184 318 V334" {...draw} />
        <circle cx={184} cy={378} r={7} {...draw} />
      </g>

      {/* Plate screws */}
      <g strokeWidth={0.75}>
        <circle cx={184} cy={104} r={5} {...draw} />
        <path d="M180.5 107.5 L187.5 100.5" {...draw} />
        <circle cx={184} cy={440} r={5} {...draw} />
        <path d="M180.5 443.5 L187.5 436.5" {...draw} />
      </g>
      <circle cx={130} cy={138} r={1.5} {...dot} />
      <circle cx={238} cy={246} r={1.5} {...dot} />

      {/* Hidden: wall box and conduit behind the plate */}
      <rect x={104} y={96} width={160} height={352} rx={4} {...dim} />
      <path d="M168 448 V552" {...dim} />
      <path d="M200 448 V552" {...dim} />

      {/* Supply cable rising from the floor */}
      <g strokeWidth={0.75}>
        <path d="M174 552 V496" {...draw} />
        <path d="M194 552 V496" {...draw} />
        <path d="M174 496 H194" {...draw} />
        <path d="M178 496 V464" {...draw} />
        <path d="M190 496 V464" {...draw} />
      </g>

      {/* Floor */}
      <path d="M48 552 H432" {...draw} />

      {/* Side elevation: wall face, plate profile, rocker, screws */}
      <path d="M360 48 V552" {...draw} />
      <path d="M360 80 H356 Q352 80 352 84 V460 Q352 464 356 464 H360" {...draw} />
      <g strokeWidth={0.75}>
        <path d="M352 300 L346 306 V398 L352 404" {...draw} />
        <path d="M352 100 H349 V108 H352" {...draw} />
        <path d="M352 436 H349 V444 H352" {...draw} />
      </g>
      <rect x={360} y={96} width={48} height={352} {...dim} />
      <path d="M376 448 V552" {...dim} />
      <path d="M392 448 V552" {...dim} />

      {/* Projection lines between views */}
      <path d="M288 80 H344" {...dim} />
      <path d="M288 464 H344" {...dim} />

      {/* Dimensions: plate width, depth, mounting height */}
      <path d="M88 76 V52" {...dim} />
      <path d="M280 76 V52" {...dim} />
      <path d="M88 56 H280" {...dim} />
      <path d="M352 76 V52" {...dim} />
      <path d="M408 92 V52" {...dim} />
      <path d="M352 56 H408" {...dim} />
      <path d="M52 192 H84" {...dim} />
      <path d="M56 192 V552" {...dim} />
      <g strokeWidth={0.75}>
        <path d={tick(88, 56)} {...draw} />
        <path d={tick(280, 56)} {...draw} />
        <path d={tick(352, 56)} {...draw} />
        <path d={tick(408, 56)} {...draw} />
        <path d={tick(56, 192)} {...draw} />
        <path d={tick(56, 552)} {...draw} />
      </g>

      {/* Accent: live conductor and live contact */}
      <path d="M184 496 V464" {...accent} />
      <circle cx={210} cy={220} r={1.5} {...accent} />
    </Frame>
  );
}

/* ------------------------------------------------------------------------- */
/* 5. Brand mark                                                              */
/* ------------------------------------------------------------------------- */

const MARK_LEG_Y = r2(32 + Math.sqrt(26 ** 2 - 6 ** 2));

export function SchematicMark({ className, title }: SchematicProps) {
  return (
    <Frame className={className} title={title} viewBox="0 0 64 64">
      <circle cx={32} cy={32} r={26} {...draw} />
      <path
        d={`M26 ${MARK_LEG_Y} V44 L36 38 L28 32 L36 26 C40 22 37 15 32 15 C27 15 24 22 28 26 L36 32 L28 38 L38 44 V${MARK_LEG_Y}`}
        {...accent}
      />
    </Frame>
  );
}
