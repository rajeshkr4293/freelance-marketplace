import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import GigList from './pages/GigList';
import GigDetails from './pages/GigDetails';
import CreateGig from './pages/CreateGig';
import FreelancerDashboard from './pages/FreelancerDashboard';
import ClientDashboard from './pages/ClientDashboard';
import Navbar from './components/Navbar';




function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<GigList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gigs/:id" element={<GigDetails />} />
        <Route path="/create-gig" element={<CreateGig />} />
        <Route path="/dashboard/client" element={<ClientDashboard />} />
        <Route path="/dashboard/freelancer" element={<FreelancerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
