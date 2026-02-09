import { useEffect, useState } from 'react';
import API from '../api/axios';

function ClientDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/orders/dashboard/client');
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
      <h2>Client Dashboard</h2>
      <p>Total Purchases: {data.totalPurchases}</p>
      <p>Completed Purchases: {data.completedPurchases}</p>
    </div>
  );
}

export default ClientDashboard;
