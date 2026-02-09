import { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

function CreateGig() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/gigs', {
        title,
        description,
        price,
        category,
        deliveryTime
      });

      alert('Gig created successfully');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create gig');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Gig</h2>

      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
      <input placeholder="Delivery Time (days)" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />

      <button type="submit">Create</button>
    </form>
  );
}

export default CreateGig;
