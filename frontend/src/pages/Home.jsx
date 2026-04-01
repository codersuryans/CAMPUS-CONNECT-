import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../config';

/* ── Typewriter hook ── */
function useTypewriter(words, speed = 80, pause = 2000) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const delay = deleting ? speed / 2 : speed;

    const timer = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCharIdx(c => c + 1);
        }
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx === 0) {
          setDeleting(false);
          setWordIdx(w => (w + 1) % words.length);
        } else {
          setCharIdx(c => c - 1);
        }
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

/* ── Animated count-up hook ── */
function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const step = target / (duration / 16);
    let cur = 0;
    const id = setInterval(() => {
      cur = Math.min(cur + step, target);
      setCount(Math.floor(cur));
      if (cur >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return count;
}

/* ── Particle Stars (pure CSS via inline generated elements) ── */
function Stars() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 2.5 + 1}px`,
    delay: `${Math.random() * 8}s`,
    dur: `${Math.random() * 4 + 3}s`,
  }));
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {stars.map(s => (
        <span key={s.id} style={{
          position: 'absolute',
          borderRadius: '50%',
          top: s.top, left: s.left,
          width: s.size, height: s.size,
          background: 'white',
          opacity: 0,
          animation: `starTwinkle ${s.dur} ${s.delay} ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

const FILTERS = ['All', 'Lost', 'Found'];

export default function Home() {
  const { user, logout } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const typed = useTypewriter(['Lost something?', 'Found something?', 'Help your campus!'], 75, 1800);

  const totalItems   = useCountUp(items.length || 128);
  const returnedItems = useCountUp(Math.floor((items.length || 128) * 0.6));
  const activeUsers  = useCountUp(432);

  const mockItems = [
    { title: 'Lost Blue Water Bottle', category: 'Accessories', date: '2023-11-01', type: 'lost', location: 'Library 2nd Floor' },
    { title: 'Found Apple AirPods', category: 'Electronics', date: '2023-11-02', type: 'found', location: 'Cafeteria' },
    { title: 'Lost ID Card', category: 'Documents', date: '2023-11-03', type: 'lost', location: 'Main Gate' },
    { title: 'Found Umbrella', category: 'Accessories', date: '2023-11-04', type: 'found', location: 'Seminar Hall' },
  ];

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/items`)
      .then(res => res.json())
      .then(data => setItems(Array.isArray(data) && data.length > 0 ? data : mockItems))
      .catch(() => setItems(mockItems))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? items : items.filter(i => i.type === filter.toLowerCase());

  return (
    <div className="container animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
      <Stars />

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <Link to="/" className="nav-brand gradient-text" style={{ textDecoration: 'none' }}>
          📦 CampusConnect
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>👋 {user.name || 'Student'}</span>
              <Link to="/my-claims" className="btn btn-primary" style={{ textDecoration: 'none' }}>My Claims</Link>
              <button className="btn btn-outline" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn btn-outline" disabled>My Claims</button>
              <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none' }}>Login / Sign up</Link>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <header className="hero-section glass glass-panel" style={{ textAlign: 'center', marginBottom: '2.5rem', padding: '4rem 2.5rem' }}>
        <div className="hero-badge">🎓 Campus Lost &amp; Found Portal</div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', marginBottom: '1rem', minHeight: '4rem' }}>
          <span className="gradient-text">{typed}</span>
          <span className="cursor-blink">|</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '520px', margin: '0 auto 2.5rem' }}>
          The centralized hub to recover your belongings safely and quickly.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link to="/post-lost" className="btn btn-primary" style={{ padding: '1rem 2.2rem', fontSize: '1.05rem', textDecoration: 'none' }}>
            🔍 I Lost Something
          </Link>
          <Link to="/post-found" className="btn btn-outline" style={{ padding: '1rem 2.2rem', fontSize: '1.05rem', textDecoration: 'none' }}>
            🖐️ I Found Something
          </Link>
        </div>
      </header>

      {/* ── STATS BAR ── */}
      <div className="stats-bar glass" style={{ marginBottom: '3rem' }}>
        <div className="stat-item">
          <span className="stat-number gradient-text">{totalItems}+</span>
          <span className="stat-label">Items Reported</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-number gradient-text">{returnedItems}+</span>
          <span className="stat-label">Items Returned</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-number gradient-text">{activeUsers}+</span>
          <span className="stat-label">Active Students</span>
        </div>
      </div>

      {/* ── FILTER + SECTION HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.8rem' }}>Recent Reports</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn ${filter === f ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}
            >{f}</button>
          ))}
        </div>
      </div>

      {/* ── ITEMS GRID ── */}
      <div className="grid grid-cols-2">
        {loading ? (
          [1,2,3,4].map(i => <div key={i} className="glass skeleton-card" style={{ height: '260px', borderRadius: '20px' }} />)
        ) : filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            No {filter.toLowerCase()} items found.
          </div>
        ) : (
          filtered.map((item, idx) => {
            const itemId = item._id || idx;
            return (
              <div
                key={itemId}
                className="glass glass-panel item-card"
                style={{ animationDelay: `${idx * 0.08}s`, animation: 'fadeInUp 0.6s ease both' }}
              >
                {item.photoUrl ? (
                  <img src={item.photoUrl} alt={item.title} className="item-image" loading="lazy" />
                ) : (
                  <div className="item-placeholder">NO IMAGE</div>
                )}
                <span className={`item-badge ${item.type === 'lost' ? 'badge-lost' : 'badge-found'}`}>
                  {item.type === 'lost' ? '🔴 Lost' : '🟢 Found'}
                </span>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  📍 {item.location} &nbsp;|&nbsp; 📅 {new Date(item.date).toLocaleDateString()}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.8rem', padding: '0.3rem 0.9rem', background: 'rgba(255,255,255,0.07)', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {item.category}
                  </span>
                  <Link to={`/item/${itemId}`} className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem', textDecoration: 'none' }}>
                    {item.type === 'lost' ? 'I found this →' : 'Claim →'}
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
