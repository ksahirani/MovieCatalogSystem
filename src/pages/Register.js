import { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const notyf = new Notyf();

  const registerUser = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetch('http://localhost:4000/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'Successfully Registered') {
        notyf.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        notyf.error(data.message || 'Registration failed');
      }
    })
    .catch(err => notyf.error('An error occurred during registration'))
    .finally(() => setIsLoading(false));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card p-4">
            <h2 className="text-center mb-4">Register</h2>
            <Form onSubmit={registerUser}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="8"
                />
                <Form.Text className="text-muted">
                  At least 8 characters
                </Form.Text>
              </Form.Group>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isLoading}
                className="w-100"
              >
                {isLoading ? 'Registering...' : 'Register'}
              </Button>
              <div className="text-center mt-3">
                <small>
                  Already have an account? <a href="/login">Login</a>
                </small>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}