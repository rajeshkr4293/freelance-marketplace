import { useEffect, useState } from 'react';
import API from '../api/axios';
import { Link } from 'react-router-dom';

function GigList() {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await API.get('/gigs');
        setGigs(res.data.gigs);
      } catch (err) {
        alert('Failed to load gigs');
      }
    };

    fetchGigs();
  }, []);

  return (
    <div>
      <h2>All Gigs</h2>

      {gigs.map((gig) => (
        <div key={gig._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{gig.title}</h3>
          <p>{gig.description}</p>
          <p>₹{gig.price}</p>

          <Link to={`/gigs/${gig._id}`}>View</Link>
        </div>
      ))}
    </div>
  );
}

export default GigList;
