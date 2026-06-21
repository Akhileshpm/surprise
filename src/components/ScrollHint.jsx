import React, { useEffect, useState } from 'react';
import '../styles/ScrollHint.css';

function ScrollHint({ sectionRef, targetId }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef?.current;
    if (!section || !targetId) return;

    const update = () => {
      const target = document.getElementById(targetId);
      if (!target) {
        setVisible(false);
        return;
      }

      const sectionRect = section.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const sectionCenter = sectionRect.top + sectionRect.height / 2;
      const isCurrentSection =
        sectionCenter > window.innerHeight * 0.15 &&
        sectionCenter < window.innerHeight * 0.85;
      const hasMoreBelow = targetRect.top > window.innerHeight * 0.2;

      setVisible(isCurrentSection && hasMoreBelow);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [sectionRef, targetId]);

  if (!visible || !targetId) return null;

  return (
    <button
      type="button"
      className="scroll-hint"
      aria-label="Scroll down"
      onClick={() =>
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
      }
    >
      <span className="scroll-hint-arrow" aria-hidden="true">
        ↓
      </span>
    </button>
  );
}

export default ScrollHint;
