import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import type { User } from '~/mocks/data/users';

interface RatingModalProps {
  user: User;
  onSubmit: (score: 1 | 2 | 3 | 4 | 5, comment?: string) => Promise<void>;
  onClose: () => void;
}

export default function RatingModal({ user, onSubmit, onClose }: RatingModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setLoading(true);
    try {
      await onSubmit(rating as 1 | 2 | 3 | 4 | 5, comment);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[10px] max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-charcoal">Rate this helper</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 mb-6 p-4 bg-slate-50 rounded-[10px]">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-bold text-charcoal">{user.name}</p>
            <p className="text-xs text-gray-500">Supporter</p>
          </div>
        </div>

        {/* Star Rating Picker */}
        <div className="mb-6">
          <p className="text-sm font-bold text-gray-600 mb-3">How was your experience?</p>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-2 transition-all transform hover:scale-110 ${
                  star <= rating
                    ? 'text-yellow-400 scale-110'
                    : 'text-gray-300 hover:text-gray-400'
                }`}
              >
                <Star
                  size={32}
                  fill={star <= rating ? 'currentColor' : 'none'}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Rating Text */}
        {rating > 0 && (
          <p className="text-center text-sm font-bold text-charcoal mb-6">
            {rating === 5 && '⭐ Excellent!'}
            {rating === 4 && '😊 Great!'}
            {rating === 3 && '👍 Good'}
            {rating === 2 && '😐 Fair'}
            {rating === 1 && '😞 Poor'}
          </p>
        )}

        {/* Comment Box */}
        <div className="mb-6">
          <label className="text-xs font-bold text-gray-600 mb-2 block">
            Comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details about your experience..."
            className="w-full p-3 border border-gray-200 rounded-[10px] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-kizuna-green/30"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || loading}
          className={`w-full py-3 rounded-[10px] font-bold text-sm uppercase tracking-wider transition-all ${
            rating === 0 || loading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-kizuna-green text-white hover:brightness-110'
          }`}
        >
          {loading ? 'Submitting...' : `Submit ${rating}-Star Rating`}
        </button>
      </div>
    </div>
  );
}
