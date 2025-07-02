import React from 'react';
import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
      <Link to="/explore" style={{ marginRight: '1rem' }}>Explore</Link>
      <Link to="/profiles">Profiles</Link>
    </nav>
  );
}