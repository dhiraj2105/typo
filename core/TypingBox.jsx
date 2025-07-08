"use client";
import { getRandomParagraph } from "@/utils/paragraph";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TypingBox() {
  const [paragraph, setParagraph] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedHistory, setTypedHistory] = useState([]);
  const [mistakes, setMistakes] = useState(0); // letter-level
  const [wordMistakes, setWordMistakes] = useState(0);
  const [backspaces, setBackspaces] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Track word-level correctness
  const [currentWordChars, setCurrentWordChars] = useState([]);
  const [currentWordHasMistake, setCurrentWordHasMistake] = useState(false);

  useEffect(() => {
    const para = getRandomParagraph();
    setParagraph(para);
  }, []);

  // Timer logic
  useEffect(() => {
    let interval;

    if (startTime && !isCompleted) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [startTime, isCompleted]);

  // Typing logic
  useEffect(() => {
    const handleKeydown = (e) => {
      if (isCompleted) return;

      const key = e.key;

      if (!startTime) setStartTime(Date.now());

      if (key === "Backspace") {
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
          setTypedHistory((prev) => prev.slice(0, -1));
          setBackspaces((prev) => prev + 1);
          setCurrentWordChars((prev) => prev.slice(0, -1));
        }
        return;
      }

      if (key.length === 1 || key === "Enter" || key === "Tab" || key === " ") {
        const currentChar = paragraph[currentIndex];
        const isCorrect = key === currentChar;

        setTypedHistory((prev) => [...prev, key]);
        setCurrentWordChars((prev) => [...prev, key]);

        if (!isCorrect) {
          setMistakes((prev) => prev + 1);
          setCurrentWordHasMistake(true);
        }

        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);

        // Word completed on space or end of string
        if (currentChar === " " || nextIndex === paragraph.length) {
          if (currentWordHasMistake) {
            setWordMistakes((prev) => prev + 1);
          }
          setCurrentWordChars([]);
          setCurrentWordHasMistake(false);
        }

        if (nextIndex === paragraph.length) {
          setIsCompleted(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [currentIndex, paragraph, isCompleted, startTime, currentWordHasMistake]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const getWPM = () => {
    if (!elapsedTime) return 0;
    const wordsTyped = typedHistory.length / 5;
    const minutes = elapsedTime / 60;
    return Math.round(wordsTyped / minutes);
  };

  const getAccuracy = () => {
    if (typedHistory.length === 0) return 100;
    const correctChars = typedHistory.reduce((acc, char, i) => {
      return char === paragraph[i] ? acc + 1 : acc;
    }, 0);
    return ((correctChars / typedHistory.length) * 100).toFixed(1);
  };

  return (
    <div className="w-full max-w-4xl px-6 text-2xl sm:text-3xl text-white leading-relaxed select-none">
      <motion.div
        className="flex flex-wrap mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {paragraph.split("").map((char, index) => {
          let className = "px-0.5";

          if (index === currentIndex) {
            className += " bg-yellow-300 text-black rounded";
          } else if (index < typedHistory.length) {
            className +=
              typedHistory[index] === char
                ? " text-green-400"
                : " text-red-400";
          }

          return (
            // <span key={index} className={className}>
            //   {char === " " ? "\u00A0" : char}
            // </span>
            <motion.span
              key={index}
              className={className}
              animate={index === currentIndex ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          );
        })}
      </motion.div>

      <motion.div
        className="text-lg text-gray-300 space-y-1"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <p>
          ⏱️ Time:{" "}
          <span className="text-blue-400 font-semibold">
            {formatTime(elapsedTime)}
          </span>
        </p>
        <p>
          🔁 Letter Mistakes:{" "}
          <span className="text-red-400 font-semibold">{mistakes}</span>
        </p>
        <p>
          📕 Word Mistakes:{" "}
          <span className="text-orange-400 font-semibold">{wordMistakes}</span>
        </p>
        <p>
          ⌫ Backspaces Used:{" "}
          <span className="text-yellow-300 font-semibold">{backspaces}</span>
        </p>
        <p>
          💨 WPM:{" "}
          <span className="text-green-400 font-semibold">{getWPM()}</span>
        </p>
        <p>
          🎯 Accuracy:{" "}
          <span className="text-purple-400 font-semibold">
            {getAccuracy()}%
          </span>
        </p>
        {isCompleted && (
          <p className="text-green-400 font-semibold mt-2">
            ✅ Typing Complete!
          </p>
        )}
      </motion.div>
    </div>
  );
}
