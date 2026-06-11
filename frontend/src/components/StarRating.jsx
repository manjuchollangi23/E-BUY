import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating = 0, size = 16 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.3 && rating % 1 <= 0.7;
  const isCloseToNext = rating % 1 > 0.7;

  const totalFullStars = isCloseToNext ? fullStars + 1 : fullStars;

  for (let i = 1; i <= 5; i++) {
    if (i <= totalFullStars) {
      stars.push(<FaStar key={i} className="text-amber-500" size={size} />);
    } else if (i === totalFullStars + 1 && hasHalfStar && !isCloseToNext) {
      stars.push(<FaStarHalfAlt key={i} className="text-amber-500" size={size} />);
    } else {
      stars.push(<FaRegStar key={i} className="text-slate-400 dark:text-slate-600" size={size} />);
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      {stars}
    </div>
  );
};

export default StarRating;
