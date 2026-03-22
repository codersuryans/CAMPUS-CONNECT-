import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="container animate-fade-in" style={{ maxWidth: '500px', marginTop: '5rem' }}>
      <div className="glass glass-panel">
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Login with your student credentials
        </p>

        <form>
          <div className="input-group">
            <label className="input-label">College Email</label>
            <input type="email" className="input-field" placeholder="student@college.edu" />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input type="password" className="input-field" placeholder="••••••••" />
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
            Sign In
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          <Link to="/" className="gradient-text" style={{ textDecoration: 'none' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
