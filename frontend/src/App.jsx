import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Importing Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostLostItem from './pages/PostLostItem';
import PostFoundItem from './pages/PostFoundItem';
import ItemDetails from './pages/ItemDetails';
import MyClaims from './pages/MyClaims';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Floating accent orb */}
        <div className="orb-accent" aria-hidden="true" />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post-lost" element={<PostLostItem />} />
          <Route path="/post-found" element={<PostFoundItem />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/my-claims" element={<MyClaims />} />
        </Routes>

        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-inner">
            Made with <em className="heart">♥</em> by&nbsp;<a className="author" href="https://portfolionew-2-jxwm.vercel.app/" target="_blank" rel="noopener noreferrer">SURYANS</a>
          </div>
        </footer>
      </Router>
    </AuthProvider>
  );
}

export default App;
