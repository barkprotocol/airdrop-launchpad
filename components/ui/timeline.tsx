import React from 'react';

interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="relative">
      {items.map((item, index) => (
        <div key={index} className="mb-8">
          <div className="flex items-center">
            <div className="absolute left-1/2 w-0.5 h-full bg-gray-300 -translate-x-1/2"></div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#D0C8B9] to-[#E5DFD3] flex items-center justify-center text-white">
                <span className="font-semibold">{index + 1}</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">{item.date}</p>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
