import React, { useRef, useState } from 'react';
import './App.css';
import PasswordGate from './components/PasswordGate';
import Sparkle from './components/Sparkle';
import AudioPlayer from './components/AudioPlayer';
import MessageSection from './components/MessageSection';
import ExpandableMessageGroup from './components/ExpandableMessageSection';
import RoseGardenSection from './components/RoseGardenSection';
import BouquetPhotoSection from './components/BouquetPhotoSection';
import BouquetConvergence from './components/BouquetConvergence';
import PetalStream from './components/PetalStream';
import SettlingPetals from './components/SettlingPetals';
import ScrollHint from './components/ScrollHint';
import { useScrollJourney } from './hooks/useScrollJourney';
import { useSectionDwell } from './hooks/useSectionDwell';
import mainImage from './assets/background.jpg';
import hbdpImage from './assets/hbdp.jpeg';
import chichouaGhibliImage from './assets/chichoua-ghibli.png';
import myMickyImage from './assets/my-micky.png';
import princessImage from './assets/princess.png';
import audioFile from './assets/background-music.mp3';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="app">
        <AudioPlayer audioSrc={audioFile} isAuthenticated={false} />
        <Sparkle isAuthenticated={false} />
        <PasswordGate onAuthenticate={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  return <AuthenticatedContent />;
}

function AuthenticatedContent() {
  const heroSectionRef = useRef(null);
  const messageSectionRef = useRef(null);
  const gardenSectionRef = useRef(null);
  const bouquetSectionRef = useRef(null);
  const closingMessageSectionRef = useRef(null);
  const questionsSectionRef = useRef(null);
  const journeyRef = useScrollJourney(
    heroSectionRef,
    messageSectionRef,
    gardenSectionRef,
    bouquetSectionRef
  );

  useSectionDwell(heroSectionRef, 'hero');
  useSectionDwell(messageSectionRef, 'message-section');
  useSectionDwell(gardenSectionRef, 'rose-garden');
  useSectionDwell(bouquetSectionRef, 'bouquet-photo');
  useSectionDwell(closingMessageSectionRef, 'closing-message');
  useSectionDwell(questionsSectionRef, 'questions');

  return (
    <div className="app" ref={journeyRef}>
      <AudioPlayer audioSrc={audioFile} isAuthenticated={true} />
      <Sparkle isAuthenticated={true} />
          <div className="page-background" style={{ backgroundImage: `url(${mainImage})` }} />
          <SettlingPetals />
          <BouquetConvergence />
          <PetalStream />
          <section ref={heroSectionRef} className="hero-section">
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
            sectionRef={messageSectionRef}
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
          <RoseGardenSection
            id="rose-garden"
            sectionRef={gardenSectionRef}
            nextSectionId="bouquet-photo"
            messages={{
              en: <p>Even if you forgive me, I don't think I will be able to forgive myself.
              I hurt and disrespected the person who was the closest to my heart and whom I loved more than anyone else in my life.
              I know that now you hate me, and I apologize for this. At that time there were many things on my mind that made me act in a way that shouldn't have been.
              For you, it was easy to end the relationship, but for me, it was never easy. I don't give up easily on something I truly love.
              But now, I no longer know where I should draw the line between a person who has become annoying and doesn't want to step away, and a person who loves sincerely and is unable to let go of the one they love.
              And even now, I feel guilty because I might be bothering you with my messages.
              Frankly, I no longer know what to do.
              A big part of my heart still wants you.
              And when you told me, "You are sick in your head, and if you stay like this, no one will ever love you," these words hurt me a lot.
              Because I don't even want anyone else, Mariama. I loved you, and frankly, I don't think I can love any other woman in the same way.</p>,
              ar: <p>حتى إلا سامحتيني، ما كنظنش أنني غادي نقدر نسامح راسي.

              أنا جرحت وما احترمتش الشخص اللي كان الأقرب لقلبي واللي حبيتو أكثر من أي شخص آخر فحياتي.
              
              عارف بلي دابا كرهتيني، وأنا كنعتذر على هاد الشي. فداك الوقت كانو بزاف ديال الحوايج دايرين فبالي وخلاوني نتصرف بطريقة ما خاصهاش تكون.
              
              بالنسبة ليك كان ساهل تسالي العلاقة، أما بالنسبة ليا عمرها ما كانت سهلة. أنا ما كنستسلمش بسهولة فشي حاجة كنحبها بصدق.
              
              ولكن دابا ما بقيتش عارف فين خاصني نرسم الحدود بين شخص ولى مزعج وما كيبغيش يبعد، وبين شخص كيبغي بصدق وما قادرش يتخلى على اللي كيحب.
              
              وحتى دابا كنحس بالذنب حيث ممكن نكون كنزعجك برسائلي.
              
              بصراحة، ما بقيتش عارف شنو ندير.
              
              جزء كبير من قلبي ما زال باغيك.
              
              وملي قلتي ليا بلي "أنا مريض فمخي، وإذا بقيت هكا حتى واحد ما غادي يحبني"، هاد الكلام جرحني بزاف.
              
              حيت أنا أصلاً ما بغيت حتى واحد آخر يا مريامة. أنا حبيتك نتي، وبصراحة ما كنظنش نقدر نحب شي وحدة أخرى بنفس الطريقة.
              
              </p>,
            }}
          />
          <BouquetPhotoSection
            id="bouquet-photo"
            sectionRef={bouquetSectionRef}
            nextSectionId="closing-message"
          />
          <MessageSection
            id="closing-message"
            sectionRef={closingMessageSectionRef}
            nextSectionId="questions"
            messages={{ en: <p> This picture is so deep in my heart, it meant so much to me, 
              tell me at least there was something special in this picture and not just an ordinary selfie for you.
               I started at the stars that night, it was the happiest day of my life. 
               This picture is what reminds me that what you had in you head and heart is real for me, 
               there was some love for me. What happened since then??? </p>, ar: <p>
              ولكن هاد الصورة محفورة فقلبي بطريقة ما نقدرش نوصفها.
كانت كتعني ليا بزاف، وبغيت غير منك تقولي ليا واش فعلاً كان عندها معنى خاص بالنسبة ليك، ولا كانت غير سيلفي عادية وخلاص.
داك الليلة بقيت كنشوف فالنجوم، وكنت من أسعد الأيام فحياتي.
هاد الصورة هي الحاجة اللي كتخليني نصدق بلي داك الشي اللي كان فقلبك وفبالك فداك الوقت كان حقيقي بالنسبة ليا، وبلي كان فعلاً شي إحساس أو شي حب تجاهي.
شنو اللي وقع من بعد؟ .😭
            </p> }}
          />
          <ExpandableMessageGroup
            id="questions"
            sectionRef={questionsSectionRef}
            intro={{
              ar: 'عافاك يا مريامة، كوني لطيفة معايا واقري كلشي.',
              en: 'Please be my kind Mariama and read everything.',
            }}
            items={[
              {
                id: 'question-1',
                questions: {
                  en: 'This is my understanding of the situation',
                  ar: "هاد هو الفهم ديالي للموقف.",
                },
                messages: {
                  en: (
                    <p>
                      I will tell you my understanding, that might help you view our situation from my eyes.
                      We were so good when we met face to face. Even after the weeks followed as well, it was good.
                      I thought we were giving ourselves a second chance for our relationship. Suddenly, you brought
                      about the past things into our conversations. I was really shocked.
                      <br />
                      <br />
                      Afterwards, you started acting distant, just texting few times a day, like I was a stranger to
                      you. Not even coming to text at night as well. You disagreed to come on video call as well. And
                      when I felt this and confronted it, you said “I am always looking for problems”. But that was not
                      true, only after noticing your distant behaviour did I start to question it. While this happened,
                      one night I thought you blocked me and went away, because your actions were so unpredictable
                      those days. The following day you wanted to breakup. Every word I said after it, your reaction
                      was to break up. If you had really wanted us to be partners in future then how could you easily
                      say that? This is all I know about what happened.
                    </p>
                  ),
                  ar: (
                    <p>
                      غادي نقول ليك كيفاش أنا فهمت هاد الشي كامل، ويمكن هاد الشي يساعدك تشوفي الوضع من العين ديالي.
                      ملي تلاقينا فالحقيقة، حسيت بلي كلشي كان مزيان بيناتنا. وحتى الأسابيع اللي جاو من بعد، الأمور
                      كانت زوينة. كنت كنظن بلي حنا عطينا لعلاقتنا فرصة ثانية باش تبدا من جديد.
                      <br />
                      <br />
                      وفجأة، رجعتي فتحتي مواضيع وأخطاء من الماضي. بصراحة، تصدمت بزاف.
                      <br />
                      <br />
                      من بعد هاد الشي، حسيت بلي وليتي بعيدة عليا. ولات الهضرة بيناتنا قليلة بزاف، غير شي رسائل قليلة
                      فالنهار، بحال إلا وليت شخص غريب عليك. وحتى فالليل ما بقيتيش كتدخلي باش نهضرو بحال قبل. وحتى ملي
                      طلبت منك نديرو مكالمة فيديو، رفضتي.
                      <br />
                      <br />
                      ومن بعد ما حسيت بهاد التغيير وهضرت معاك عليه، قلتي ليا بلي "ديما كنقلب على المشاكل". ولكن من
                      جهتي، هاد الشي ما كانش صحيح. أنا ما بديتش نسول ولا نقلق حتى لاحظت بلي التصرفات ديالك تبدلات
                      ووليتي بعيدة.
                      <br />
                      <br />
                      وفوسط هاد الشي كامل، كاينة ليلة حسيت فيها بلي سديتي عليا وبعدتي نهائياً، حيت التصرفات ديالك فداك
                      الوقت كانت صعيبة عليا نفهمها ومتقلبة بزاف.
                      <br />
                      <br />
                      وفالغد ديالها، قلتي بلي بغيتي تنهي العلاقة.
                      <br />
                      <br />
                      ومن داك الوقت، تقريباً أي حاجة كنت كنقولها، كان الرد ديالك هو الانفصال أو التلويح بيه.
                      <br />
                      <br />
                      وهاد الشي هو اللي ما قدرتش نفهمو. حيت إلا كنتي فعلاً باغية يكون بيناتنا مستقبل ونكونو شركاء
                      فالحياة، كيفاش كان ساهل عليك توصلي لهاد القرار بهاد السرعة؟
                      <br />
                      <br />
                      هاد هو كل ما فهمتو أنا من اللي وقع.
                    </p>
                  ),
                },
              },
              {
                id: 'question-2',
                questions: {
                  en: 'My fear of losing you',
                  ar: 'الخوف ديالي من فقدانك.',
                },
                messages: {
                  en: (
                    <p>
                      The reason behind my fear of losing you started a long time ago. And you should acknowledge that
                      what we had was not a relationship. Only i was the one who loved you, you have only admired me
                      since the start. I was always trying to get you closer to me. I always feared losing you, i
                      measured your interest towards me by the way you responded to my messages. The way you texted has
                      changed drastically. The way you cherished me has changed. You once said "doubt kills love", but
                      there is another side to it, "love kills doubt". I wouldn't have any doubts about your interest
                      in me if you loved me back. Only your love could have removed the doubts from me.
                    </p>
                  ),
                  ar: (
                    <p>
                      الخوف ديالي من فقدانك ما بداش دابا، راه بدا من زمان.
                      <br />
                      <br />
                      وخاصك حتى نتي تعترفي بلي اللي كان بيناتنا ما كانش علاقة كاملة من الجهتين. أنا كنت هو اللي
                      كيحب، أما نتي فالبداية كان عندك إعجاب بيا أكثر من الحب.
                      <br />
                      <br />
                      طول الوقت وأنا كنحاول نقربك مني أكثر ونبني شي حاجة أقوى بيناتنا.
                      <br />
                      <br />
                      ودائماً كان عندي خوف من أنني نفقدك. وكنت كنقيس اهتمامك بيا من خلال الطريقة اللي كنتي كتجاوبي
                      بها على رسائلي.
                      <br />
                      <br />
                      والصراحة، الطريقة اللي ولاتي كتهضري بها معايا تبدلات بزاف. وحتى الطريقة اللي كنتي كتعاملي بيها
                      معايا وكتعبري بها على اهتمامك تبدلات.
                      <br />
                      <br />
                      مرة قلتي ليا: "الشك كيقتل الحب". وأنا متفق معاك.
                      <br />
                      <br />
                      ولكن كاين حتى الجانب الآخر: "الحب كيقتل الشك".
                      <br />
                      <br />
                      لو كنت حاس بلي كتحبيني بنفس الطريقة، ما كنتش غادي نبقى عايش فهاد الشكوك كلها.
                      <br />
                      <br />
                      الحاجة الوحيدة اللي كانت تقدر تطمن قلبي وتمحي هاد الشكوك هي الحب ديالك ليا.
                    </p>
                  ),
                },
              },
              {
                id: 'question-3',
                questions: {
                  en: 'The reason behind my angry side.',
                  ar: 'السبب وراء الجانب الغاضب ديالي.',
                },
                messages: {
                  en: (
                    <p>
                      By my nature, I am also someone who gets angry quickly sometimes. But despite this, I have never
                      taken my anger out on you, nor have I belittled you or hurt you with my words.
                      <br />
                      <br />
                      I am good with good people, and with people who treat me badly, I can be bad. But even when you
                      told me that I am "sick in my head," or "have no personality," or "look for attention," I didn't
                      respond to you in the same way.
                      <br />
                      <br />
                      And it wasn't because you wanted to end the relationship that I got angry.
                      <br />
                      <br />
                      The problem for me started when you said: "I will never marry someone who described me as
                      materialistic."
                      <br />
                      <br />
                      Just try to see the situation from my side a little bit.
                      <br />
                      <br />
                      We had already moved past this topic more than once, and even before, we had talked about it and
                      cleared it up.
                      <br />
                      <br />
                      Then you went back and reopened the same topic again, and I started to feel that this idea had
                      never left your mind, as if you were watching to see if I would change my words or how far I would
                      go.
                      <br />
                      <br />
                      And when you said those words, at that exact moment, I felt like I was deceived or played with.
                      <br />
                      <br />
                      I think even you, if you were in my place, would have felt the same way.
                      <br />
                      <br />
                      In addition to that, you also know the truth, Mariam. I didn't call you "materialistic."
                      <br />
                      <br />
                      What I said at that time was: "You never loved me, and you could have chosen someone else other
                      than me."
                      <br />
                      <br />
                      This is what I meant by my words.
                      <br />
                      <br />
                      And maybe because of the translation or a misunderstanding, you got the feeling that I was
                      describing you as materialistic, whereas this was never my intention at all.
                    </p>
                  ),
                  ar: (
                    <p>
                      بطبيعتي أنا حتى هو شخص كيتعصب بسرعة أحياناً. ولكن رغم هاد الشي، عمري ما خرجت غضبي عليك ولا قللت
                      منك أو جرحتك بكلامي.
                      <br />
                      <br />
                      أنا مع الناس المزيانين كنكون مزيان، ومع الناس اللي كيعاملوني بالخايب كنقدر نكون خايب. ولكن حتى
                      ملي قلتي عليا بلي "مريض فمخي"، أو "ما عنديش شخصية"، أو "كنقلب على الاهتمام"، ما رديتش عليك بنفس
                      الطريقة.
                      <br />
                      <br />
                      وماشي حيت كنتي باغية تنهي العلاقة هو السبب اللي خلاني نتعصب.
                      <br />
                      <br />
                      المشكل بالنسبة ليا بدا ملي قلتي: "عمري ما غادي نتزوج بشخص وصفني بالمادية".
                      <br />
                      <br />
                      حاولي غير تشوفي الموقف من الجهة ديالي شوية.
                      <br />
                      <br />
                      حنا سبق لينا تجاوزنا هاد الموضوع أكثر من مرة، وحتى من قبل هضرنا عليه ووضحناه.
                      <br />
                      <br />
                      ومن بعد رجعتي فتحتي نفس الموضوع مرة أخرى، وبدأ عندي إحساس بلي هاد الفكرة عمرها ما خرجات من بالك،
                      وكأنك كنتي كتشوفي واش غادي نبدل كلامي أو إلى فين غادي نوصل.
                      <br />
                      <br />
                      وملي قلتي داك الكلام، فداك اللحظة حسيت بلي كنت مخدوع أو متلعب بيا.
                      <br />
                      <br />
                      وكنظن حتى نتي، إلا كنتي فبلاصتي، كان غادي يجيك نفس الإحساس.
                      <br />
                      <br />
                      وزيد على هاد الشي، حتى نتي عارفة الحقيقة يا مريم. أنا ما قلتش عليك "مادية".
                      <br />
                      <br />
                      اللي قلت فداك الوقت هو: "أنتِ عمرك ما حبيتيني، وكان يقدر يكون عندك اختيار شخص آخر غيري".
                      <br />
                      <br />
                      هاد هو الكلام اللي كنت كنقصد.
                      <br />
                      <br />
                      ويمكن بسبب الترجمة أو سوء الفهم، وصلك الإحساس بلي كنت كنوصفك بالمادية، بينما هاد الشي ما كانش
                      قصدي أصلاً.
                    </p>
                  ),
                },
              },
              {
                id: 'question-4',
                questions: {
                  en: 'This is who I am',
                  ar: 'هاد هو أنا.',
                },
                messages: {
                  en: (
                    <p>
                      I loved you sincerely and with all my heart, and I can confidently say that my love for you is
                      greater than the love you have found from any other person in your life.
                      <br />
                      <br />
                      The anger was in my mind, it wasn't in my heart.
                      <br />
                      <br />
                      I am ready to care for you more than I care for myself, and all I wanted was for us to live a
                      beautiful and happy life together.
                      <br />
                      <br />
                      But at the same time, I like to see reality as it is.
                      <br />
                      <br />
                      The proof is that I told you about the application I was working on. I wasn't sure if it would
                      succeed or not, but I was showing you how your presence in my life was making me work harder and
                      think about our future.
                      <br />
                      <br />
                      I never gave you false hopes.
                      <br />
                      <br />
                      Now, frankly, I don't see an easy way to become rich. The only thing I have is my work, and I was
                      ready to go to Dubai and build my life there with you.
                      <br />
                      <br />
                      But just as you want to live a comfortable life and become a successful businesswoman, I also
                      have the same ambition.
                      <br />
                      <br />
                      I think about this a lot, but the right opportunity hasn't come yet.
                      <br />
                      <br />
                      And in my view, I don't want to become rich by luck or by winning the lottery. I prefer to build
                      my wealth with my own hands and my own effort.
                      <br />
                      <br />
                      And if this is with the wife I love, it will be much more beautiful.
                      <br />
                      <br />
                      I always imagined us being a successful couple, each of us supporting the other, and building our
                      success together.
                    </p>
                  ),
                  ar: (
                    <p>
                      أنا حبيتك بصدق ومن كل قلبي، وكنقدر نقول بثقة بلي حبي ليك أكبر من الحب اللي لقيتيه من أي شخص
                      آخر فحياتك.
                      <br />
                      <br />
                      الغضب كان فبالي، ما كانش فقلبي.
                      <br />
                      <br />
                      أنا مستعد نهتم بيك أكثر مما نهتم براسي، وكل اللي كنت باغيه هو أننا نعيشو حياة زوينة وسعيدة مع
                      بعضنا.
                      <br />
                      <br />
                      ولكن فالنفس الوقت، كنحب نشوف الواقع كما هو.
                      <br />
                      <br />
                      والدليل هو أنني هضرت ليك على التطبيق اللي كنت كنخدم عليه. ما كنتش متأكد واش غادي ينجح ولا لا،
                      ولكن كنت كنوريك كيفاش وجودك فحياتي كان كيخليني نخدم أكثر ونفكر فالمستقبل ديالنا.
                      <br />
                      <br />
                      عمري ما عطيتك آمال كاذبة.
                      <br />
                      <br />
                      دابا، بصراحة، ما كنشوفش طريق سهل باش نولي غني. الحاجة الوحيدة اللي عندي هي الخدمة ديالي، وكنت
                      مستعد نمشي لدبي ونبني حياتي تما معاك.
                      <br />
                      <br />
                      ولكن فحال ما نتي كتبغي تعيشي حياة مريحة وتولي سيدة أعمال ناجحة، حتى أنا عندي نفس الطموح.
                      <br />
                      <br />
                      كنفكر فهاد الشي بزاف، ولكن الفرصة المناسبة ما جاتش حتى الآن.
                      <br />
                      <br />
                      وفنظري، ما بغيتش نولي غني بالحظ ولا بربح اليانصيب. كنفضل نبني الثروة ديالي بيدي وبالمجهود ديالي.
                      <br />
                      <br />
                      وإلى كان هاد الشي مع الزوجة اللي كنحب، غادي يكون أجمل بزاف.
                      <br />
                      <br />
                      كنت ديما كنتخيل أننا نكونو زوج ناجح، كل واحد فينا كيساند الآخر، ونبنيو النجاح ديالنا مع بعضنا.
                    </p>
                  ),
                },
              },
              {
                id: 'question-5',
                questions: {
                  en: 'Please, take away the negative thoughts you have about me.',
                  ar: 'عافاك، حيّدي هاد الأفكار السلبية اللي عندك عليا.',
                },
                messages: {
                  en: (
                    <p>
                      Mariama, I have told you this many times.
                      <br />
                      <br />
                      Please, try to take away the negative thoughts you have about me.
                      <br />
                      <br />
                      From the day you started having this negative image of me, you began seeing almost everything I
                      say or do in a negative way.
                      <br />
                      <br />
                      In reality, all of this started from a simple misunderstanding.
                      <br />
                      <br />
                      I am not such a narrow-minded person.
                      <br />
                      <br />
                      At the end of our discussions, I had a feeling that you were trying to appear as a bad person in
                      front of me, and that is what made me ask you if you would choose someone richer than me.
                      <br />
                      <br />
                      My intention was never that I wouldn't work on myself or strive to provide a better life for us.
                      <br />
                      <br />
                      On the contrary, I was always thinking about how to build a better future and achieve a beautiful
                      life for both of us.
                    </p>
                  ),
                  ar: (
                    <p>
                      مريامة، قلت ليك هاد الشي بزاف ديال المرات.
                      <br />
                      <br />
                      عافاك، حاولي تحيدي هاد الأفكار السلبية اللي عندك عليا.
                      <br />
                      <br />
                      من النهار اللي ولات عندك هاد الصورة السلبية عليا، وليتي كتشوفي تقريباً أي حاجة كنقولها أو
                      كنديرها بطريقة سلبية.
                      <br />
                      <br />
                      وفالحقيقة، هاد الشي كامل بدا من سوء فهم بسيط.
                      <br />
                      <br />
                      أنا ماشي إنسان ضيق التفكير لهاد الدرجة.
                      <br />
                      <br />
                      فآخر النقاشات ديالنا، كان عندي إحساس بلي كنتي كتحاولي تباني كشخص خايب قدامي، وهاد الشي هو
                      اللي خلاني نسولك واش كنتي غادي تختاري شخص أغنى مني.
                      <br />
                      <br />
                      ما كانش قصدي أنني ما نقدرش نخدم على راسي أو ما نسعاش باش نوفر ليك حياة أحسن.
                      <br />
                      <br />
                      بالعكس، كنت ديما كنفكر كيفاش نبني مستقبل أفضل ونحقق حياة زوينة لينا بجوج.
                    </p>
                  ),
                },
              },
              {
                id: 'question-6',
                questions: {
                  en: 'I tried to do everything a man could do to prove his love through his actions and his efforts.',
                  ar: 'حاولت ندير كل ما يقدر عليه الرجل باش يثبت حبو من خلال الأفعال والمجهودات ديالو.',
                },
                messages: {
                  en: (
                    <p>
                      I put all the effort I had to prove my love to you.
                      <br />
                      <br />
                      And I am still trying, because at one time I felt your tenderness and care toward me, and I miss
                      feeling these emotions again.
                      <br />
                      <br />
                      In the end, the decision is your decision and the choice is your choice.
                      <br />
                      <br />
                      As for me, I was always ready to stay and try to fix our problems. I have a whole lifetime to
                      understand you more and learn more about you.
                      <br />
                      <br />
                      Be my Mariam and come back to me 🥹❤️
                      <br />
                      <br />
                      And if you still do not want to come back, at least tell me what exactly is bothering you.
                      <br />
                      <br />
                      And do not worry about the pictures. I will delete them the day I can forget you, but honestly,
                      this seems impossible for me right now.
                      <br />
                      <br />
                      Just thinking about deleting them breaks my heart.
                      <br />
                      <br />
                      Because every picture brings back your memories with it, and brings you back to my mind all over
                      again ❤️‍🩹
                    </p>
                  ),
                  ar: (
                    <p>
                      بذلت كل ما عندي من مجهود باش نثبت ليك حبي.
                      <br />
                      <br />
                      وما زلت كنحاول، حيت فشي وقت حسيت بالحنان والاهتمام ديالك تجاهي، وكنشتاق نحس بهاد المشاعر مرة
                      أخرى.
                      <br />
                      <br />
                      وفالأخير، القرار قرارك والاختيار اختيارك.
                      <br />
                      <br />
                      أما أنا، فكنت ديماً مستعد نبقى ونحاول نصلح المشاكل ديالنا. عندي عمر كامل باش نفهمك أكثر ونتعلم
                      عليك أكثر.
                      <br />
                      <br />
                      كوني مريامتي ورجعي ليا 🥹❤️
                      <br />
                      <br />
                      وإلى ما زلتي ما باغاش ترجعي، على الأقل قولي ليا شنو هو الشي اللي مزعجك بالضبط.
                      <br />
                      <br />
                      وما تقلقيش بخصوص الصور. غادي نحيدهم نهار نقدر ننساك، ولكن بصراحة هاد الشي باين ليا مستحيل دابا.
                      <br />
                      <br />
                      غير التفكير فحذفهم كيكسر ليا قلبي.
                      <br />
                      <br />
                      حيت كل صورة كتجيب معاهـا الذكريات ديالك، وكتردك ليا فبالي من جديد ❤️‍🩹
                    </p>
                  ),
                },
              },
            ]}
          />
    </div>
  );
}

export default App;
