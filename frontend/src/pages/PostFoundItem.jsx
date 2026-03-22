import React from 'react';
import { Link } from 'react-router-dom';

function PostFoundItem() {
  return (
    <div className="container animate-fade-in" style={{ maxWidth: '600px', marginTop: '3rem' }}>
      <div className="glass glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem' }}>Report Found Item</h2>
          <Link to="/" className="btn btn-outline" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>Go Back</Link>
        </div>

        <p style={{ color: 'var(--accent)', marginBottom: '1.5rem', fontWeight: 500 }}>
          Thank you for helping someone recover their belongings! ✨
        </p>

        <form>
          <div className="input-group">
            <label className="input-label">Item Title</label>
            <input type="text" className="input-field" placeholder="e.g. Found Apple Airpods" />
          </div>

          <div className="input-group">
            <label className="input-label">Category</label>
            <select className="input-field" style={{ appearance: 'none' }}>
              <option>Electronics</option>
              <option>Accessories</option>
              <option>Books / Stationery</option>
              <option>ID Cards</option>
              <option>Other</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Location Found</label>
              <input type="text" className="input-field" placeholder="Cafeteria Table 4" />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Date Found</label>
              <input type="date" className="input-field" />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Upload Photo (Highly Recommended)</label>
            <input type="file" className="input-field" accept="image/*" />
          </div>

          {/* Verification Question Field */}
          <div className="input-group" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
            <label className="input-label" style={{ color: '#fed7aa', fontWeight: 600 }}>Security Claim Question</label>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
               Set a question to verify ownership before someone claims it. (e.g. "What is the wallpaper lock screen?" or "Is there a specific scratch?")
            </p>
            <input type="text" className="input-field" placeholder="Enter claim verification question..." />
          </div>

          <button type="button" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostFoundItem;
