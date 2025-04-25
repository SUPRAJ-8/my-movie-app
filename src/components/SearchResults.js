import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from './MovieCard';
import '../styles/SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get('q');

  useEffect(() => {
    const searchMovies = () => {
      setLoading(true);
      try {
        const allMovies = JSON.parse(localStorage.getItem('allMovies')) || [];
        const results = allMovies.filter(movie => 
          movie.title.toLowerCase().includes(query.toLowerCase()) ||
          movie.description.toLowerCase().includes(query.toLowerCase()) ||
          movie.genre.toLowerCase().includes(query.toLowerCase()) ||
          movie.director.toLowerCase().includes(query.toLowerCase()) ||
          movie.actors.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching movies:', error);
        setSearchResults([]);
      }
      setLoading(false);
    };

    if (query) {
      searchMovies();
    } else {
      setSearchResults([]);
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return <div className="loading">Searching...</div>;
  }

  if (!query) {
    return <div className="no-results">Please enter a search term</div>;
  }

  if (searchResults.length === 0) {
    return <div className="no-results">No movies found for "{query}"</div>;
  }

  return (
    <div className="search-results">
      <h2>Search Results for "{query}"</h2>
      <div className="movies-grid">
        {searchResults.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults; 