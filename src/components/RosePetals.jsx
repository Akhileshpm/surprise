import React, { useMemo } from 'react';
import '../styles/RosePetals.css';

const PETAL_COLORS = [
  { fill: '#ffffff', shadow: '#f5d0dc' },
  { fill: '#fff5f8', shadow: '#f8c8d8' },
  { fill: '#ffeef2', shadow: '#f5b8cc' },
  { fill: '#ffc0cb', shadow: '#f48fb1' },
  { fill: '#ffb6c1', shadow: '#f06292' },
  { fill: '#f8bbd0', shadow: '#ec407a' },
  { fill: '#fda4b8', shadow: '#e879a0' },
  { fill: '#ff85a1', shadow: '#db7093' },
];

const PETAL_COUNT = 48;

function createPetals(side) {
  return Array.from({ length: PETAL_COUNT }, (_, i) => {
    const palette = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
    return {
      id: `${side}-${i}`,
      left: `${2 + Math.random() * 96}%`,
      delay: `${Math.random() * 2.5}s`,
      duration: `${2.4 + Math.random() * 2.8}s`,
      width: 10 + Math.random() * 10,
      height: 14 + Math.random() * 12,
      rotation: Math.random() * 360,
      sway: `${-28 + Math.random() * 56}px`,
      fill: palette.fill,
      shadow: palette.shadow,
    };
  });
}

function PetalStrip({ side, petals }) {
  return (
    <div className={`rose-petals rose-petals--${side}`} aria-hidden="true">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="rose-petal"
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

function RosePetals() {
  const leftPetals = useMemo(() => createPetals('left'), []);
  const rightPetals = useMemo(() => createPetals('right'), []);

  return (
    <>
      <PetalStrip side="left" petals={leftPetals} />
      <PetalStrip side="right" petals={rightPetals} />
    </>
  );
}

export default RosePetals;
