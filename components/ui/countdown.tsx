import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
  onComplete?: () => void;
  className?: string;
}

export const Countdown: React.FC<CountdownProps> = ({ targetDate, onComplete, className }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return null;
    };

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (!newTimeLeft) {
        clearInterval(timer);
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  if (isComplete) {
    return (
      <div className={`${className} text-center p-6 bg-black bg-opacity-60 backdrop-blur-sm rounded-xl`}>
        <h3 className="text-xl font-semibold mb-2 text-[#d0c8b9]">Claim Period Ended</h3>
        <p className="text-[#8c8475]">The BARK token claim period has ended. Thank you for your participation!</p>
      </div>
    );
  }

  if (!timeLeft) {
    return null; // or a loading state if preferred
  }

  return (
    <div className={`${className} grid grid-cols-4 gap-4 p-6 bg-black bg-opacity-60 rounded-xl backdrop-blur-sm`}>
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-[#d0c8b9] mb-1">{value.toString().padStart(2, '0')}</div>
          <div className="text-xs md:text-sm text-[#8c8475] uppercase">{unit}</div>
        </div>
      ))}
    </div>
  );
};