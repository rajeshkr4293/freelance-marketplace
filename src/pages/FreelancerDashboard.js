import { useEffect, useState } from 'react';
import API from '../api/axios';

function FreelancerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/orders/dashboard/freelancer');
        setData(res.data);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to load dashboard');
      }
    };

    fetchDashboard();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Freelancer Dashboard</h2>
      <p>Total Orders: {data.totalOrders}</p>
      <p>Completed Orders: {data.completedOrders}</p>
      <p>Total Earnings: ₹{data.totalEarnings}</p>
    </div>
  );
}

export default FreelancerDashboard;
