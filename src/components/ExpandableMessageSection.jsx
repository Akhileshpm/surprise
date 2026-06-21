import React, { useEffect, useId, useRef, useState } from 'react';
import { track } from '../analytics';
import '../styles/ExpandableMessageSection.css';
import ScrollHint from './ScrollHint';

function ExpandableMessageItem({
  id,
  questionNumber,
  questionLabel,
  questions,
  messages,
  defaultLanguage = 'ar',
}) {
  const panelId = useId();
  const openedAt = useRef(null);
  const [language, setLanguage] = useState(defaultLanguage);
  const [expanded, setExpanded] = useState(false);

  const flushQuestionDwell = () => {
    if (!openedAt.current) return;
    const durationMs = Date.now() - openedAt.current;
    openedAt.current = null;
    if (durationMs > 300) {
      track('question_closed', {
        question_id: id,
        question_number: questionNumber,
        question_label: questionLabel,
        duration_ms: durationMs,
      });
    }
  };

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flushQuestionDwell();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      flushQuestionDwell();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [id, questionNumber, questionLabel]);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'en' ? 'ar' : 'en';
      track('language_toggled', {
        section_id: id,
        section_label: questionLabel,
        language: next,
      });
      return next;
    });
  };

  const toggleExpanded = () => {
    setExpanded((prev) => {
      const next = !prev;
      if (next) {
        openedAt.current = Date.now();
        track('question_opened', {
          question_id: id,
          question_number: questionNumber,
          question_label: questionLabel,
        });
      } else {
        flushQuestionDwell();
      }
      return next;
    });
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
          onClick={toggleExpanded}
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
  const footerRef = useRef(null);
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
          {items.map((item, index) => (
            <ExpandableMessageItem
              key={item.id}
              id={item.id}
              questionNumber={index + 1}
              questionLabel={item.questions.en}
              questions={item.questions}
              messages={item.messages}
              defaultLanguage={item.defaultLanguage}
            />
          ))}
        </div>
        {showScrollHint && nextSectionId && (
          <div ref={footerRef} className="expandable-message-footer">
            <ScrollHint sectionRef={footerRef} targetId={nextSectionId} />
          </div>
        )}
      </div>
      {intro && firstQuestionId && (
        <ScrollHint sectionRef={introRef} targetId={firstQuestionId} />
      )}
    </section>
  );
}

export default ExpandableMessageGroup;
