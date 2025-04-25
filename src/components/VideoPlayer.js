import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/VideoPlayer.css";
import { getMovies } from '../api';

function VideoPlayer() {
  const { id, title } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState("Hindi");
  const [movieData, setMovieData] = useState(location.state?.movie || null);
  const [error, setError] = useState(null);
  const [videoSource, setVideoSource] = useState(null);
  const [isFastPlayer, setIsFastPlayer] = useState(false);
  const [videoType, setVideoType] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [directUrl, setDirectUrl] = useState(null);
  const [showFallback, setShowFallback] = useState(false);
  const [selectedServer, setSelectedServer] = useState("default");

  useEffect(() => {
    // If movie is passed in navigation state, use it directly
    if (location.state?.movie) {
      setMovieData(location.state.movie);
      setError(null);
      // If video URL is passed from MovieCard, use it directly
      if (location.state?.videoUrl) {
        const {
          type,
          id: vidId,
          directUrl: dirUrl,
        } = processVideoUrl(location.state.videoUrl);
        setVideoType(type);
        setVideoId(vidId);
        setDirectUrl(dirUrl);
        setVideoSource(getEmbedUrl(type, vidId));
        setIsFastPlayer(location.state.videoUrl.includes("ok.ru"));
      } else {
        // Otherwise, try to automatically select a video source
        const movie = location.state.movie;
        if (movie.tailorPlayer) {
          handleServerChange("tailor");
        } else if (movie.fastPlayer) {
          handleServerChange("fast");
        } else if (movie.ultraPlayer) {
          handleServerChange("ultra");
        }
      }
      return;
    }
    // Otherwise, fetch from backend
    async function fetchMovie() {
      try {
        const allMovies = await getMovies();
        let movie = null;
        if (id) {
          movie = allMovies.find(
            (m) => (m._id && m._id.toString() === id.toString()) || (m.id && m.id.toString() === id.toString())
          );
        } else if (title) {
          const movieKey = title.toLowerCase().replace(/[^a-z0-9]/g, "");
          movie = allMovies.find((m) => {
            if (!m.title) return false;
            const cleanTitle = m.title.toLowerCase().replace(/[^a-z0-9]/g, "");
            return cleanTitle === movieKey;
          });
        }
        if (movie) {
          setMovieData(movie);
          setError(null);
          // If video URL is passed from MovieCard, use it directly
          if (location.state?.videoUrl) {
            const {
              type,
              id: vidId,
              directUrl: dirUrl,
            } = processVideoUrl(location.state.videoUrl);
            setVideoType(type);
            setVideoId(vidId);
            setDirectUrl(dirUrl);
            setVideoSource(getEmbedUrl(type, vidId));
            setIsFastPlayer(location.state.videoUrl.includes("ok.ru"));
          } else {
            // Otherwise, try to automatically select a video source
            if (movie.tailorPlayer) {
              handleServerChange("tailor");
            } else if (movie.fastPlayer) {
              handleServerChange("fast");
            } else if (movie.ultraPlayer) {
              handleServerChange("ultra");
            }
          }
        } else {
          setError("Movie not found");
          navigate("/");
        }
      } catch (err) {
        setError("An error occurred while loading the movie");
        console.error(err);
      }
    }
    fetchMovie();
  }, [id, title, navigate, location.state]);

  // Add this function to increment views
  const incrementMovieViews = (movieId) => {
    try {
      // Get all category lists
      const categories = [
        "bollywoodMovies",
        "hollywoodMovies",
        "southMovies",
        "webSeriesMovies",
        "allMovies",
      ];

      categories.forEach((category) => {
        const movies = JSON.parse(localStorage.getItem(category)) || [];
        const updatedMovies = movies.map((movie) => {
          if (movie.id === movieId) {
            // Convert views to number, increment, and convert back to string
            const currentViews = parseInt(movie.views || "0");
            return { ...movie, views: (currentViews + 1).toString() };
          }
          return movie;
        });
        localStorage.setItem(category, JSON.stringify(updatedMovies));
      });
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  // Add this to your useEffect where you load the movie data
  useEffect(() => {
    if (movieData?.id) {
      incrementMovieViews(movieData.id);
    }
  }, [movieData?.id]);

  // Universal function to process any video URL
  const processVideoUrl = (url) => {
    if (!url) return { type: null, id: null, directUrl: null };

    try {
      // YouTube
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        let videoId = "";
        if (url.includes("youtu.be")) {
          videoId = url.split("youtu.be/")[1].split("?")[0];
        } else if (url.includes("watch?v=")) {
          videoId = url.split("watch?v=")[1].split("&")[0];
        } else if (url.includes("embed/")) {
          videoId = url.split("embed/")[1].split("?")[0];
        }
        return {
          type: "youtube",
          id: videoId,
          directUrl: `https://www.youtube.com/watch?v=${videoId}`,
        };
      }

      // ok.ru
      if (url.includes("ok.ru")) {
        let videoId = "";
        if (url.includes("video/")) {
          videoId = url.split("video/")[1].split("?")[0];
        } else if (url.includes("videoembed/")) {
          videoId = url.split("videoembed/")[1].split("?")[0];
        }
        return {
          type: "okru",
          id: videoId,
          directUrl: `https://ok.ru/video/${videoId}`,
        };
      }

      // Vimeo
      if (url.includes("vimeo.com")) {
        let videoId = "";
        if (url.includes("vimeo.com/")) {
          videoId = url.split("vimeo.com/")[1].split("?")[0];
        }
        return {
          type: "vimeo",
          id: videoId,
          directUrl: `https://vimeo.com/${videoId}`,
        };
      }

      // Direct video files
      if (url.match(/\.(mp4|webm|m3u8)$/i)) {
        return {
          type: "direct",
          id: null,
          directUrl: url,
        };
      }

      // Default case - assume it's a direct URL
      return {
        type: "direct",
        id: null,
        directUrl: url,
      };
    } catch (error) {
      console.error("Error processing video URL:", error);
      return { type: null, id: null, directUrl: url };
    }
  };

  // Function to get embed URL based on video type and ID
  const getEmbedUrl = (type, id) => {
    switch (type) {
      case "youtube":
        return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
      case "okru":
        return `https://ok.ru/videoembed/${id}?autoplay=1`;
      case "vimeo":
        return `https://player.vimeo.com/video/${id}?autoplay=1`;
      case "direct":
        return id;
      default:
        return null;
    }
  };

  const handleServerChange = (serverType) => {
    if (!movieData) return;

    try {
      let url = "";
      let isFast = false;

      // Get the appropriate URL based on source
      switch (serverType) {
        case "tailor":
          url = movieData.tailorPlayer;
          isFast = false;
          break;
        case "fast":
          url = movieData.fastPlayer;
          isFast = true;
          break;
        case "ultra":
          url = movieData.ultraPlayer;
          isFast = false;
          break;
        default:
          throw new Error("Invalid source selected");
      }

      if (!url) {
        throw new Error(`${serverType} player not available`);
      }

      // Process the URL
      const { type, id, directUrl } = processVideoUrl(url);

      // Set state variables
      setVideoType(type);
      setVideoId(id);
      setDirectUrl(directUrl);
      setVideoSource(getEmbedUrl(type, id));
      setIsFastPlayer(isFast);
      setShowFallback(false);

      // Set a timeout to show fallback if embedding fails
      setTimeout(() => {
        setShowFallback(true);
      }, 5000);
    } catch (error) {
      console.error("Error changing video source:", error);
      alert(
        error.message ||
          "Error loading video source. Please try another source."
      );
    }
  };

  const getImageFileName = (movieTitle) => {
    if (!movieTitle) return "/logo512.png";

    // Remove year and special characters, convert to lowercase
    const cleanTitle = movieTitle
      .toLowerCase()
      .replace(/[-\s]?\([^)]*\)/g, "") // Remove anything in parentheses
      .replace(/[^a-z0-9]/g, ""); // Remove special characters

    // Define movie categories
    const hollywoodMovies = [
      "oppenheimer",
      "barbie",
      "guardians3",
      "fastx",
      "mickey17",
      "mikey17",
      "johnwick4",
      "marvels",
    ];

    // Determine the directory based on the movie
    const directory = hollywoodMovies.includes(cleanTitle)
      ? "hollywood"
      : "bollywood";

    // Map of clean titles to actual filenames with special handling for certain titles
    const fileNameMap = {
      // Hindi Movies
      jawan: "/bollywood/jawan.jpg",
      animal: "/bollywood/animal.jpg",
      tiger3: "/bollywood/tiger3.jpg",
      dunki: "/bollywood/dunki.jpg",
      "12thfail": "/bollywood/12thfail.jpg",
      sambahadur: "/bollywood/sambahadur.jpg",
      // Hollywood Movies
      oppenheimer: "/hollywood/oppenheimer.jpg",
      barbie: "/hollywood/barbie.jpg",
      guardians3: "/hollywood/guardians3.jpg",
      fastx: "/hollywood/fastx.jpg",
      // Mickey 17 specific handling
      mickey17: "/hollywood/mikey17.jpg",
      mikey17: "/hollywood/mikey17.jpg",
    };

    // Special handling for variations
    if (cleanTitle.includes("mickey") || cleanTitle.includes("mikey")) {
      return "/hollywood/mikey17.jpg";
    }

    return fileNameMap[cleanTitle] || `/${directory}/${cleanTitle}.jpg`;
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>{error}</h2>
        <button onClick={() => navigate("/")}>Return to Home</button>
      </div>
    );
  }

  if (!movieData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="video-player-page">
      <div className="breadcrumb">
        <span>Home</span> / <span>Movies</span> / <span>{movieData.title}</span>
      </div>

      <div className="video-container">
        <div className="video-wrapper">
          <div className="language-selector">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="language-dropdown"
            >
              <option value="Hindi">Hindi</option>
            </select>
          </div>

          {videoSource && (
            <div className="video-player-container">
              <iframe
                src={videoSource}
                className="main-video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="origin"
                style={{ width: "100%", height: "100%", border: "none" }}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
              ></iframe>
            </div>
          )}
        </div>

        <div className="video-sources">
          <div className="sources-header">
            <h3>Video Sources</h3>
            <div className="source-stats">
              <button className="report-btn">Report Error</button>
              <span className="views-count">{movieData.views} Views</span>
            </div>
          </div>

          <div className="source-buttons">
            {movieData.tailorPlayer && (
              <button
                className="source-btn trailer"
                onClick={() => handleServerChange("tailor")}
              >
                <span className="play-icon">▶</span>
                Watch Trailer
                <span className="source-platform">
                  <img
                    src="/youtube-icon.png"
                    alt="YouTube"
                    className="platform-icon"
                  />
                </span>
              </button>
            )}

            {movieData.ultraPlayer && (
              <button
                className="source-btn stream"
                onClick={() => handleServerChange("ultra")}
              >
                <span className="play-icon">▶</span>
                Ultra Stream
              </button>
            )}

            {movieData.fastPlayer && (
              <button
                className="source-btn stream"
                onClick={() => handleServerChange("fast")}
              >
                <span className="play-icon">▶</span>
                Fast Player
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="movie-details">
        <div className="movie-content">
          <div className="movie-poster">
            <img
              src={movieData?.posterUrl || getImageFileName(movieData?.title)}
              alt={movieData?.title}
              className="poster-image"
              onError={(e) => {
                console.log("Image failed to load:", e.target.src);
                e.target.onerror = null;
                e.target.src = "/logo512.png";
              }}
            />
          </div>
          <div className="movie-info">
            <div className="movie-header">
              <div className="movie-title-rating">
                <h1>{movieData.title}</h1>
                <div className="rating">
                  <span className="rating-score">{movieData.rating}</span>
                  <span className="rating-stars">
                    ★★★★★ ({movieData.votes} votes)
                  </span>
                </div>
              </div>
              <p className="movie-description">{movieData.description}</p>
            </div>

            <div className="movie-meta">
              <div className="meta-group">
                <span>
                  <span className="meta-label">Views:</span> {movieData.views}
                </span>
                <span>
                  <span className="meta-label">Genre:</span> {Array.isArray(movieData.genres) ? movieData.genres.join(", ") : movieData.genre}
                </span>
                <span>
                  <span className="meta-label">Duration:</span> {movieData.duration}
                </span>
                <span>
                  <span className="meta-label">Quality:</span> <span className="quality-badge">{movieData.quality}</span>
                </span>
                <span>
                  <span className="meta-label">Release:</span> {movieData.releaseDate || movieData.release}
                </span>
                <span>
                  <span className="meta-label">IMDb:</span>{" "}
                  <span className="imdb-badge">{movieData.imdb}</span>
                </span>
                <span>
                  <span className="meta-label">Box Office:</span>{" "}
                  {movieData.boxOffice}
                </span>
                <span>
                  <span className="meta-label">Awards:</span> {movieData.awards}
                </span>
              </div>
              <div className="categories">
                {movieData.genres &&
                  movieData.genres.map((genre, index) => (
                    <a key={index} href={`#${genre.toLowerCase()}`}>
                      {genre}
                    </a>
                  ))}
              </div>
              <div className="credits">
                <p>
                  <span className="meta-label">Director:</span>{" "}
                  <span className="credit-value">{movieData.director}</span>
                </p>
                <p>
                  <span className="meta-label">Actors:</span>{" "}
                  <span className="credit-value">
                    {typeof movieData.actors === "string"
                      ? movieData.actors
                      : movieData.actors?.join(", ")}
                  </span>
                </p>
                <p>
                  <span className="meta-label">Country:</span>{" "}
                  <span className="credit-value">{movieData.country}</span>
                </p>
                <p>
                  <span className="meta-label">Language:</span>{" "}
                  <span className="credit-value">{movieData.language}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
