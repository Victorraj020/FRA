import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to role selection page
    navigate('/role-selection');
  }, [navigate]);

  return null;
};

export default Login;
