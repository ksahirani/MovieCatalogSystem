import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function MovieCard({ movie }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mb-3 h-100">
        <Card.Body className="d-flex flex-column">
          <Card.Title>{movie.title}</Card.Title>
          <div className="mb-2">
            <Badge bg="secondary" className="me-1">{movie.genre}</Badge>
            <Badge bg="info">{movie.year}</Badge>
          </div>
          <div className="mb-2">Director: {movie.director}</div>
          <div className="text-muted mb-3">{movie.description.substring(0, 100)}...</div>
          <div className="mt-auto">
            <Button 
              as={Link} 
              to={`/movies/${movie._id}`} 
              variant="primary" 
              className="w-100"
            >
              View Details
            </Button>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
}