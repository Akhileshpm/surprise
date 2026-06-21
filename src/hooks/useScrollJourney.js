import { useEffect, useRef } from 'react';

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function sectionProgress(rect) {
  const scrollable = rect.height - window.innerHeight;
  if (scrollable <= 0) return rect.top <= 0 ? 1 : 0;
  return clamp(-rect.top / scrollable);
}

export function useScrollJourney(heroRef, messageRef, gardenRef, bouquetRef) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let raf = null;

    const updateAnchor = () => {
      const anchor = document.getElementById('bouquet-target');
      if (!anchor) return;
      const ar = anchor.getBoundingClientRect();
      root.style.setProperty('--bouquet-ax', `${ar.left}px`);
      root.style.setProperty('--bouquet-ay', `${ar.top}px`);
      root.style.setProperty('--bouquet-aw', `${ar.width}px`);
      root.style.setProperty('--bouquet-ah', `${ar.height}px`);
    };

    const update = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;

        const hero = heroRef.current;
        const message = messageRef.current;
        const garden = gardenRef.current;
        const bouquet = bouquetRef.current;
        if (!hero || !message || !garden || !bouquet) return;

        const messageRect = message.getBoundingClientRect();
        const gardenRect = garden.getBoundingClientRect();
        const bouquetRect = bouquet.getBoundingClientRect();
        const vh = window.innerHeight;

        const gardenScroll = sectionProgress(gardenRect);
        const gardenBelow = gardenRect.top >= vh;

        const gardenApproach = gardenBelow
          ? 0
          : clamp((vh - gardenRect.top) / vh);

        const handoff = gardenBelow
          ? 0
          : clamp(gardenApproach * 0.35 + gardenScroll * 0.65);

        const gardenFill = gardenBelow
          ? 0
          : clamp(1 - (1 - handoff) ** 0.38, 0, 1);

        const bouquetScroll = sectionProgress(bouquetRect);
        const bouquetBelow = bouquetRect.top >= vh;

        const bouquetApproach = bouquetBelow
          ? 0
          : clamp((vh - bouquetRect.top) / vh);

        const bouquetMerge = bouquetBelow
          ? 0
          : clamp(bouquetApproach * 0.2 + bouquetScroll * 0.8);

        const streamOpacity = gardenBelow ? 1 : clamp(1 - handoff * 0.95, 0, 1);

        const settlingFade = clamp(1 - bouquetApproach * 1.2, 0, 1);

        if (!bouquetBelow) {
          updateAnchor();
        }

        root.style.setProperty('--stream-opacity', streamOpacity.toFixed(4));
        root.style.setProperty('--garden-handoff', handoff.toFixed(4));
        root.style.setProperty('--garden-fill', gardenFill.toFixed(4));
        root.style.setProperty('--garden-approach', gardenApproach.toFixed(4));
        root.style.setProperty('--garden-scroll', gardenScroll.toFixed(4));
        root.style.setProperty('--bouquet-approach', bouquetApproach.toFixed(4));
        root.style.setProperty('--bouquet-merge', bouquetMerge.toFixed(4));
        root.style.setProperty('--bouquet-scroll', bouquetScroll.toFixed(4));
        root.style.setProperty('--settling-fade', settlingFade.toFixed(4));

        root.dataset.phase =
          bouquetRect.top <= vh * 0.15
            ? 'bouquet'
            : gardenRect.top <= vh * 0.15
              ? 'garden'
              : messageRect.top <= vh * 0.2
                ? 'message'
                : 'hero';
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [heroRef, messageRef, gardenRef, bouquetRef]);

  return rootRef;
}
