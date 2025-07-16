import { useState, useEffect, useContext } from 'react';
import { Spinner } from 'react-bootstrap';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);
  const notyf = new Notyf();

  const fetchMovies = () => {
    setIsLoading(true);
    fetch('https://movieapp-api-lms1.onrender.com/movies/getMovies')
      .then(res => res.json())
      .then(data => {
        setMovies(data);
        setIsLoading(false);
      })
      .catch(err => {
        notyf.error('Failed to load movies');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return user.isAdmin ? (
    <AdminView movies={movies} fetchMovies={fetchMovies} />
  ) : (
    <UserView movies={movies} />
  );
}