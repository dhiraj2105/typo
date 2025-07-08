"use client";

import { TEACHING_PARAGRAPH } from "@/utils/paragraph";
import { useEffect, useState } from "react";

const TOTAL_ROUNDS = 10;

export default function TeachingMode() {
  const [round, setRound] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedHistory, setTypedHistory] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [backspaces, setBackspaces] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [results, setResults] = useState([]);

  // Timer
  useEffect(() => {
    let interval;
    if (startTime && !isRoundComplete) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isRoundComplete]);

  // Typing Logic
  useEffect(() => {
    const handleKeydown = (e) => {
      if (isRoundComplete || round > TOTAL_ROUNDS) return;

      const key = e.key;
      if (!startTime) setStartTime(Date.now());

      if (key === "Backspace") {
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
          setTypedHistory((prev) => prev.slice(0, -1));
          setBackspaces((prev) => prev + 1);
        }
        return;
      }

      if (key.length === 1 || key === "Enter" || key === "Tab" || key === " ") {
        const currentChar = TEACHING_PARAGRAPH[currentIndex];
        const isCorrect = key === currentChar;

        setTypedHistory((prev) => [...prev, key]);
        if (!isCorrect) setMistakes((prev) => prev + 1);

        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);

        if (nextIndex === TEACHING_PARAGRAPH.length) {
          setIsRoundComplete(true);

          const correctChars = TEACHING_PARAGRAPH.split("").reduce(
            (acc, char, i) => {
              return typedHistory[i] === char ? acc + 1 : acc;
            },
            0
          );

          const timeInMin = (elapsedTime || 1) / 60;
          const wpm = Math.round(typedHistory.length / 5 / timeInMin);
          const accuracy = (
            (correctChars / typedHistory.length) * 100 || 0
          ).toFixed(1);

          const roundData = {
            round,
            wpm,
            accuracy,
            mistakes,
            backspaces,
            time: elapsedTime,
          };

          setResults((prev) => [...prev, roundData]);

          setTimeout(() => {
            setRound((r) => r + 1);
            setCurrentIndex(0);
            setTypedHistory([]);
            setMistakes(0);
            setBackspaces(0);
            setStartTime(null);
            setElapsedTime(0);
            setIsRoundComplete(false);
          }, 2000); // brief pause before next round
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [
    currentIndex,
    typedHistory,
    elapsedTime,
    mistakes,
    backspaces,
    round,
    isRoundComplete,
  ]);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  if (round > TOTAL_ROUNDS) {
    return (
      <div className="text-center space-y-4 max-w-3xl">
        <h2 className="text-2xl font-bold text-green-400">
          🎉 All Rounds Complete
        </h2>
        <table className="w-full text-left text-sm text-gray-300 border border-gray-600">
          <thead>
            <tr className="bg-gray-800 text-gray-100">
              <th className="px-2 py-1 border">Round</th>
              <th className="px-2 py-1 border">Time</th>
              <th className="px-2 py-1 border">WPM</th>
              <th className="px-2 py-1 border">Accuracy</th>
              <th className="px-2 py-1 border">Mistakes</th>
              <th className="px-2 py-1 border">Backspaces</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res) => (
              <tr key={res.round} className="text-sm">
                <td className="px-2 py-1 border">{res.round}</td>
                <td className="px-2 py-1 border">{formatTime(res.time)}</td>
                <td className="px-2 py-1 border">{res.wpm}</td>
                <td className="px-2 py-1 border">{res.accuracy}%</td>
                <td className="px-2 py-1 border">{res.mistakes}</td>
                <td className="px-2 py-1 border">{res.backspaces}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl px-6 text-white">
      <h1 className="text-xl font-semibold mb-4 text-center">
        Round {round} of {TOTAL_ROUNDS}
      </h1>

      <div className="flex flex-wrap text-2xl sm:text-3xl leading-relaxed mb-6 select-none">
        {TEACHING_PARAGRAPH.split("").map((char, i) => {
          let className = "px-0.5";

          if (i === currentIndex)
            className += " bg-yellow-300 text-black rounded";
          else if (i < typedHistory.length) {
            className +=
              typedHistory[i] === char ? " text-green-400" : " text-red-400";
          }

          return (
            <span key={i} className={className}>
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>

      <div className="text-gray-300 space-y-1 text-sm sm:text-base">
        <p>
          ⏱️ Time:{" "}
          <span className="text-blue-400">{formatTime(elapsedTime)}</span>
        </p>
        <p>
          🔁 Mistakes: <span className="text-red-400">{mistakes}</span>
        </p>
        <p>
          ⌫ Backspaces: <span className="text-yellow-300">{backspaces}</span>
        </p>
      </div>

      {isRoundComplete && (
        <p className="text-green-400 mt-3">
          ✅ Round Complete! Next round starting...
        </p>
      )}
    </div>
  );
}
