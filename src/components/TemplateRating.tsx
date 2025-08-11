import React, { useEffect, useState } from 'react';
import { addTemplateRating, getTemplateRatings, TemplateRating } from '../data/templates';
import './TemplateRating.css';

interface TemplateRatingProps {
  templateId: string;
  currentRating?: number;
  ratingCount?: number;
  showForm?: boolean;
  onRatingAdded?: () => void;
  onClose?: () => void;
}

const TemplateRatingComponent: React.FC<TemplateRatingProps> = ({
  templateId,
  currentRating,
  ratingCount,
  showForm = false,
  onRatingAdded,
  onClose
}) => {
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showRatingForm, setShowRatingForm] = useState(showForm);
  const [ratings, setRatings] = useState<TemplateRating[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load existing ratings for this template
    const existingRatings = getTemplateRatings(templateId);
    setRatings(existingRatings);
  }, [templateId]);

  const handleRatingSubmit = async () => {
    if (userRating === 0) return;
    
    setIsSubmitting(true);
    
    const newRating: TemplateRating = {
      templateId,
      rating: userRating,
      comment: comment.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      addTemplateRating(newRating);
      
      // Update local state
      setRatings(prev => [...prev, newRating]);
      
      // Reset form
      setUserRating(0);
      setComment('');
      setShowRatingForm(false);
      
      // Notify parent component
      onRatingAdded && onRatingAdded();
      
    } catch {
      // Rating submission failed silently
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, size: 'small' | 'medium' | 'large' = 'medium') => {
    const sizeClass = `stars-${size}`;
    
    return (
      <div className={`star-rating ${sizeClass} ${interactive ? 'interactive' : ''}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`star ${
              star <= (interactive ? (hoveredRating || userRating) : rating) ? 'filled' : ''
            }`}
            onClick={() => interactive && setUserRating(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            disabled={!interactive || isSubmitting}
          >
            ⭐
          </button>
        ))}
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Very Good';
    if (rating >= 2.5) return 'Good';
    if (rating >= 1.5) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="template-rating-container">
      {onClose && (
        <div className="rating-header">
          <h3>⭐ Rate Template</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
      )}
      
      {/* Current Rating Display */}
      {currentRating && (
        <div className="current-rating">
          {renderStars(currentRating, false, 'small')}
          <span className="rating-info">
            <strong>{currentRating}</strong> ({getRatingText(currentRating)})
            {ratingCount && <span className="rating-count"> • {ratingCount} reviews</span>}
          </span>
        </div>
      )}

      {/* Add Rating Button */}
      {!showRatingForm && (
        <button
          className="add-rating-btn"
          onClick={() => setShowRatingForm(true)}
        >
          ⭐ Rate this template
        </button>
      )}

      {/* Rating Form */}
      {showRatingForm && (
        <div className="rating-form">
          <h4>Rate this template</h4>
          
          <div className="rating-input">
            <label>Your Rating:</label>
            {renderStars(userRating, true, 'large')}
            <span className="rating-label">
              {userRating > 0 && getRatingText(userRating)}
            </span>
          </div>

          <div className="comment-input">
            <label htmlFor="rating-comment">Comment (optional):</label>
            <textarea
              id="rating-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this template..."
              rows={3}
              maxLength={500}
            />
            <span className="char-count">{comment.length}/500</span>
          </div>

          <div className="rating-actions">
            <button
              className="cancel-rating-btn"
              onClick={() => {
                setShowRatingForm(false);
                setUserRating(0);
                setComment('');
              }}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="submit-rating-btn"
              onClick={handleRatingSubmit}
              disabled={userRating === 0 || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </div>
      )}

      {/* Existing Ratings */}
      {ratings.length > 0 && (
        <div className="existing-ratings">
          <h5>Recent Reviews ({ratings.length})</h5>
          <div className="ratings-list">
            {ratings.slice(-3).reverse().map((rating, index) => (
              <div key={index} className="rating-item">
                <div className="rating-header">
                  {renderStars(rating.rating, false, 'small')}
                  <span className="rating-date">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {rating.comment && (
                  <p className="rating-comment">{rating.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateRatingComponent; 