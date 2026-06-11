import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating, size = 14 }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} size={size} className="text-amber-500 flex-shrink-0" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} size={size} className="text-amber-500 flex-shrink-0" />);
    } else {
      stars.push(<FaRegStar key={i} size={size} className="text-amber-500 flex-shrink-0" />);
    }
  }

  return <div className="flex items-center gap-0.5">{stars}</div>;
};

export default StarRating;
