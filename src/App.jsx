import React, { useRef, useState } from 'react';
import './App.css';
import PasswordGate from './components/PasswordGate';
import Sparkle from './components/Sparkle';
import AudioPlayer from './components/AudioPlayer';
import MessageSection from './components/MessageSection';
import RoseGardenSection from './components/RoseGardenSection';
import RosePetals from './components/RosePetals';
import ScrollHint from './components/ScrollHint';
import mainImage from './assets/background.jpg';
import hbdpImage from './assets/hbdp.jpeg';
import chichouaGhibliImage from './assets/chichoua-ghibli.png';
import myMickyImage from './assets/my-micky.png';
import princessImage from './assets/princess.png';
import audioFile from './assets/background-music.mp3';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const heroSectionRef = useRef(null);

  return (
    <div className="app">
      <AudioPlayer audioSrc={audioFile} isAuthenticated={isAuthenticated} />
      <Sparkle isAuthenticated={isAuthenticated} />
      {!isAuthenticated ? (
        <PasswordGate onAuthenticate={() => setIsAuthenticated(true)} />
      ) : (
        <>
          <div className="page-background" style={{ backgroundImage: `url(${mainImage})` }} />
          <section ref={heroSectionRef} className="hero-section">
            <RosePetals />
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
            <ScrollHint sectionRef={heroSectionRef} targetId="message-section" />
          </section>
          <MessageSection
            id="message-section"
            nextSectionId="rose-garden"
            messages={{
              en: <p>What happened shouldn't have happened, and I truly apologize for my behavior.
              They say that every person has a good side and a bad side. And honestly, I didn't want things to end this way, especially with the person who was my favorite.
              Believe me, at that time there were many things on my mind, and you know that I have never gotten angry with you or lashed out at you like that before.
              I wish you from my heart a happy and successful future, and may God grant you success in every step of your life.
              Be well and always do good.</p>,
              ar: <p>اللي وقع ما كانش خاصو يوقع، وأنا فعلاً كنعتذر على التصرف ديالي.

              كيقولو بلي كل إنسان عندو جانب زوين وجانب خايب. وأنا بصراحة ما كنتش باغي الأمور تسالي بهاد الطريقة، خصوصاً مع الشخص اللي كان المفضل عندي.
              
              صدقيني، فداك الوقت كانو بزاف ديال الحوايج دايرين فبالي، ونتي عارفة بلي عمري ما تعصبت عليك ولا خرجت عليك بهاد الطريقة من قبل.
              
              كنتمنا ليك من قلبي مستقبل سعيد وناجح، والله يوفقك فكل خطوة فحياتك.
              
              كوني مزيانة وديري الخير ديما.
              </p>,
            }}
          />
          <RoseGardenSection id="rose-garden" />
        </>
      )}
    </div>
  );
}

export default App;
