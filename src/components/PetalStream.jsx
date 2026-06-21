import React, { useMemo } from 'react';
import '../styles/PetalStream.css';

const PETAL_COLORS = [
  { fill: '#ffffff', shadow: '#f5d0dc' },
  { fill: '#fff5f8', shadow: '#f8c8d8' },
  { fill: '#ffeef2', shadow: '#f5b8cc' },
  { fill: '#ffc0cb', shadow: '#f48fb1' },
  { fill: '#ffb6c1', shadow: '#f06292' },
  { fill: '#8b0000', shadow: '#4a0000' },
  { fill: '#b22222', shadow: '#7a1515' },
  { fill: '#c41e3a', shadow: '#8b1028' },
  { fill: '#dc143c', shadow: '#990033' },
];

const PETAL_COUNT = 64;

function pickStreamColor() {
  const r = Math.random();
  if (r < 0.28) {
    const reds = PETAL_COLORS.slice(5);
    return reds[Math.floor(Math.random() * reds.length)];
  }
  const pinks = PETAL_COLORS.slice(0, 5);
  return pinks[Math.floor(Math.random() * pinks.length)];
}

function createPetals(side) {
  return Array.from({ length: PETAL_COUNT }, (_, i) => {
    const palette = pickStreamColor();
    return {
      id: `${side}-${i}`,
      left: `${1 + Math.random() * 98}%`,
      delay: `${Math.random() * 3.2}s`,
      duration: `${2.2 + Math.random() * 2.6}s`,
      width: 9 + Math.random() * 11,
      height: 13 + Math.random() * 13,
      rotation: Math.random() * 360,
      sway: `${-32 + Math.random() * 64}px`,
      fill: palette.fill,
      shadow: palette.shadow,
    };
  });
}

function PetalStrip({ side, petals }) {
  return (
    <div className={`petal-stream__strip petal-stream__strip--${side}`} aria-hidden="true">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="petal-stream__petal"
          style={{
            left: petal.left,
            width: `${petal.width}px`,
            height: `${petal.height}px`,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            '--petal-rotate': `${petal.rotation}deg`,
            '--petal-sway': petal.sway,
            '--petal-fill': petal.fill,
            '--petal-shadow': petal.shadow,
          }}
        />
      ))}
    </div>
  );
}

function PetalStream() {
  const leftPetals = useMemo(() => createPetals('left'), []);
  const rightPetals = useMemo(() => createPetals('right'), []);

  return (
    <div className="petal-stream" aria-hidden="true">
      <PetalStrip side="left" petals={leftPetals} />
      <PetalStrip side="right" petals={rightPetals} />
    </div>
  );
}

export default PetalStream;
