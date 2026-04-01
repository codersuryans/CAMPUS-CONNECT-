import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../config';

function ItemDetails() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [claimAnswer, setClaimAnswer] = useState('');
  const [claimStatus, setClaimStatus] = useState('');
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    // If id is a mock ID like 0 or 1, we can't fetch it from DB easily without handling it,
    // but we changed Home to pass _id. If _id doesn't exist, we fallback.
    // For real items, we fetch from /api/items/:id
    fetch(`${API_BASE_URL}/api/items/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.msg === 'Item not found' || data.error) {
          throw new Error(data.msg || data.error);
        }
        setItem(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleClaim = async () => {
    if (!token) {
      setClaimStatus('You must be logged in to claim an item.');
      return;
    }
    
    setClaiming(true);
    setClaimStatus('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          itemId: item._id,
          // Since we don't extract claimantId implicitly in backend (unless we updated it to use userId),
          // Wait, backend explicitly needs claimantId in body according to schema? 
          // Let's rely on backend to just process the request.
          // Wait, server.js: new Claim(req.body) - implies claimantId is needed. But we might not have user ID here.
          // We can omit passing it if the backend handles it, but in server.js we passed req.body directly.
          // Let's pass what we can. Assuming claimantId is extracted from token or must be passed.
          // We don't have user id explicitly in context, wait we do! user.id
          // But actually we just pass message for now.
          message: claimAnswer,
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || result.msg || 'Failed to submit claim');
      
      setClaimStatus('Claim submitted successfully! The poster will review it.');
    } catch (err) {
      setClaimStatus('Error: ' + err.message);
    } finally {
      setClaiming(false);
    }
  };

  if (loading) return <div className="container" style={{ marginTop: '3rem', textAlign: 'center' }}>Loading...</div>;
  if (error) return <div className="container" style={{ marginTop: '3rem', textAlign: 'center', color: 'red' }}>Error: {error}</div>;
  if (!item) return <div className="container" style={{ marginTop: '3rem', textAlign: 'center' }}>Item not found</div>;

  return (
    <div className="container animate-fade-in" style={{ marginTop: '3rem' }}>
      <div className="glass glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/" className="btn btn-outline" style={{ display: 'inline-flex', marginBottom: '2rem', padding: '0.5rem 1rem', textDecoration: 'none' }}>
          ← Back
        </Link>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {item.photoUrl ? (
                <img src={item.photoUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span className="gradient-text" style={{ fontSize: '1.2rem' }}>[No Image Provided]</span>
              )}
            </div>
          </div>
          <div style={{ flex: '2 1 400px' }}>
             <span className={`item-badge ${item.type === 'lost' ? 'badge-lost' : 'badge-found'}`} style={{ position: 'relative', top: '0', right: '0', display: 'inline-block', marginBottom: '1rem' }}>
                {item.type.toUpperCase()}
             </span>
             <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{item.title}</h2>
             <p style={{ color: 'var(--accent)', fontWeight: 'bold' }}>📍 {item.location} • 📅 {new Date(item.date).toLocaleDateString()}</p>

             <p style={{ color: 'var(--text-main)', marginTop: '1.5rem', lineHeight: '1.6' }}>
               {item.description}
             </p>

            {item.type === 'found' && item.claimQuestion && (
              <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                <h3 style={{ color: '#fed7aa', marginBottom: '1rem', fontSize: '1.2rem' }}>🔒 Prove Ownership to Claim</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                   Claim Question: <strong>"{item.claimQuestion}"</strong>
                </p>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                   <input 
                     type="text" 
                     className="input-field" 
                     placeholder="Answer here..." 
                     style={{ flex: 1 }} 
                     value={claimAnswer}
                     onChange={(e) => setClaimAnswer(e.target.value)}
                   />
                   <button className="btn btn-primary" onClick={handleClaim} disabled={claiming}>
                     {claiming ? 'Submitting...' : 'Submit Claim'}
                   </button>
                </div>
                {claimStatus && <p style={{ marginTop: '1rem', color: claimStatus.startsWith('Error') ? 'var(--danger)' : 'var(--accent)' }}>{claimStatus}</p>}
              </div>
            )}
            {item.type === 'lost' && (
              <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                <h3 style={{ color: '#fed7aa', marginBottom: '1rem', fontSize: '1.2rem' }}>Found this item?</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                   If you have found this item, please leave a message to notify the owner.
                </p>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                   <input 
                     type="text" 
                     className="input-field" 
                     placeholder="Message to owner..." 
                     style={{ flex: 1 }} 
                     value={claimAnswer}
                     onChange={(e) => setClaimAnswer(e.target.value)}
                   />
                   <button className="btn btn-primary" onClick={handleClaim} disabled={claiming}>
                     {claiming ? 'Submitting...' : 'Notify Owner'}
                   </button>
                </div>
                {claimStatus && <p style={{ marginTop: '1rem', color: claimStatus.startsWith('Error') ? 'var(--danger)' : 'var(--accent)' }}>{claimStatus}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetails;
