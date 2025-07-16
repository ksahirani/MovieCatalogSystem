import { useContext } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Home() {
  const { user } = useContext(UserContext);

  return (
    <Container className="mt-5 text-center">
      <h1>Welcome to Movie Catalog</h1>
      <p className="lead">
        Browse our collection of movies and share your thoughts
      </p>
      {user.id ? (
        <Button as={Link} to="/movies" variant="primary" size="lg">
          Browse Movies
        </Button>
      ) : (
        <div>
          <Button as={Link} to="/login" variant="primary" size="lg" className="me-3">
            Login
          </Button>
          <Button as={Link} to="/register" variant="secondary" size="lg">
            Register
          </Button>
        </div>
      )}
    </Container>
  );
}