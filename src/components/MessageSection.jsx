import React, { useRef, useState } from 'react';
import { track } from '../analytics';
import '../styles/MessageSection.css';
import ScrollHint from './ScrollHint';

function MessageSection({
  id,
  messages,
  defaultLanguage = 'ar',
  nextSectionId,
  sectionRef: externalRef,
  className = '',
  embedded = false,
  showScrollHint = true,
}) {
  const internalRef = useRef(null);
  const sectionRef = externalRef || internalRef;
  const [language, setLanguage] = useState(defaultLanguage);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'en' ? 'ar' : 'en';
      track('language_toggled', {
        section_id: id,
        section_label: id,
        language: next,
      });
      return next;
    });
  };

  const content = messages[language];
  const isArabic = language === 'ar';
  const Tag = embedded ? 'div' : 'section';
  const sectionClassName = ['message-section', className].filter(Boolean).join(' ');

  return (
    <Tag id={id} ref={sectionRef} className={sectionClassName}>
      <div className="message-container">
        <div className="message-header">
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
      {showScrollHint && nextSectionId && (
        <ScrollHint sectionRef={sectionRef} targetId={nextSectionId} />
      )}
    </Tag>
  );
}

export default MessageSection;
