import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import AddReview from '../components/AddReview';

function GigDetails() {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [reviews, setReviews] = useState([]);

  const fetchGig = useCallback(async () => {
    try {
      const res = await API.get(`/gigs/${id}`);
      setGig(res.data);
    } catch (err) {
      alert('Failed to load gig');
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await API.get(`/reviews/gig/${id}`);
      setReviews(res.data.reviews);
    } catch (err) {
      console.error('Failed to load reviews');
    }
  }, [id]);

  useEffect(() => {
    fetchGig();
    fetchReviews();
  }, [fetchGig, fetchReviews]);

  const handlePurchase = async () => {
    try {
      await API.post('/orders', { gigId: gig._id });
      alert('Order placed successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    }
  };

  if (!gig) return <p>Loading...</p>;

  return (
    <div>
      <h2>{gig.title}</h2>
      <p>{gig.description}</p>
      <p>Category: {gig.category}</p>
      <p>Delivery: {gig.deliveryTime} days</p>
      <p>Price: ₹{gig.price}</p>
      <p>Seller: {gig.seller?.name}</p>

      <button onClick={handlePurchase}>Purchase</button>

      <hr />

      <h3>Reviews</h3>

      {reviews.length === 0 && <p>No reviews yet</p>}

      {reviews.map((review) => (
        <div key={review._id}>
          <p><strong>Rating:</strong> {review.rating}</p>
          <p>{review.comment}</p>
        </div>
      ))}

      <AddReview onSuccess={fetchReviews} />
    </div>
  );
}

export default GigDetails;
