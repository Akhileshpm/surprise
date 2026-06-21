import React, { useRef } from 'react';
import '../styles/RoseGardenSection.css';
import MessageSection from './MessageSection';
import ScrollHint from './ScrollHint';

function RoseGardenSection({ id, sectionRef: externalRef, messages, nextSectionId }) {
  const internalRef = useRef(null);
  const sectionRef = externalRef || internalRef;

  return (
    <section id={id} ref={sectionRef} className="rose-garden-section">
      <div className="rose-garden-sticky">
        <MessageSection
          id="garden-message"
          messages={messages}
          embedded
          showScrollHint={false}
          className="message-section--garden"
        />
      </div>
      {nextSectionId && (
        <ScrollHint sectionRef={sectionRef} targetId={nextSectionId} />
      )}
    </section>
  );
}

export default RoseGardenSection;
