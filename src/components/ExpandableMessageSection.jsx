import React, { useId, useRef, useState } from 'react';
import '../styles/ExpandableMessageSection.css';
import ScrollHint from './ScrollHint';

function ExpandableMessageItem({ id, questions, messages, defaultLanguage = 'ar' }) {
  const panelId = useId();
  const [language, setLanguage] = useState(defaultLanguage);
  const [expanded, setExpanded] = useState(false);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const isArabic = language === 'ar';
  const question = questions.ar;
  const content = messages[language];

  return (
    <div id={id} className={`expandable-message-card${expanded ? ' expandable-message-card--open' : ''}`}>
      <div className="expandable-question-bar expandable-question-bar--rtl">
        <p className="expandable-question">{question}</p>
        <button
          type="button"
          className="expandable-toggle"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-label={expanded ? 'Collapse message' : 'Expand message'}
        >
          <span className="expandable-toggle-icon" aria-hidden="true" />
        </button>
      </div>

      <div id={panelId} className="expandable-message-panel" aria-hidden={!expanded}>
        <div className="expandable-message-panel-inner">
          <div className="expandable-message-header">
            <button
              type="button"
              className="language-toggle"
              onClick={toggleLanguage}
              aria-label={`Switch to ${isArabic ? 'English' : 'Arabic'}`}
            >
              <span className={language === 'en' ? 'active' : ''}>EN</span>
              <span className="language-toggle-divider" aria-hidden="true" />
              <span className={language === 'ar' ? 'active' : ''}>AR</span>
            </button>
          </div>
          <div className={`message-content${isArabic ? ' message-content--rtl' : ''}`}>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpandableMessageGroup({
  id,
  items,
  intro,
  nextSectionId,
  sectionRef: externalRef,
  showScrollHint = false,
}) {
  const internalRef = useRef(null);
  const introRef = useRef(null);
  const sectionRef = externalRef || internalRef;
  const firstQuestionId = items[0]?.id;

  return (
    <section id={id} ref={sectionRef} className="expandable-message-group">
      <div className="expandable-message-group-content">
        {intro && (
          <div ref={introRef} className="expandable-message-intro">
            <p>{intro.ar}</p>
          </div>
        )}
        <div className="expandable-message-stack">
          {items.map((item) => (
            <ExpandableMessageItem
              key={item.id}
              id={item.id}
              questions={item.questions}
              messages={item.messages}
              defaultLanguage={item.defaultLanguage}
            />
          ))}
        </div>
      </div>
      {intro && firstQuestionId && (
        <ScrollHint sectionRef={introRef} targetId={firstQuestionId} />
      )}
      {showScrollHint && nextSectionId && (
        <ScrollHint sectionRef={sectionRef} targetId={nextSectionId} />
      )}
    </section>
  );
}

export default ExpandableMessageGroup;
