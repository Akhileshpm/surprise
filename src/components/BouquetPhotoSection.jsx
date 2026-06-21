import React, { useRef } from 'react';
import '../styles/BouquetPhotoSection.css';
import ScrollHint from './ScrollHint';
import meAndMariam from '../assets/me_and_mariam.webp';

function BouquetPhotoSection({ id, sectionRef: externalRef, nextSectionId }) {
  const internalRef = useRef(null);
  const sectionRef = externalRef || internalRef;

  return (
    <section id={id} ref={sectionRef} className="bouquet-photo-section">
      <div className="bouquet-photo-sticky">
        <div className="bouquet-photo-frame">
          <img
            src={meAndMariam}
            alt="Together"
            className="bouquet-photo"
            loading="lazy"
            decoding="async"
          />
          <div id="bouquet-target" className="bouquet-target" aria-hidden="true" />
        </div>
      </div>
      {nextSectionId && (
        <ScrollHint sectionRef={sectionRef} targetId={nextSectionId} />
      )}
    </section>
  );
}

export default BouquetPhotoSection;
