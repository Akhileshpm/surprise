import React, { useEffect, useRef } from 'react';
import '../styles/EpilogueSection.css';
import beforeLetGo1 from '../assets/before-i-let-you-go-1.png';
import beforeLetGo2 from '../assets/before-i-let-you-go-2.png';

const FRAMES = [
  {
    src: beforeLetGo1,
    alt: 'Before I let you go — I begged the universe to make you stay',
    tilt: '-1.75deg',
  },
  {
    src: beforeLetGo2,
    alt: 'Before I let you go — I tried to believe love could be enough to make you stay',
    tilt: '1.5deg',
  },
];

function EpilogueSection({ id = 'epilogue', sectionRef: externalRef }) {
  const internalRef = useRef(null);
  const sectionRef = externalRef || internalRef;
  const frameRefs = useRef([]);

  useEffect(() => {
    const frames = frameRefs.current.filter(Boolean);
    if (!frames.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('epilogue-frame--visible');
          }
        });
      },
      { threshold: 0.22, rootMargin: '0px 0px -8% 0px' }
    );

    frames.forEach((frame) => observer.observe(frame));
    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} ref={sectionRef} className="epilogue-section" aria-label="Closing images">
      <div className="epilogue-veil" aria-hidden="true" />
      <div className="epilogue-glow epilogue-glow--left" aria-hidden="true" />
      <div className="epilogue-glow epilogue-glow--right" aria-hidden="true" />

      <div className="epilogue-inner">
        <div className="epilogue-gallery">
          {FRAMES.map((frame, index) => (
            <figure
              key={frame.src}
              ref={(el) => {
                frameRefs.current[index] = el;
              }}
              className="epilogue-frame"
              style={{ '--tilt': frame.tilt }}
            >
              <div className="epilogue-frame-border">
                <img
                  src={frame.src}
                  alt={frame.alt}
                  className="epilogue-image"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              {index === 0 && <span className="epilogue-thread" aria-hidden="true" />}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EpilogueSection;
