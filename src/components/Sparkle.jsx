import React, { useEffect, useState } from 'react';
import '../styles/Sparkle.css';

function Sparkle({ isAuthenticated }) {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const sparkleId = Date.now() + Math.random();

      setSparkles((prev) => [...prev, { id: sparkleId, x: touch.clientX, y: touch.clientY }]);

      // Remove sparkle after animation
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== sparkleId));
      }, 600);
    };

    window.addEventListener('touchmove', handleTouchMove);
    return () => window.removeEventListener('touchmove', handleTouchMove);
  }, [isAuthenticated]);

  return (
    <>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{
            left: sparkle.x,
            top: sparkle.y,
          }}
        >
          ✨
        </div>
      ))}
    </>
  );
}

export default Sparkle;
