import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  // State for user registration fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  // Handle new account creation
  const handleRegister = async (e) => {
    e.preventDefault(); 

    try {
      await axios.post('/api/users/register', {
        name: name,
        email: email,
        password: password
      });

      alert('Account created successfully! 🎉 You can now log in.');
      navigate('/');

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
      <h2 style={{ marginBottom: '25px' }}>Create Account </h2>
      
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)} 
            required
          />
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
        
        <button type="submit" className="primary-btn" style={{ background: '#3b82f6' }}>
          Register Account
        </button>
      </form>

      <p style={{ marginTop: '20px', color: '#6b7280' }}>
        Already have an account? <Link to="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>Log in here</Link>
      </p>
    </div>
  );
}