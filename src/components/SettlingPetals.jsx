import React, { useMemo } from 'react';
import '../styles/SettlingPetals.css';

const PALE_PETALS = [
  { fill: '#ffffff', shadow: '#f0e8e4' },
  { fill: '#fff8fa', shadow: '#f5d0dc' },
  { fill: '#fff0f4', shadow: '#f8c8d8' },
];

const PINK_PETALS = [
  { fill: '#ffc0cb', shadow: '#f48fb1' },
  { fill: '#ffb6c1', shadow: '#f06292' },
  { fill: '#fda4b8', shadow: '#e879a0' },
];

const BLOOD_RED = [
  { fill: '#8b0000', shadow: '#4a0000' },
  { fill: '#990000', shadow: '#5c0000' },
  { fill: '#a01010', shadow: '#6b0808' },
  { fill: '#b22222', shadow: '#7a1515' },
  { fill: '#c41e3a', shadow: '#8b1028' },
  { fill: '#cc0000', shadow: '#880000' },
  { fill: '#dc143c', shadow: '#990033' },
  { fill: '#9b111e', shadow: '#6b0a14' },
];

function pickColor(yNorm) {
  const r = Math.random();
  const redBoost = yNorm * 0.12;
  if (r < 0.48 + redBoost) {
    return BLOOD_RED[Math.floor(Math.random() * BLOOD_RED.length)];
  }
  if (r < 0.72 + redBoost * 0.5) {
    return PINK_PETALS[Math.floor(Math.random() * PINK_PETALS.length)];
  }
  return PALE_PETALS[Math.floor(Math.random() * PALE_PETALS.length)];
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function maxLeftReach(yNorm) {
  const curve = Math.pow(yNorm, 0.62);
  return 2.5 + curve * 21;
}

function inLeftCurve(xVw, yNorm) {
  return xVw <= maxLeftReach(yNorm) * (0.92 + Math.random() * 0.16);
}

function inRightCurve(xVw, yNorm) {
  return inLeftCurve(xVw, yNorm);
}

function createBottomPetals(count) {
  const petals = [];
  let attempts = 0;
  while (petals.length < count && attempts < count * 12) {
    attempts += 1;
    const xPct = randomBetween(0, 100);
    const wave =
      Math.sin(xPct * 0.11) * 2.8 +
      Math.sin(xPct * 0.055 + 1.4) * 1.6;
    const maxBottom = Math.min(19.8, 13 + wave + randomBetween(3, 7));
    const bottomVh = randomBetween(0, maxBottom);

    const yNorm = bottomVh / 20;
    const palette = pickColor(yNorm);
    petals.push({
      id: `bottom-${petals.length}`,
      zone: 'bottom',
      left: `${xPct}%`,
      bottom: `${bottomVh}vh`,
      width: randomBetween(10, 20),
      height: randomBetween(13, 24),
      rotation: randomBetween(0, 360),
      revealAt: yNorm * 0.14 + randomBetween(0, 0.03),
      z: Math.floor(randomBetween(1, 40)),
      isRed: palette.fill.startsWith('#8') || palette.fill.startsWith('#9') ||
        palette.fill.startsWith('#a') || palette.fill.startsWith('#b') ||
        palette.fill.startsWith('#c') || palette.fill.startsWith('#d'),
      fill: palette.fill,
      shadow: palette.shadow,
    });
  }
  return petals;
}

function createCurvePetals(count, side) {
  const petals = [];
  let attempts = 0;
  while (petals.length < count && attempts < count * 14) {
    attempts += 1;
    const yNorm = randomBetween(0, 1);
    const yPct = 48 + yNorm * 52;
    const xVw = randomBetween(0, 24);
    const inside = side === 'left' ? inLeftCurve(xVw, yNorm) : inRightCurve(xVw, yNorm);
    if (!inside) continue;

    const palette = pickColor(yNorm);
    petals.push({
      id: `${side}-${petals.length}`,
      zone: side,
      offset: `${xVw}vw`,
      top: `${yPct}%`,
      width: randomBetween(9, 19),
      height: randomBetween(12, 22),
      rotation: randomBetween(0, 360),
      revealAt: (1 - yNorm) * 0.22 + randomBetween(0, 0.05),
      z: Math.floor(randomBetween(1, 40)),
      isRed: palette.fill.startsWith('#8') || palette.fill.startsWith('#9') ||
        palette.fill.startsWith('#a') || palette.fill.startsWith('#b') ||
        palette.fill.startsWith('#c') || palette.fill.startsWith('#d'),
      fill: palette.fill,
      shadow: palette.shadow,
    });
  }
  return petals;
}

function createAllPetals() {
  const bottom = createBottomPetals(280);
  const left = createCurvePetals(200, 'left');
  const right = createCurvePetals(200, 'right');
  return [...bottom, ...left, ...right];
}

function SettlingPetals() {
  const petals = useMemo(() => createAllPetals(), []);

  return (
    <div className="settling-petals" aria-hidden="true">
      {petals.map((p) => {
        const posStyle =
          p.zone === 'bottom'
            ? { left: p.left, bottom: p.bottom }
            : p.zone === 'left'
              ? { left: p.offset, top: p.top }
              : { right: p.offset, top: p.top };

        return (
          <span
            key={p.id}
            className={`settling-petals__petal settling-petals__petal--${p.zone}${p.isRed ? ' settling-petals__petal--red' : ''}`}
            style={{
              ...posStyle,
              width: `${p.width}px`,
              height: `${p.height}px`,
              zIndex: p.z,
              '--petal-rotate': `${p.rotation}deg`,
              '--petal-fill': p.fill,
              '--petal-shadow': p.shadow,
              '--petal-reveal-at': p.revealAt,
            }}
          />
        );
      })}
    </div>
  );
}

export default SettlingPetals;
