"use client";

import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date;
  onComplete?: () => void;
}

export function Countdown({ targetDate, onComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +targetDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (Object.keys(newTimeLeft).length === 0) {
        onComplete && onComplete();
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval as keyof typeof timeLeft]) {
      return null;
    }

    return (
      <div key={interval} className="flex flex-col items-center mx-2">
        <span className="text-4xl font-bold text-[#D0C8B9]">
          {timeLeft[interval as keyof typeof timeLeft]}
        </span>
        <span className="text-sm uppercase text-gray-400">{interval}</span>
      </div>
    );
  });

  return (
    <div className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-md rounded-lg p-6 border border-[#D0C8B9] border-opacity-20">
      <h2 className="text-2xl font-semibold mb-4 text-white text-center">Countdown to Launch</h2>
      <div className="flex justify-center">
        {timerComponents.length ? timerComponents : <span className="text-white">Time's up!</span>}
      </div>
    </div>
  );
}

