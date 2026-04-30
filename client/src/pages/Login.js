import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../features/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess || user) {
      navigate('/dashboard');
    }
    dispatch(reset());
  }, [user, isSuccess, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div className="card text-center">
        <h1 className="mb-1">Login</h1>
        <p className="text-muted mb-2">Sign in to cast your predictions</p>
        
        {isError && <p style={{ color: 'var(--error-color)', marginBottom: '1rem' }}>{message}</p>}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={onChange}
              required
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </form>
        <p className="mt-2 text-sm text-muted">
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)' }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
