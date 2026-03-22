import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Importing Pages
import Home from './pages/Home';
import Login from './pages/Login';
import PostLostItem from './pages/PostLostItem';
import PostFoundItem from './pages/PostFoundItem';
import ItemDetails from './pages/ItemDetails';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/items')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          setItems(mockItems);
        }
      })
      .catch(() => setItems(mockItems))
      .finally(() => setLoading(false));
  }, []);

  const mockItems = [
    { title: "Lost Blue Water Bottle", category: "Accessories", date: "2023-11-01", type: "lost", location: "Library 2nd Floor" },
    { title: "Found Apple AirPods", category: "Electronics", date: "2023-11-02", type: "found", location: "Cafeteria" },
  ];

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home items={items} loading={loading} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post-lost" element={<PostLostItem />} />
        <Route path="/post-found" element={<PostFoundItem />} />
        <Route path="/item/:id" element={<ItemDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
