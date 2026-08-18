// Counts-per-cell statistics for planar point patterns.
//
// This is Clarke's 1946 method: divide the region into equal cells, count how
// many points fall in each, and compare the distribution of cell counts to the
// Poisson expectation. Clarke used 576 quarter-km squares over south London to
// show that V-1 impacts were Poisson, not clustered on particular districts.
//
// R. D. Clarke, "An Application of the Poisson Distribution",
// Journal of the Institute of Actuaries 72 (1946), p.481.

export type Pt = [number, number];

/** Points-per-cell for a k x k grid over the unit square. */
export function cellCounts(pts: Pt[], k: number): number[] {
  const c = new Array(k * k).fill(0);
  for (const [x, y] of pts) {
    const i = Math.min(k - 1, Math.floor(x * k));
    const j = Math.min(k - 1, Math.floor(y * k));
    c[j * k + i]++;
  }
  return c;
}

/** Histogram of cell counts: how many cells hold 0 points, 1 point, ... */
export function countHistogram(counts: number[], maxBin: number): number[] {
  const h = new Array(maxBin + 1).fill(0);
  for (const c of counts) h[Math.min(c, maxBin)]++;
  return h;
}

/** Expected number of cells holding exactly r points, under Poisson(lambda). */
export function poissonExpected(lambda: number, nCells: number, maxBin: number): number[] {
  const out: number[] = [];
  let term = Math.exp(-lambda); // r = 0
  let cumulative = 0;
  for (let r = 0; r <= maxBin; r++) {
    if (r === maxBin) {
      out.push(nCells * Math.max(0, 1 - cumulative)); // tail bin
    } else {
      out.push(nCells * term);
      cumulative += term;
      term = (term * lambda) / (r + 1);
    }
  }
  return out;
}

/**
 * Variance-to-mean ratio of the cell counts. This is the single number that
 * separates the two patterns: a Poisson process gives 1.0, anything more
 * regular gives less, anything clustered gives more.
 */
export function varianceMeanRatio(counts: number[]): number {
  const m = counts.reduce((a, b) => a + b, 0) / counts.length;
  if (m === 0) return 0;
  const v = counts.reduce((a, b) => a + (b - m) ** 2, 0) / counts.length;
  return v / m;
}

/** Grid lines over a canvas region, matching the point rendering inset. */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  size: number,
  pad: number,
  k: number,
  color = 'rgba(17, 17, 17, 0.22)',
) {
  const inner = size - pad * 2;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, size * 0.0022);
  for (let i = 0; i <= k; i++) {
    const t = pad + (i / k) * inner;
    ctx.beginPath(); ctx.moveTo(t, pad); ctx.lineTo(t, pad + inner); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad, t); ctx.lineTo(pad + inner, t); ctx.stroke();
  }
  ctx.restore();
}

/**
 * Observed cell-count histogram as bars, with the Poisson expectation drawn
 * over it as a stepped outline.
 */
export function drawHistogram(
  canvas: HTMLCanvasElement,
  observed: number[],
  expected: number[],
  opts: { barColor?: string; label?: string } = {},
) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssW = canvas.clientWidth || 300;
  const cssH = Number(canvas.dataset.h || 150);
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  const ctx = canvas.getContext('2d')!;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const padL = W * 0.02, padR = W * 0.02, padT = H * 0.10, padB = H * 0.22;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const yMax = Math.max(...observed, ...expected) * 1.12 || 1;
  const n = observed.length;
  const slot = plotW / n;
  const barW = slot * 0.62;
  const x = (i: number) => padL + i * slot + (slot - barW) / 2;
  const y = (v: number) => padT + plotH - (v / yMax) * plotH;

  // baseline
  ctx.strokeStyle = 'rgba(17,17,17,0.35)';
  ctx.lineWidth = Math.max(1, W * 0.002);
  ctx.beginPath(); ctx.moveTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH); ctx.stroke();

  // observed bars
  ctx.fillStyle = opts.barColor || '#111111';
  for (let i = 0; i < n; i++) {
    const h = padT + plotH - y(observed[i]);
    ctx.fillRect(x(i), y(observed[i]), barW, h);
  }

  // Poisson expectation as a stepped outline
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = Math.max(1.5, W * 0.004);
  ctx.setLineDash([W * 0.012, W * 0.010]);
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const xa = padL + i * slot, xb = xa + slot, yy = y(expected[i]);
    if (i === 0) ctx.moveTo(xa, yy); else ctx.lineTo(xa, yy);
    ctx.lineTo(xb, yy);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // x labels
  ctx.fillStyle = 'rgba(17,17,17,0.75)';
  ctx.font = `${Math.round(H * 0.105)}px ui-monospace, monospace`;
  ctx.textAlign = 'center';
  for (let i = 0; i < n; i++) {
    const lab = i === n - 1 ? `${i}+` : `${i}`;
    ctx.fillText(lab, padL + i * slot + slot / 2, padT + plotH + H * 0.14);
  }
}
