import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';
import StarRating from '../common/StarRating';
import Button from '../ui/Button';

const ReviewSection = ({ product, userInfo, onReviewSubmit, submitting }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onReviewSubmit({ rating, comment });
      setComment('');
      setRating(5);
    }
  };

  // Calculate rating distribution
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalReviews = product.reviews?.length || 0;
  
  if (totalReviews > 0) {
    product.reviews.forEach(r => {
      const rounded = Math.round(r.rating);
      if (distribution[rounded] !== undefined) distribution[rounded]++;
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      {/* Left Column: Summary & Form */}
      <div className="lg:col-span-4 space-y-8">
        
        {/* Rating Summary */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Customer Reviews</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl font-black text-slate-900 dark:text-white">
              {product.rating.toFixed(1)}
            </div>
            <div className="flex flex-col gap-1">
              <StarRating rating={product.rating} size={20} />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Based on {totalReviews} reviews
              </span>
            </div>
          </div>

          {/* Distribution Bars */}
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-12 font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    {star} <FaStar className="text-amber-500" size={10} />
                  </span>
                  <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-slate-500 text-xs">
                    {Math.round(percentage)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Write Review Form */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4">Share your thoughts</h4>
          
          {userInfo ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Rating</label>
                <div className="flex gap-1.5 text-amber-500 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRating(val)}
                      className="focus:outline-none transform hover:scale-110 transition-transform"
                    >
                      {val <= rating ? <FaStar size={24} /> : <FaRegStar size={24} className="text-slate-300 dark:text-slate-600" />}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Review</label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like or dislike about this product?"
                  className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 dark:text-white resize-none"
                  required
                ></textarea>
              </div>
              
              <Button type="submit" variant="primary" loading={submitting} className="w-full">
                Submit Review
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-slate-500 mb-4">Sign in to write a review.</p>
              <Link to="/login">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Review List */}
      <div className="lg:col-span-8">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
          Latest Reviews
        </h4>
        
        <div className="space-y-6">
          {totalReviews > 0 ? (
            product.reviews.map((rev) => (
              <div key={rev._id} className="flex gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-fadeIn">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-lg">
                    {rev.name[0].toUpperCase()}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                    <h5 className="font-bold text-slate-900 dark:text-white">{rev.name}</h5>
                    <span className="text-xs text-slate-500">
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently'}
                    </span>
                  </div>
                  
                  <StarRating rating={rev.rating} size={14} />
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                    {rev.comment}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400">No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ReviewSection;
