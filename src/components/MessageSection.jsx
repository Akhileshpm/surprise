import React, { useRef, useState } from 'react';
import '../styles/MessageSection.css';
import ScrollHint from './ScrollHint';

function MessageSection({ id, messages, defaultLanguage = 'ar', nextSectionId }) {
  const sectionRef = useRef(null);
  const [language, setLanguage] = useState(defaultLanguage);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const content = messages[language];
  const isArabic = language === 'ar';

  return (
    <section id={id} ref={sectionRef} className="message-section">
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
      <ScrollHint sectionRef={sectionRef} targetId={nextSectionId} />
    </section>
  );
}

export default MessageSection;
