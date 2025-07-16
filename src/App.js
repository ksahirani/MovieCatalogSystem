import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Logout from './pages/Logout';
import UserContext from './context/UserContext';
import Loading from './components/Loading';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'notyf/notyf.min.css';

function App() {
  const [user, setUser] = useState({ id: null, isAdmin: false });
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser({ id: null, isAdmin: false });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:4000/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data._id) {
          setUser({
            id: data._id,
            email: data.email,
            isAdmin: data.isAdmin
          });
        } else {
          logout();
        }
      })
      .catch(() => logout())
      .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [logout]);

  if (isLoading) return <Loading />;

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      <Router>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user.id ? <Navigate to="/movies" /> : <Login />} />
          <Route path="/register" element={user.id ? <Navigate to="/movies" /> : <Register />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails />} /> {/* Removed login restriction */}
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;