import { useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';

export default function Logout() {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const notyf = new Notyf();
  const notificationShown = useRef(false);

  useEffect(() => {
    if (user.id && !notificationShown.current) {
      logout();
      notyf.success('Logged out successfully');
      notificationShown.current = true;
    }
    navigate('/', { replace: true });
  }, [user.id, logout, navigate]);

  return null;
}