import React from 'react';
import { useParams, Link } from 'react-router-dom';

function ItemDetails() {
  const { id } = useParams();

  return (
    <div className="container animate-fade-in" style={{ marginTop: '3rem' }}>
      <div className="glass glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/" className="btn btn-outline" style={{ display: 'inline-flex', marginBottom: '2rem', padding: '0.5rem 1rem', textDecoration: 'none' }}>
          ← Back
        </Link>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="gradient-text" style={{ fontSize: '1.2rem' }}>[Image Placeholder]</span>
            </div>
          </div>
          <div style={{ flex: '2 1 400px' }}>
             <span className="item-badge badge-found" style={{ position: 'relative', top: '0', right: '0', display: 'inline-block', marginBottom: '1rem' }}>
                FOUND 
             </span>
             <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Found Apple Airpods</h2>
             <p style={{ color: 'var(--accent)', fontWeight: 'bold' }}>📍 Cafeteria Table 4 • 📅 Nov 02, 2023</p>

             <p style={{ color: 'var(--text-main)', marginTop: '1.5rem', lineHeight: '1.6' }}>
               Found these white standard Apple Airpods left on Table 4 in the main cafeteria near the microwave area. 
               It has a scratch on the back of the case. Giving it to the main admin office later today.
             </p>

            <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
              <h3 style={{ color: '#fed7aa', marginBottom: '1rem', fontSize: '1.2rem' }}>🔒 Prove Ownership to Claim</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                 Claim Question: <strong>"What color is the silicone case it was stored in?"</strong>
              </p>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                 <input type="text" className="input-field" placeholder="Answer here..." style={{ flex: 1 }} />
                 <button className="btn btn-primary">Submit Claim</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetails;
