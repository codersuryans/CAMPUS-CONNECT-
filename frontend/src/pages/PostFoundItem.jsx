import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from '../config';

function PostFoundItem() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    location: '',
    date: '',
    claimQuestion: '',
    description: 'Found item. Please answer the claim question to verify.'
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!token) {
      setError('You must be logged in to post an item.');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('type', 'found');
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('date', formData.date);
      data.append('claimQuestion', formData.claimQuestion);
      if (file) {
        data.append('image', file);
      }

      const res = await fetch(`${API_BASE_URL}/api/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || result.msg || 'Failed to post item');
      
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

        {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Item Title</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Found Apple Airpods" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Category</label>
            <select 
              className="input-field" 
              style={{ appearance: 'none' }}
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Books / Stationery">Books / Stationery</option>
              <option value="ID Cards">ID Cards</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Description & Details</label>
            <textarea 
              className="input-field" 
              rows="3" 
              placeholder="Describe what you found..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Location Found</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Cafeteria Table 4" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required 
              />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Date Found</label>
              <input 
                type="date" 
                className="input-field" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Upload Photo (Highly Recommended)</label>
            <input 
              type="file" 
              className="input-field" 
              accept="image/*" 
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          {/* Verification Question Field */}
          <div className="input-group" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
            <label className="input-label" style={{ color: '#fed7aa', fontWeight: 600 }}>Security Claim Question</label>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
               Set a question to verify ownership before someone claims it. (e.g. "What is the wallpaper lock screen?" or "Is there a specific scratch?")
            </p>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter claim verification question..." 
              value={formData.claimQuestion}
              onChange={(e) => setFormData({...formData, claimQuestion: e.target.value})}
              required={true}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostFoundItem;
