import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating }) => {
  const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 !== 0;

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        if (index < fullStars) {
          return <Star key={index} className="w-6 h-6 text-yellow-400 fill-current" />;
        } else if (index === fullStars && hasHalfStar) {
          return (
            <span key={index} className="relative">
              <Star className="w-6 h-6 text-gray-300" />
              <div className="absolute inset-0 overflow-hidden w-[50%]">
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
              </div>
            </span>
          );
        } else {
          return <Star key={index} className="w-6 h-6 text-gray-300" />;
        }
      })}
    </div>
  );
};

export default StarRating;
