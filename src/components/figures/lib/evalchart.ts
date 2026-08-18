// Horizontal bar chart of model scores, shared by every article in the series.

export interface ModelScore {
  label: string;
  correct: number;
  n: number;
}

/**
 * Bars sorted highest first, with a dashed chance line. Anything short of a
 * perfect score is drawn muted: for these tasks a partial score is a fail,
 * so the chart should not flatter it.
 */
export function drawModelScores(
  canvas: HTMLCanvasElement,
  rows: ModelScore[],
  opts: { chance?: number; passColor?: string; barColor?: string } = {},
) {
  const chance = opts.chance ?? 0.5;
  const pass = opts.passColor || '#16a34a';
  const bar = opts.barColor || '#2563eb';

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssW = canvas.clientWidth || 560;
  const rowH = 30;
  const cssH = rows.length * rowH + 34;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, cssW, cssH);

  const labelW = Math.min(140, cssW * 0.34);
  const valueW = 54;
  const plotX = labelW + 8;
  const plotW = cssW - plotX - valueW;

  ctx.font = '12px ui-monospace, SFMono-Regular, monospace';
  ctx.textBaseline = 'middle';

  rows.forEach((r, i) => {
    const y = i * rowH + rowH / 2;
    const frac = r.n ? r.correct / r.n : 0;
    const perfect = r.correct === r.n;

    ctx.fillStyle = '#666666';
    ctx.textAlign = 'right';
    ctx.fillText(r.label, labelW, y);

    ctx.fillStyle = '#eeeeee';
    ctx.fillRect(plotX, y - 8, plotW, 16);

    ctx.fillStyle = perfect ? pass : bar;
    ctx.globalAlpha = perfect ? 1 : 0.55;
    ctx.fillRect(plotX, y - 8, plotW * frac, 16);
    ctx.globalAlpha = 1;

    ctx.fillStyle = perfect ? pass : '#111111';
    ctx.textAlign = 'left';
    ctx.fillText(`${r.correct}/${r.n}`, plotX + plotW + 8, y);
  });

  // chance line
  const cx = plotX + plotW * chance;
  ctx.strokeStyle = '#111111';
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, 4);
  ctx.lineTo(cx, rows.length * rowH);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#666666';
  ctx.textAlign = 'center';
  ctx.font = '11px ui-monospace, SFMono-Regular, monospace';
  ctx.fillText('chance', cx, rows.length * rowH + 16);
  ctx.textAlign = 'right';
  ctx.fillText('100%', plotX + plotW, rows.length * rowH + 16);
}
