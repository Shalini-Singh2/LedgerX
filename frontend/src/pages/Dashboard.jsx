import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  // State variables for data management
  const [profile, setProfile] = useState(null); 
  const [history, setHistory] = useState([]);   
  
  // State variables for transfer form
  const [receiverEmail, setReceiverEmail] = useState('');
  const [amount, setAmount] = useState('');

  const navigate = useNavigate();

  // Trigger data fetch on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Redirect to login if token is missing
    if (!token) {
      navigate('/');
      return;
    }

    fetchData(token);
  }, [navigate]); 

  // Fetch user profile and transaction history
  const fetchData = async (token) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const profileRes = await axios.get('/api/users/profile', config);
      setProfile(profileRes.data);

      const historyRes = await axios.get('/api/users/transactions', config);
      setHistory(historyRes.data.history);

    } catch (error) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token'); 
      navigate('/'); 
    }
  };

  // Handle funds transfer submission
  const handleTransfer = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.post('/api/users/transfer', {
        receiverEmail: receiverEmail,
        amount: Number(amount) 
      }, config);

      alert('Funds transferred successfully! 💸');
      
      // Reset form fields
      setReceiverEmail('');
      setAmount('');
      
      // Refresh data to reflect new balance and history
      fetchData(token);

    } catch (error) {
      alert('Error: ' + error.response.data.message);
    }
  };

  // Clear session and redirect to login
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/'); 
  };

  // Render loading state while fetching data
  if (!profile) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading... ⏳</h2>;

  return (
    <div className="app-container">
      
      <div className="header-row">
        <h2>Welcome, {profile.name}! 👋</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="balance-card">
        <h3>Current Balance</h3>
        <h1>₹{profile.balance}</h1>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Send Money </h3>
        <form onSubmit={handleTransfer}>
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Receiver's Email" 
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              required
            />
            <input 
              type="number" 
              placeholder="Amount to send" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="primary-btn">Transfer Now</button>
        </form>
      </div>

      <div>
        <h3>Passbook </h3>
        {history.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No transactions yet.</p>
        ) : (
          <ul className="transaction-list">
            {history.map((txn, index) => (
              <li key={index} className="transaction-item">
                <span className="tx-email">To: {txn.receiverEmail}</span>
                <span className="tx-amount">- ₹{txn.amount}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}