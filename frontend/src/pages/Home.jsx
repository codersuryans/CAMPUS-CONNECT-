import React from 'react';
import { Link } from 'react-router-dom';

function Home({ items, loading }) {
  return (
    <div className="container animate-fade-in">
      <nav className="navbar">
        <Link to="/" className="nav-brand gradient-text" style={{ textDecoration: 'none' }}>
          📦 CampusCrate
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline">My Claims</button>
          <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none' }}>Login / Sign up</Link>
        </div>
      </nav>

      <header className="glass glass-panel" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Lost something? Found something?</h1>
        <p className="gradient-text" style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
          The centralized hub to recover your belongings safely.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
          <Link to="/post-lost" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', textDecoration: 'none' }}>
            🔍 I Lost Something
          </Link>
          <Link to="/post-found" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.1rem', textDecoration: 'none' }}>
            🖐️ I Found Something
          </Link>
        </div>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.8rem' }}>Recent Reports</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>All</button>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Lost</button>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Found</button>
        </div>
      </div>

      <div className="grid grid-cols-2">
        {loading ? (
          <p>Loading items...</p>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="glass glass-panel item-card">
              <span className={`item-badge ${item.type === 'lost' ? 'badge-lost' : 'badge-found'}`}>
                {item.type}
              </span>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                📍 {item.location} &nbsp; | &nbsp; 📅 {new Date(item.date).toLocaleDateString()}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', padding: '0.3rem 0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                  {item.category}
                </span>
                <Link to={`/item/${idx}`} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none' }}>
                  {item.type === 'lost' ? 'I found this!' : 'Claim Item'}
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
