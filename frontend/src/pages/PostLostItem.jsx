import React from 'react';
import { Link } from 'react-router-dom';

function PostLostItem() {
  return (
    <div className="container animate-fade-in" style={{ maxWidth: '600px', marginTop: '3rem' }}>
      <div className="glass glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem' }}>Report Lost Item</h2>
          <Link to="/" className="btn btn-outline" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>Go Back</Link>
        </div>

        <form>
          <div className="input-group">
            <label className="input-label">Item Title</label>
            <input type="text" className="input-field" placeholder="e.g. Lost Blue Airpods" />
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

          <div className="input-group">
            <label className="input-label">Description & Tags</label>
            <textarea className="input-field" rows="4" placeholder="Describe specific details, color, brand..."></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Last Seen Location</label>
              <input type="text" className="input-field" placeholder="Library 2nd Floor" />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Date Lost</label>
              <input type="date" className="input-field" />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Upload Photo (Optional)</label>
            <input type="file" className="input-field" accept="image/*" />
          </div>

          <button type="button" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostLostItem;
