import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../features/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const { username, email, password } = formData;

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
    const userData = { username, email, password };
    dispatch(register(userData));
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div className="card text-center">
        <h1 className="mb-1">Register</h1>
        <p className="text-muted mb-2">Create an account to join TrendCast</p>
        
        {isError && <p style={{ color: 'var(--error-color)', marginBottom: '1rem' }}>{message}</p>}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              placeholder="Enter your username"
              onChange={onChange}
              required
            />
          </div>
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
              minLength="6"
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </form>
        <p className="mt-2 text-sm text-muted">
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
