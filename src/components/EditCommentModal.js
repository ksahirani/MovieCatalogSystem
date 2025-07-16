import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function EditCommentModal({ show, handleClose, comment, movieId, onCommentUpdated }) {
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const notyf = new Notyf();

  useEffect(() => {
    if (comment) {
      setCommentText(comment.comment || '');
    }
  }, [comment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsLoading(true);

    fetch(`https://movieapp-api-lms1.onrender.com/movies/updateComment/${movieId}/${comment._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ comment: commentText })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'Comment updated successfully' || data.updatedComment) {
        notyf.success('Comment updated successfully!');
        onCommentUpdated(data.updatedMovie);
        handleClose();
      } else {
        notyf.error(data.message || 'Failed to update comment');
      }
    })
    .catch(err => notyf.error('Error updating comment'))
    .finally(() => setIsLoading(false));
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Comment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Edit your comment..."
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Comment'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}