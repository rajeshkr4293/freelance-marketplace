import { useState } from 'react';
import API from '../api/axios';

function AddReview({ orderId, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/reviews', {
        orderId,
        rating,
        comment
      });
      alert('Review added successfully');
      setComment('');
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add review');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Add Review</h4>

      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />

      <textarea
        placeholder="Your review"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button type="submit">Submit Review</button>
    </form>
  );
}

export default AddReview;
