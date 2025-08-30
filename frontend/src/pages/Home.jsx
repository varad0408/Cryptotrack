import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <div className="hero" style={{textAlign: 'center', paddingTop: '4rem'}}>
        <h1>The Ultimate Crypto Portfolio Tracker</h1>
        <p style={{fontSize: '1.1rem', color: 'var(--muted)', maxWidth: '600px', margin: '1rem auto 2rem auto'}}>
          Real-time market data, seamless portfolio management, and insightful
          profit/loss analysis. All in one place.
        </p>
        <div style={{display: 'flex', justifyContent: 'center', gap: '1rem'}}>
          <Link to="/register" className="btn">Get Started for Free</Link>
          <Link to="/login" style={{color: 'var(--muted)', alignSelf: 'center'}}>I have an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;