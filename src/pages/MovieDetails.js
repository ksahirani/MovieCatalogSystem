import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Button, Badge, Form, Spinner, Alert } from 'react-bootstrap';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';
import EditCommentModal from '../components/EditCommentModal';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const { user } = useContext(UserContext);
  const notyf = new Notyf();

  useEffect(() => {
    fetchMovieAndComments();
  }, [id]);

  const fetchMovieAndComments = () => {
    setIsLoading(true);
    setError(null);

    fetch(`https://movieapp-api-lms1.onrender.com/movies/getMovie/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data._id) {
          setMovie(data);
          if (user.id) {
            const token = localStorage.getItem('token');
            if (token) {
              fetch(`https://movieapp-api-lms1.onrender.com/users/movies/getComments/${id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              })
                .then(res => res.json())
                .then(commentsData => {
                  setComments(commentsData.comments || []);
                  setIsLoading(false);
                });
            } else {
              setIsLoading(false);
            }
          } else {
            setIsLoading(false);
          }
        } else {
          setError('Movie not found');
          setIsLoading(false);
        }
      });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      notyf.error('Please login to add comments');
      return;
    }

    fetch(`https://movieapp-api-lms1.onrender.com/users/movies/addComment/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ comment: newComment })
    })
      .then(res => res.json())
      .then(data => {
        if (data.updatedMovie) {
          fetchMovieAndComments();
          setNewComment('');
          notyf.success('Comment added!');
        } else {
          notyf.error(data.message || 'Failed to add comment');
        }
      });
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      const token = localStorage.getItem('token');
      if (!token) {
        notyf.error('Please login to delete comments');
        return;
      }

      fetch(`https://movieapp-api-lms1.onrender.com/users/movies/deleteComment/${id}/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.message === 'Comment deleted successfully') {
            setComments(prev => prev.filter(c => c._id !== commentId));
            notyf.success('Comment deleted!');
          } else {
            notyf.error(data.message || 'Failed to delete comment');
          }
        });
    }
  };

  const handleEditComment = (comment) => {
    setSelectedComment(comment);
    setShowEditModal(true);
  };

  const handleCommentUpdated = () => {
    fetchMovieAndComments();
  };

  const canEditComment = (comment) => {
    return user.id && comment.userId && comment.userId._id === user.id;
  };

  const canDeleteComment = (comment) => {
    return user.id && ((comment.userId && comment.userId._id === user.id) || user.isAdmin);
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          {error}
          <br />
          <Button variant="outline-primary" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      {movie && (
        <>
          <div className="d-flex mb-4">
            <Button variant="outline-secondary" href="/movies" className="me-2">
              Back to Movies
            </Button>
          </div>

          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="display-5">{movie.title}</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">
                Directed by {movie.director} ({movie.year})
              </Card.Subtitle>
              <Badge bg="primary" className="mb-3">{movie.genre}</Badge>
              <Card.Text className="lead">{movie.description}</Card.Text>
            </Card.Body>
          </Card>

          <section className="mb-5">
            <h3 className="mb-4">Comments ({comments.length})</h3>

            {user.id ? (
              <Form onSubmit={handleAddComment} className="mb-4">
                <Form.Group>
                  <Form.Label>Add Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about this movie..."
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-2">
                  Post Comment
                </Button>
              </Form>
            ) : (
              <Alert variant="info">
                Please <a href="/login">login</a> to leave a comment
              </Alert>
            )}

            <div className="comments-list">
              {comments.length === 0 ? (
                <p>No comments yet. {user.id ? 'Be the first to comment!' : 'Login to view and add comments!'}</p>
              ) : (
                comments.map(comment => (
                  <Card key={comment._id} className="mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <Card.Subtitle className="mb-2 text-muted">
                            {comment.userId?.email || 'Unknown User'}
                          </Card.Subtitle>
                          <Card.Text>{comment.comment}</Card.Text>
                        </div>
                        <div className="d-flex gap-2">
                          {canEditComment(comment) && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEditComment(comment)}
                            >
                              Edit
                            </Button>
                          )}
                          {canDeleteComment(comment) && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteComment(comment._id)}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              )}
            </div>
          </section>

          <EditCommentModal
            show={showEditModal}
            handleClose={() => setShowEditModal(false)}
            comment={selectedComment}
            movieId={id}
            onCommentUpdated={handleCommentUpdated}
          />
        </>
      )}
    </Container>
  );
}
