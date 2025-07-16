import { Table, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Notyf } from 'notyf';
import { useState } from 'react';
import AddMovieModal from './AddMovieModal';
import EditMovieModal from './EditMovieModal';

export default function AdminView({ movies, fetchMovies }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const notyf = new Notyf();

  const deleteMovie = (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      fetch(`https://movieapp-api-lms1.onrender.com/movies/deleteMovie/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Movie deleted successfully') {
          notyf.success('Movie deleted!');
          fetchMovies();
        } else {
          notyf.error('Failed to delete movie');
        }
      })
      .catch(err => notyf.error('Error deleting movie'));
    }
  };

  const handleEditClick = (movie) => {
    setSelectedMovie(movie);
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setSelectedMovie(null);
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between mb-4">
        <h2>Admin Dashboard</h2>
        <Button onClick={() => setShowAddModal(true)}>
          Add Movie
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Director</th>
            <th>Year</th>
            <th>Genre</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map(movie => (
            <tr key={movie._id}>
              <td>{movie.title}</td>
              <td>{movie.director}</td>
              <td>{movie.year}</td>
              <td>{movie.genre}</td>
              <td>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => handleEditClick(movie)}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => deleteMovie(movie._id)}
                  className="me-2"
                >
                  Delete
                </Button>
                <Button as={Link} to={`/movies/${movie._id}`} size="sm" variant="outline-secondary">
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <AddMovieModal 
        show={showAddModal} 
        handleClose={() => setShowAddModal(false)}
        fetchMovies={fetchMovies}
      />

      <EditMovieModal 
        show={showEditModal} 
        handleClose={handleEditClose}
        movie={selectedMovie}
        fetchMovies={fetchMovies}
      />
    </Container>
  );
}