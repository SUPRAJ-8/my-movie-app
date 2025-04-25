import React, { useState, useEffect } from "react";
import "../styles/MovieCard.css";
import { Link, useNavigate } from "react-router-dom";

import { getMovies } from '../api';

const MovieCard = ({ movie: initialMovie }) => {
  const [movie, setMovie] = useState(initialMovie);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showServerOptions, setShowServerOptions] = useState(false);
  const [selectedServer, setSelectedServer] = useState(null);
  const navigate = useNavigate();

  // Always fetch latest movie info from backend so edits are reflected
  useEffect(() => {
    async function fetchLatestMovie() {
      try {
        const allMovies = await getMovies();
        // Try matching by _id or id
        const updatedMovie = allMovies.find(
          m => (m._id && m._id.toString() === (initialMovie._id || initialMovie.id)?.toString()) || (m.id && m.id.toString() === (initialMovie._id || initialMovie.id)?.toString())
        );
        if (updatedMovie) {
          setMovie(updatedMovie);
        }
      } catch (error) {
        console.error("Error fetching updated movie:", error);
      }
    }
    fetchLatestMovie();
    // Optionally, poll for updates every 10 seconds
    const intervalId = setInterval(fetchLatestMovie, 10000);
    return () => clearInterval(intervalId);
  }, [initialMovie._id, initialMovie.id]);

  const handleWatchNow = (e) => {
    e.preventDefault();
    setShowServerOptions(true);
  };

  const handleServerSelect = async (serverType) => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedServer(serverType);

      let videoUrl = "";
      switch (serverType) {
        case "tailor":
          videoUrl = movie.tailorPlayer;
          break;
        case "fast":
          videoUrl = movie.fastPlayer;
          break;
        case "ultra":
          videoUrl = movie.ultraPlayer;
          break;
        default:
          throw new Error("Invalid server type");
      }

      if (!videoUrl) {
        throw new Error("Video URL not available for this server");
      }

      // Check if it's a direct video URL or needs to be opened in the video player
      if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
        // For YouTube videos, open in a new tab
        window.open(videoUrl, "_blank");
      } else {
        // For other videos, navigate to the video player page
        navigate(`/movie/${movie.id}`, {
          state: {
            videoUrl,
            movieTitle: movie.title,
            moviePoster: movie.posterUrl || movie.imageUrl,
          },
        });
      }

      // Increment view count
      const updatedViews = (parseInt(movie.views) || 0) + 1;
      const updatedMovie = { ...movie, views: updatedViews };

      // Update in allMovies storage
      const allMovies = JSON.parse(localStorage.getItem("allMovies") || "[]");
      const movieIndex = allMovies.findIndex((m) => m.id === movie.id);
      if (movieIndex !== -1) {
        allMovies[movieIndex] = updatedMovie;
        localStorage.setItem("allMovies", JSON.stringify(allMovies));
      }

      // Update in movies_all storage
      const moviesAll = JSON.parse(localStorage.getItem("movies_all") || "[]");
      const moviesAllIndex = moviesAll.findIndex((m) => m.id === movie.id);
      if (moviesAllIndex !== -1) {
        moviesAll[moviesAllIndex] = updatedMovie;
        localStorage.setItem("movies_all", JSON.stringify(moviesAll));
      }

      // Update in category storage
      const categoryMovies = JSON.parse(
        localStorage.getItem(`movies_${movie.category}`) || "[]"
      );
      const categoryIndex = categoryMovies.findIndex((m) => m.id === movie.id);
      if (categoryIndex !== -1) {
        categoryMovies[categoryIndex] = updatedMovie;
        localStorage.setItem(
          `movies_${movie.category}`,
          JSON.stringify(categoryMovies)
        );
      }

      // Update local state
      setMovie(updatedMovie);
    } catch (error) {
      console.error("Error playing video:", error);
      setError(error.message || "Failed to play video");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate the movie URL using the ID if available, otherwise use the title
  const movieUrl = movie.id
    ? `/movie/${movie.id.toString()}`
    : `/watch/${movie.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

  return (
    <div className="movie-card">
      <Link to={movieUrl} className="movie-link" state={{ movie }}>
        <div className="poster-container">
          <img
            src={movie.posterUrl || movie.imageUrl}
            alt={`${movie.title} Poster`}
            className="poster-image"
          />
          <div className="quality-badge">{movie.quality || "HD"}</div>
          <div className="poster-text">
            {movie.title}
            <br />
            {movie.releaseDate || movie.year} · {movie.language}
          </div>
          <div className="movie-info-hover">
            <h2 className="movie-title">
              {movie.title}
              <span>
                ({movie.releaseDate || movie.year}) {movie.language}
              </span>
            </h2>

            <div className="movie-description">
              <p>{movie.description || "No description available"}</p>
            </div>

            <div className="movie-meta">
              <div className="meta-item">
                <span className="meta-label">Views:</span>
                <span className="views-badge">{movie.views || "0"}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">IMDb:</span>
                <span className="imdb-badge">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  {movie.imdb || movie.rating || "N/A"}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Duration:</span>
                <span className="meta-value">{movie.duration || "N/A"}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Quality:</span>
                <span className="meta-value">{movie.quality || "HD"}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Genre:</span>
                <span className="meta-value">
                  {Array.isArray(movie.genres)
                    ? movie.genres.join(", ")
                    : movie.genre || "N/A"}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Release:</span>
                <span className="meta-value">
                  {movie.releaseDate || movie.release || "N/A"}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Director:</span>
                <span className="meta-value">{movie.director || "N/A"}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Country:</span>
                <span className="meta-value">{movie.country || "N/A"}</span>
              </div>
            </div>

            <div className="movie-actions">
              <button
                className="watch-button"
                onClick={handleWatchNow}
                disabled={isLoading}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {isLoading ? "Loading..." : "Watch Now"}
              </button>
              <button className="favorite-button">
                <svg viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                Favorite
              </button>
            </div>
          </div>
        </div>
      </Link>

      {showServerOptions && (
        <div className="server-options-modal">
          <div className="server-options-content">
            <h3>Select Video Server</h3>
            <div className="server-buttons">
              {movie.tailorPlayer && (
                <button
                  className="server-button tailor"
                  onClick={() => handleServerSelect("tailor")}
                  disabled={isLoading}
                >
                  Watch Trailer
                </button>
              )}
              {movie.fastPlayer && (
                <button
                  className="server-button fast"
                  onClick={() => handleServerSelect("fast")}
                  disabled={isLoading}
                >
                  Fast Player
                </button>
              )}
              {movie.ultraPlayer && (
                <button
                  className="server-button ultra"
                  onClick={() => handleServerSelect("ultra")}
                  disabled={isLoading}
                >
                  Ultra Player
                </button>
              )}
              <button
                className="server-button default"
                onClick={() => handleServerSelect("default")}
                disabled={isLoading}
              >
                Default Player
              </button>
            </div>
            <button
              className="close-button"
              onClick={() => setShowServerOptions(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="movie-error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
