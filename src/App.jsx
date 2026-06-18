import React, { useState } from 'react';
import './App.css';
import PasswordGate from './components/PasswordGate';
import Sparkle from './components/Sparkle';
import AudioPlayer from './components/AudioPlayer';
import mainImage from './assets/background.jpg';
import hbdpImage from './assets/hbdp.jpeg';
import chichouaGhibliImage from './assets/chichoua-ghibli.png';
import myMickyImage from './assets/my-micky.png';
import princessImage from './assets/princess.png';
import audioFile from './assets/background-music.mp3';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="app">
      <AudioPlayer audioSrc={audioFile} isAuthenticated={isAuthenticated} />
      <Sparkle isAuthenticated={isAuthenticated} />
      {!isAuthenticated ? (
        <PasswordGate onAuthenticate={() => setIsAuthenticated(true)} />
      ) : (
        <>
          <div className="content-overlay">
            <div className="image-composition">
              <div className="hero-cluster">
                <img
                  src={chichouaGhibliImage}
                  alt="Chichoua"
                  className="side-image side-image--left"
                />
                <img src={hbdpImage} alt="Birthday" className="birthday-image" />
                <img
                  src={myMickyImage}
                  alt="Micky"
                  className="side-image side-image--right"
                />
              </div>
              <img src={princessImage} alt="Princess" className="princess-bottom-image" />
            </div>
          </div>
          <div className="main-content" style={{ backgroundImage: `url(${mainImage})` }}>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
