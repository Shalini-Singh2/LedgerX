import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle user authentication
  const handleLogin = async (e) => {
    e.preventDefault(); 

    try {
      const response = await axios.post('/api/users/login', {
        email: email,
        password: password
      });

      // Save JWT token to local storage and redirect
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');

    } catch (error) {
      if (error.response) {
        alert('Error: ' + error.response.data.message);
      } else {
        alert('Unable to connect to the server. Is the backend running?');
      }
    }
  };

  return (
    <div className="app-container" style={{ textAlign: 'center' }}>
      <h2 style={{ marginBottom: '25px' }}>LedgerX Login </h2>
      
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </div>
        
        <button type="submit" className="primary-btn">
          Login Securely
        </button>
      </form>

      <p style={{ marginTop: '20px', color: '#6b7280' }}>
        Don't have an account? <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'none' }}>Create one here</Link>
      </p>
    </div>
  );
}