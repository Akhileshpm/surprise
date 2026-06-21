import React, { useRef } from 'react';
import '../styles/PleaSection.css';
import ScrollHint from './ScrollHint';

function PleaSection({ id = 'final-plea', sectionRef: externalRef, nextSectionId = 'epilogue' }) {
  const internalRef = useRef(null);
  const sectionRef = externalRef || internalRef;

  return (
    <section id={id} ref={sectionRef} className="plea-section" aria-label="Final plea">
      <div className="plea-container">
        <p className="plea-text">
          كتخلي فقلبي فراغ كبير يا مريامة، فراغ ما يقدر حتى واحد يعوضو.
          <br />
          <br />
          عافاك، رجعي ليا.
          <br />
          <br />
          عندي طرق أخرى باش نوصل رسائلي ليك، ولكن ما بغيتش نزيد نكون مصدر إزعاج ليك.
          <br />
          <br />
          عافاك، خلينا نهضرو على هاد الشي ونفهمو بعضياتنا.
          <br />
          <br />
          عطيني فرصة يا مريامة، راكي عارفة بلي كنستحقها، ماشي هكا؟
          <br />
          <br />
          راكي كلشي بالنسبة ليا.
        </p>
      </div>
      {nextSectionId && <ScrollHint sectionRef={sectionRef} targetId={nextSectionId} />}
    </section>
  );
}

export default PleaSection;
