import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
      <Link to="/create-gig" style={{ marginRight: '10px' }}>Create Gig</Link>
      <Link to="/dashboard/client" style={{ marginRight: '10px' }}>Client Dashboard</Link>
      <Link to="/dashboard/freelancer" style={{ marginRight: '10px' }}>Freelancer Dashboard</Link>

      {!token ? (
        <>
          <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;
