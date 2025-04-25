import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

// Import movie data for search
import { bollywoodMovies, hollywoodMovies, southMovies } from './MovieGrid';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Combine all movies for search
  const allMovies = [...bollywoodMovies, ...hollywoodMovies, ...southMovies];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = allMovies.filter(movie => {
        const searchTerm = searchQuery.toLowerCase().trim();
        return (
          movie.title.toLowerCase().includes(searchTerm) ||
          (movie.genre && movie.genre.toLowerCase().includes(searchTerm)) ||
          (movie.director && movie.director.toLowerCase().includes(searchTerm)) ||
          (movie.actors && typeof movie.actors === 'string' && movie.actors.toLowerCase().includes(searchTerm))
        );
      }).slice(0, 5); // Show only top 5 results in dropdown
      
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };

  const handleMovieClick = (movie) => {
    // Create URL-friendly title
    const urlTitle = movie.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    
    navigate(`/watch/${urlTitle}`);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Hamburger Icon for mobile (moved left) */}
        <button
          className={`navbar-hamburger${menuOpen ? ' active' : ''}`}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <Link to="/" className="logo">
          <img src="/logo.png" alt="MovieApp" />
          MOVI.PK
        </Link>
      </div>
      
      <div className={`navbar-center${menuOpen ? ' mobile-open' : ''}`}>
        <Link to="/bollywood-movies" className="navbar-category-link">BOLLYWOOD MOVIES</Link>
        <Link to="/hollywood-hindi" className="navbar-category-link">HOLLYWOOD HINDI</Link>
        <Link to="/south-hindi" className="navbar-category-link">SOUTH HINDI</Link>
        <Link to="/web-series" className="navbar-category-link">WEB SERIES</Link>
        <Link to="/all-movies" className="navbar-category-link">ALL MOVIES</Link>
        <Link to="/genre" className="navbar-genre-link">GENRE</Link>
      </div>

      <div className="navbar-right">
        <div className="search-container" ref={searchRef}>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <i className="fas fa-search"></i>
            </button>
          </form>
          
          {showResults && searchResults.length > 0 && (
            <div className="search-results-dropdown">
              {searchResults.map((movie) => (
                <div
                  key={movie.id}
                  className="search-result-item"
                  onClick={() => handleMovieClick(movie)}
                >
                  <div className="result-poster">
                    <img 
                      src={process.env.PUBLIC_URL + movie.posterUrl} 
                      alt={movie.title}
                      onError={(e) => {
                        console.log('Image failed to load:', e.target.src);
                        e.target.onerror = null;
                        e.target.src = '/logo512.png';
                      }}
                    />
                  </div>
                  <div className="result-info">
                    <h4>{movie.title}</h4>
                    <div className="result-meta">
                      <span className="year">{movie.year}</span>
                      <span className="dot">•</span>
                      <span className="quality">{movie.quality}</span>
                      <span className="dot">•</span>
                      <span className="duration">{movie.duration}</span>
                    </div>
                    <p className="genre">{movie.genre}</p>
                  </div>
                </div>
              ))}
              <button className="view-all-results" onClick={handleViewAllResults}>
                View all results <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 