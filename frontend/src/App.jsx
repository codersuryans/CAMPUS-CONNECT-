import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mocking items initially or fetching from backend
  useEffect(() => {
    // Attempting to fetch from backend, fallback to mock if backend not running
    fetch('http://localhost:5000/api/items')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          setItems(mockItems);
        }
      })
      .catch((err) => {
        console.warn('Backend not reachable, using mock data for now.');
        setItems(mockItems);
      })
      .finally(() => setLoading(false));
  }, []);

  const mockItems = [
    { title: "Lost Blue Water Bottle", category: "Accessories", date: "2023-11-01", type: "lost", location: "Library 2nd Floor" },
    { title: "Found Apple AirPods", category: "Electronics", date: "2023-11-02", type: "found", location: "Cafeteria" },
    { title: "CS Textbook", category: "Books", date: "2023-11-03", type: "lost", location: "Lecture Hall A" },
  ];

  return (
    <div className="container animate-fade-in">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-brand gradient-text">
          📦 CampusCrate
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline">My Claims</button>
          <button className="btn btn-primary">Login / Sign up</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="glass glass-panel" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Lost something? Found something?</h1>
        <p className="gradient-text" style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
          The centralized hub to recover your belongings safely.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
          <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            🔍 I Lost Something
          </button>
          <button className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            🖐️ I Found Something
          </button>
        </div>
      </header>

      {/* Feed Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.8rem' }}>Recent Reports</h2>
        
        {/* Simple Filters */}
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
                <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                  {item.type === 'lost' ? 'I found this!' : 'Claim Item'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
