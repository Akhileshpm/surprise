import React, { useMemo } from 'react';
import '../styles/BouquetConvergence.css';

const BLOOD_RED = [
  { fill: '#8b0000', shadow: '#4a0000' },
  { fill: '#990000', shadow: '#5c0000' },
  { fill: '#a01010', shadow: '#6b0808' },
  { fill: '#b22222', shadow: '#7a1515' },
  { fill: '#c41e3a', shadow: '#8b1028' },
  { fill: '#cc0000', shadow: '#880000' },
  { fill: '#dc143c', shadow: '#990033' },
];

const PINK = [
  { fill: '#ffc0cb', shadow: '#f48fb1' },
  { fill: '#ffb6c1', shadow: '#f06292' },
];

const PALE = [
  { fill: '#ffffff', shadow: '#f0e8e4' },
  { fill: '#fff0f4', shadow: '#f8c8d8' },
];

const PETAL_COUNT = 88;

function pickColor() {
  const r = Math.random();
  if (r < 0.62) return BLOOD_RED[Math.floor(Math.random() * BLOOD_RED.length)];
  if (r < 0.82) return PINK[Math.floor(Math.random() * PINK.length)];
  return PALE[Math.floor(Math.random() * PALE.length)];
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function createStartPoint(zone) {
  if (zone === 'left') {
    return { xPct: randomBetween(0, 20), yPct: randomBetween(48, 98) };
  }
  if (zone === 'right') {
    return { xPct: randomBetween(80, 100), yPct: randomBetween(48, 98) };
  }
  return { xPct: randomBetween(0, 100), yPct: randomBetween(82, 100) };
}

function createConvergingPetals(count) {
  return Array.from({ length: count }, (_, i) => {
    const roll = Math.random();
    const zone = roll < 0.32 ? 'left' : roll < 0.64 ? 'right' : 'bottom';
    const palette = pickColor();
    const start = createStartPoint(zone);

    return {
      id: `conv-${i}`,
      startXPct: start.xPct,
      startYPct: start.yPct,
      tx: randomBetween(0.08, 0.92),
      ty: randomBetween(0.1, 0.88),
      width: randomBetween(9, 18),
      height: randomBetween(12, 21),
      rotation: randomBetween(0, 360),
      releaseAt: (i / count) * 0.68 + randomBetween(0, 0.1),
      isRed: palette.fill.startsWith('#8') || palette.fill.startsWith('#9') ||
        palette.fill.startsWith('#a') || palette.fill.startsWith('#b') ||
        palette.fill.startsWith('#c') || palette.fill.startsWith('#d'),
      fill: palette.fill,
      shadow: palette.shadow,
    };
  });
}

function BouquetConvergence() {
  const petals = useMemo(() => createConvergingPetals(PETAL_COUNT), []);

  return (
    <div className="bouquet-convergence" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className={`bouquet-convergence__petal${p.isRed ? ' bouquet-convergence__petal--red' : ''}`}
          style={{
            '--start-x-pct': p.startXPct,
            '--start-y-pct': p.startYPct,
            '--tx': p.tx,
            '--ty': p.ty,
            width: `${p.width}px`,
            height: `${p.height}px`,
            '--petal-rotate': `${p.rotation}deg`,
            '--petal-fill': p.fill,
            '--petal-shadow': p.shadow,
            '--petal-release': p.releaseAt,
          }}
        />
      ))}
    </div>
  );
}

export default BouquetConvergence;
