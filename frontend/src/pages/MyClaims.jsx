import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../config';

function MyClaims() {
  const { token, user } = useContext(AuthContext);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/api/claims/my-items`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setClaims(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleAccept = async (claimId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/claims/${claimId}/accept`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || result.msg);
      
      // Update local state to show it was approved
      setClaims(claims.map(c => c._id === claimId ? { ...c, status: 'approved' } : c));
      alert('Claim Approved & Item Marked as Returned/Claimed!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (!user) return <div className="container animate-fade-in" style={{ marginTop: '3rem', textAlign: 'center' }}>Please login to view claims.</div>;

  return (
    <div className="container animate-fade-in" style={{ marginTop: '3rem' }}>
      <div className="glass glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem' }}>My Notifications & Claims</h2>
          <Link to="/" className="btn btn-outline" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>Go Back</Link>
        </div>

        {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}
        {loading ? (
          <p>Loading claims...</p>
        ) : claims.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Nobody has claimed your items or messaged you yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {claims.map(claim => (
              <div key={claim._id} style={{ border: '1px solid var(--glass-border)', padding: '1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.04)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary-light)' }}>
                  RE: {claim.itemId?.title} 
                  <span style={{ fontSize: '0.8rem', marginLeft: '1rem', color: claim.status === 'approved' ? 'var(--accent)' : 'var(--text-muted)' }}>
                    ({claim.status.toUpperCase()})
                  </span>
                </h3>
                
                <p style={{ marginBottom: '1rem' }}>
                  <strong>{claim.claimantId?.name}</strong> ({claim.claimantId?.email}) says:
                  <br/>
                  <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.75)' }}>"{claim.message}"</span>
                </p>

                {claim.status === 'pending' && claim.itemId?.status !== 'returned' && claim.itemId?.status !== 'claimed' && (
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => handleAccept(claim._id)}>
                    Accept Claim & Close Report
                  </button>
                )}
                {claim.status === 'approved' && (
                  <p style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✅ You approved this claim.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyClaims;
