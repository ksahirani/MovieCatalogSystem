import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function EditMovieModal({ show, handleClose, movie, fetchMovies }) {
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    year: '',
    genre: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const notyf = new Notyf();

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || '',
        director: movie.director || '',
        year: movie.year || '',
        genre: movie.genre || '',
        description: movie.description || ''
      });
    }
  }, [movie]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetch(`https://movieapp-api-lms1.onrender.com/updateMovie/${movie._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'Movie updated successfully' || data.updatedMovie) {
        notyf.success('Movie updated successfully!');
        fetchMovies();
        handleClose();
      } else {
        notyf.error(data.message || 'Failed to update movie');
      }
    })
    .catch(err => notyf.error('Error updating movie'))
    .finally(() => setIsLoading(false));
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Movie</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Director</Form.Label>
            <Form.Control
              type="text"
              name="director"
              value={formData.director}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Year</Form.Label>
                <Form.Control
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Genre</Form.Label>
                <Form.Control
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Movie'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}