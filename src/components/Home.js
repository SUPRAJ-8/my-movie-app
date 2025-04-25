import React from 'react';
import MovieGrid from './MovieGrid';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home">
      <section className="featured-section">
        <MovieGrid />
      </section>
      
      <section className="category-section">
        <MovieGrid category="bollywood" />
      </section>
      
      <section className="category-section">
        <MovieGrid category="hollywood" />
      </section>
      
      <section className="category-section">
        <MovieGrid category="south" />
      </section>
    </div>
  );
}

export default Home; 