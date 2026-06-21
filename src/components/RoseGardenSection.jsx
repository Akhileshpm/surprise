import React, { useEffect, useRef, useState } from 'react';
import '../styles/RoseGardenSection.css';
import whiteBouquet from '../assets/bouquet-white.webp';
import pinkBouquet from '../assets/bouquet-pink.webp';
import redBouquet from '../assets/bouquet-red.webp';

const POSITIONS = ['left', 'center', 'right'];

function clamp(value) {
  return Math.max(0, Math.min(1, value));
}

function Bouquet({ image, position, reveal, tone }) {
  const hidden = (1 - reveal) * 115;
  const isCenter = position === 'center';
  return (
    <div
      className={`bouquet bouquet--${position} bouquet--${tone}`}
      style={{
        transform: isCenter
          ? `translate(-50%, ${hidden}%)`
          : `translateY(${hidden}%)`,
      }}
      aria-hidden="true"
    >
      <img src={image} alt="" draggable="false" />
    </div>
  );
}

function BouquetLayer({ tone, image, reveal }) {
  return (
    <div className={`bouquet-layer bouquet-layer--${tone}`}>
      {POSITIONS.map((position) => (
        <Bouquet
          key={`${tone}-${position}`}
          image={image}
          position={position}
          reveal={reveal}
          tone={tone}
        />
      ))}
    </div>
  );
}

function RoseGardenSection({ id }) {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(rect.top <= 0 ? 1 : 0);
        return;
      }
      setProgress(clamp(-rect.top / scrollable));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  const whiteReveal = clamp(progress / 0.4);
  const pinkReveal = clamp((progress - 0.3) / 0.4);
  const redReveal = clamp((progress - 0.6) / 0.4);

  return (
    <section id={id} ref={sectionRef} className="rose-garden-section">
      <div className="rose-garden-sticky">
        <div className="rose-garden-floor">
          <BouquetLayer tone="white" image={whiteBouquet} reveal={whiteReveal} />
          <BouquetLayer tone="pink" image={pinkBouquet} reveal={pinkReveal} />
          <BouquetLayer tone="red" image={redBouquet} reveal={redReveal} />
        </div>
      </div>
    </section>
  );
}

export default RoseGardenSection;
