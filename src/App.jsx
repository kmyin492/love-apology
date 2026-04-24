import React, { useState, useEffect, useRef } from "react";
import { FaHeart, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { GiHearts } from "react-icons/gi";
import useSound from "use-sound";
import buttonClick from "./sounds/Party-popper-confetti-celebration.mp3";
import celebration from "./sounds/happy.mp3";
import heartSound from "./sounds/heartbeat-slight-reverb(fromnoisetosound.com).mp3";
import sadSound from "./sounds/Whoosh-sound-effect-fast.mp3";

function App() {
  const [dontForgiveCount, setDontForgiveCount] = useState(0);
  const [isForgiven, setIsForgiven] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [hearts, setHearts] = useState([]);
  const [rejectButtonStyle, setRejectButtonStyle] = useState({});

  const [playButtonClick] = useSound(buttonClick, {
    volume: 0.5,
    soundEnabled: isSoundOn,
  });
  const [playCelebration] = useSound(celebration, {
    volume: 0.7,
    soundEnabled: isSoundOn,
  });
  const [playHeartSound] = useSound(heartSound, {
    volume: 0.4,
    soundEnabled: isSoundOn,
  });
  const [playSadSound] = useSound(sadSound, {
    volume: 0.6,
    soundEnabled: isSoundOn,
  });

  const apologyMessages = [
    "ငါ့ဘဝရဲ့ နေ့ရက်တိုင်းမှာ မင်းရှိနေပေးမလား? ငါမင်းကို တကယ်ချစ်တယ်။",
    "မင်းက ငါ့အတွက်တော့ အစားထိုးလို့မရတဲ့ တစ်ဦးတည်းသောသူပါ။ ငါ့ရဲ့ လက်တွဲဖော် ဖြစ်ပေးပါဦး။",
    "မင်းဆီက 'ဟုတ်ကဲ့' ဆိုတဲ့ အဖြေလေးကို ရဖို့ ငါအမြဲ စောင့်မျှော်နေမှာပါ။",
  ];

  const [apologyMessage, setApologyMessage] = useState("");

  useEffect(() => {
    setApologyMessage(
      apologyMessages[Math.floor(Math.random() * apologyMessages.length)],
    );
  }, []);

  // Background music play state and ref
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isMusicPlaying && audioRef.current.paused) {
        audioRef.current
          .play()
          .catch((e) => console.warn("Autoplay blocked:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicPlaying]);

  useEffect(() => {
    const unlockAudio = () => {
      if (audioRef.current && isMusicPlaying) {
        audioRef.current.play().catch(() => {});
      }
      window.removeEventListener("click", unlockAudio);
    };
    window.addEventListener("click", unlockAudio);
    return () => window.removeEventListener("click", unlockAudio);
  }, []);

  const handleDontForgive = () => {
    playSadSound();
    playButtonClick();

    const newHeart = {
      id: Date.now(),
      x: Math.random() * 100,
      y: 100,
      size: Math.random() * 30 + 20,
      speed: Math.random() * 2 + 1,
    };
    setHearts([...hearts, newHeart]);

    const newCount = dontForgiveCount + 1;
    setDontForgiveCount(newCount);
    setApologyMessage(
      apologyMessages[Math.floor(Math.random() * apologyMessages.length)],
    );

    setRejectButtonStyle({
      top: `${Math.random() * 90}%`,
      left: `${Math.random() * 90}%`,
      position: "fixed",
      transform: "translate(-50%, -50%)",
    });
  };

  const handleForgive = () => {
    playCelebration();
    playHeartSound();
    setIsForgiven(true);
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.play();
    }
    const celebrationHearts = Array.from({ length: 50 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: 100,
      size: Math.random() * 30 + 20,
      speed: Math.random() * 2 + 1,
    }));
    setHearts(celebrationHearts);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prevHearts) =>
        prevHearts
          .map((h) => ({ ...h, y: h.y - h.speed }))
          .filter((h) => h.y > -10),
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-pink-100 flex items-center justify-center overflow-hidden">
      {hearts.map((heart) => (
        <FaHeart
          key={heart.id}
          className="absolute text-pink-400 opacity-70 animate-pulse"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            fontSize: `${heart.size}px`,
            transition: "top 0.1s linear",
          }}
        />
      ))}

      {/* Background music audio element */}
      <audio ref={audioRef} src="/blue.mp3" loop />

      {/* Music toggle button */}
      <button
        onClick={() => setIsMusicPlaying(!isMusicPlaying)}
        className="absolute top-4 left-4 z-50 p-3 bg-white rounded-full shadow-lg"
      >
        {isMusicPlaying ? "🔊 Music ON" : "🔇 Music OFF"}
      </button>

      {/* Sound effects toggle button */}
      <button
        onClick={() => setIsSoundOn(!isSoundOn)}
        className="absolute top-4 right-4 z-50 p-3 bg-white rounded-full shadow-lg"
      >
        {isSoundOn ? <FaVolumeUp /> : <FaVolumeMute />}
      </button>

      {!isForgiven ? (
        <div className="relative z-10 text-center p-10 bg-white rounded-xl shadow-xl w-full max-w-6xl">
          <GiHearts className="text-5xl text-pink-500 mx-auto mb-4 animate-pulse" />
          <h1 className="text-3xl font-bold text-pink-600 mb-2">
            ဆွေဆွေလေး လက်ခံပေးပါဦး
          </h1>
          <p className="text-gray-600 mb-6">{apologyMessage}</p>

          <button
            onClick={handleForgive}
            className="text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg"
            style={{
              backgroundColor: "#ec4899",
              fontSize: `${20 * Math.pow(2, dontForgiveCount)}px`,
              position: "relative",
              width: `${200 * Math.pow(2, dontForgiveCount)}px`,
              zIndex: 10,
            }}
          >
            <FaHeart className="inline mr-2" /> ချစ်တယ်
          </button>

          <button
            onClick={handleDontForgive}
            className="bg-gray-300 text-gray-800 font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg"
            style={{
              ...rejectButtonStyle,
            }}
          >
            မချစ်ဘူး
          </button>
        </div>
      ) : (
        <div className="text-center p-10 bg-white rounded-xl shadow-xl z-10 w-full max-w-6xl">
          <h1 className="text-4xl text-pink-600 font-bold mb-4">
            ကျေးဇူးတင်ပါတယ်!
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            မင်းငါ့ကို ချစ်တာကြောင့် အရမ်းပျော်တယ်
          </p>
          <button
            onClick={() => {
              setIsForgiven(false);
              setDontForgiveCount(0);
              setHearts([]);
            }}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-full"
          >
            နောက်တစ်ကြိမ် ကြည့်မယ်
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
