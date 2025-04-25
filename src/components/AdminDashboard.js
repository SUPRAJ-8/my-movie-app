import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMovies, addMovie, updateMovie, deleteMovie } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("movies");
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalViews: 0,
    averageRating: 0,
  });
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [bulkAddMode, setBulkAddMode] = useState(false);
  const [bulkAddText, setBulkAddText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    rating: "",
    posterUrl: "",
    category: "",
    description: "",
    releaseDate: "",
    duration: "",
    language: "",
    quality: "",
    tailorPlayer: "",
    fastPlayer: "",
    ultraPlayer: "",
    imdb: "",
    director: "",
    actors: "",
    genres: "",
    country: "",
  });
  const [addFormData, setAddFormData] = useState({
    title: "",
    rating: "",
    posterUrl: "",
    category: "",
    description: "",
    releaseDate: "",
    duration: "",
    language: "",
    quality: "",
    tailorPlayer: "",
    fastPlayer: "",
    ultraPlayer: "",
    imdb: "",
    director: "",
    actors: "",
    genres: "",
    country: "",
  });

  const formatViewCount = (count) => {
    // Ensure count is a valid number
    if (typeof count !== "number" || isNaN(count)) return "0";

    if (count < 1000) return count.toString();
    if (count < 1000000)
      return `${(count / 1000).toFixed(1)}K`.replace(".0K", "K");
    return `${(count / 1000000).toFixed(1)}M`.replace(".0M", "M");
  };

  const recoverMovieData = () => {
    try {
      // Bollywood Movies
      const bollywoodMovies = [
        {
          id: "b1",
          title: "12th Fail",
          posterUrl: "/bollywood/12thfail.jpg",
          category: "Bollywood Movies",
          rating: "8.5",
          views: 0,
          releaseDate: "2023",
          quality: "HD",
          language: "Hindi",
        },
        {
          id: "b2",
          title: "Animal",
          posterUrl: "/bollywood/animal.jpg",
          category: "Bollywood Movies",
          rating: "8.0",
          views: 0,
          releaseDate: "2023",
          quality: "HD",
          language: "Hindi",
        },
        {
          id: "b3",
          title: "Article 370",
          posterUrl: "/bollywood/article370.jpg",
          category: "Bollywood Movies",
          rating: "7.5",
          views: 0,
          releaseDate: "2024",
          quality: "HD",
          language: "Hindi",
        },
        {
          id: "b4",
          title: "Dunki",
          posterUrl: "/bollywood/dunki.jpg",
          category: "Bollywood Movies",
          rating: "7.8",
          views: 0,
          releaseDate: "2023",
          quality: "HD",
          language: "Hindi",
        },
        {
          id: "b5",
          title: "Fighter",
          posterUrl: "/bollywood/fighter.jpg",
          category: "Bollywood Movies",
          rating: "7.9",
          views: 0,
          releaseDate: "2024",
          quality: "HD",
          language: "Hindi",
        },
        {
          id: "b6",
          title: "Jaat",
          posterUrl: "/bollywood/jaat.png",
          category: "Bollywood Movies",
          rating: "7.0",
          views: 0,
          releaseDate: "2024",
          quality: "HD",
          language: "Hindi",
        },
        {
          id: "b7",
          title: "Jawan",
          posterUrl: "/bollywood/jawan.jpg",
          category: "Bollywood Movies",
          rating: "8.2",
          views: 0,
          releaseDate: "2023",
          quality: "HD",
          language: "Hindi",
        },
        {
          id: "b8",
          title: "Kesari Chapter 2",
          posterUrl: "/bollywood/kesarichapter2.jpg",
          category: "Bollywood Movies",
          rating: "7.7",
          views: 0,
          releaseDate: "2024",
          quality: "HD",
          language: "Hindi",
        },
        {
          id: "b9",
          title: "Sam Bahadur",
          posterUrl: "/bollywood/sambahadur.jpg",
          category: "Bollywood Movies",
          rating: "8.1",
          views: 0,
          releaseDate: "2023",
          quality: "HD",
          language: "Hindi",
        },
        {
          id: "b10",
          title: "Tiger 3",
          posterUrl: "/bollywood/tiger3.jpg",
          category: "Bollywood Movies",
          rating: "7.6",
          views: 0,
          releaseDate: "2023",
          quality: "HD",
          language: "Hindi",
        },
      ];

      // Store the recovered movies
      localStorage.setItem("bollywoodMovies", JSON.stringify(bollywoodMovies));
      localStorage.setItem("movies_bollywood", JSON.stringify(bollywoodMovies));

      // Hollywood Movies
      const hollywoodMovies = [
        {
          id: "h1",
          title: "Aquaman 2",
          posterUrl: "/hollywood/aquaman2.jpg",
          category: "Hollywood Movies",
          rating: "8.0",
          views: 0,
          releaseDate: "2023",
          quality: "HD",
          language: "English",
        },
        {
          id: "h2",
          title: "Argylle",
          posterUrl: "/hollywood/argylle.jpg",
          category: "Hollywood Movies",
          rating: "7.5",
          views: 0,
          releaseDate: "2024",
          quality: "HD",
          language: "English",
        },
        {
          id: "h3",
          title: "Madame Web",
          posterUrl: "/hollywood/madameweb.jpg",
          category: "Hollywood Movies",
          rating: "7.8",
          views: 0,
          releaseDate: "2024",
          quality: "HD",
          language: "English",
        },
        {
          id: "h4",
          title: "Migration",
          posterUrl: "/hollywood/migration.jpg",
          category: "Hollywood Movies",
          rating: "7.9",
          views: 0,
          releaseDate: "2024",
          quality: "HD",
          language: "English",
        },
        {
          id: "h5",
          title: "Napoleon",
          posterUrl: "/hollywood/napoleon.jpg",
          category: "Hollywood Movies",
          rating: "8.2",
          views: 0,
          releaseDate: "2023",
          quality: "HD",
          language: "English",
        },
        {
          id: "h6",
          title: "Wonka",
          posterUrl: "/hollywood/wonka.jpg",
          category: "Hollywood Movies",
          rating: "8.1",
          views: 0,
          releaseDate: "2023",
          quality: "HD",
          language: "English",
        },
      ];

      localStorage.setItem("hollywoodMovies", JSON.stringify(hollywoodMovies));
      localStorage.setItem("movies_hollywood", JSON.stringify(hollywoodMovies));

      // South Movies
      const southMovies = [
        {
          id: "s1",
          title: "Captain Miller",
          posterUrl: "/south/captainmiller.jpg",
          category: "South Movies",
          rating: "7.8",
          views: 0,
          releaseDate: "2024",
          quality: "HD",
          language: "Tamil",
        },
        {
          id: "s2",
          title: "Guntur Kaaram",
          posterUrl: "/south/gunturkaaram.jpg",
          category: "South Movies",
          rating: "7.5",
          views: 0,
          releaseDate: "2024",
          quality: "HD",
          language: "Telugu",
        },
        {
          id: "s3",
          title: "Hanuman",
          posterUrl: "/south/hanuman.jpg",
          category: "South Movies",
          rating: "8.2",
          views: 0,
          releaseDate: "2024",
          quality: "HD",
          language: "Telugu",
        },
        {
          id: "s4",
          title: "Hi Nanna",
          posterUrl: "/south/hinanna.jpg",
          category: "South Movies",
          rating: "8.0",
          views: 0,
          releaseDate: "2023",
          quality: "HD",
          language: "Telugu",
        },
        {
          id: "s5",
          title: "Salaar",
          posterUrl: "/south/salaar.jpg",
          category: "South Movies",
          rating: "8.5",
          views: 0,
          releaseDate: "2023",
          quality: "HD",
          language: "Telugu",
        },
      ];

      // Web Series
      const webSeries = [
        {
          id: "w1",
          title: "Indian Police Force",
          posterUrl: "/webseries/indianpoliceforce.jpg",
          category: "Web Series",
          rating: "8.0",
          views: 0,
          releaseDate: "2024",
          quality: "HD",
          language: "Hindi",
        },
        {
          id: "w2",
          title: "Killer Soup",
          posterUrl: "/webseries/killersoup.jpg",
          category: "Web Series",
          rating: "7.8",
          views: 0,
          releaseDate: "2024",
          quality: "HD",
          language: "Hindi",
        },
      ];

      localStorage.setItem("southMovies", JSON.stringify(southMovies));
      localStorage.setItem("movies_south", JSON.stringify(southMovies));
      localStorage.setItem("webSeriesMovies", JSON.stringify(webSeries));
      localStorage.setItem("movies_web-series", JSON.stringify(webSeries));

      // Update all movies collection
      const allMovies = [
        ...bollywoodMovies,
        ...hollywoodMovies,
        ...southMovies,
        ...webSeries,
      ];
      localStorage.setItem("allMovies", JSON.stringify(allMovies));
      localStorage.setItem("movies_all", JSON.stringify(allMovies));

      // Reload the movies
      fetchMovies();
      toast.success("Movie data has been recovered successfully!");
    } catch (error) {
      console.error("Error recovering movie data:", error);
      toast.error("Failed to recover movie data");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const movies = await getMovies();
      console.log("fetchMovies - API returned:", movies);
      setMovies(movies);
      calculateStats(movies);
    } catch (error) {
      toast.error("Failed to fetch movies");
      setMovies([]);
    }
  };

  const calculateStats = (movieList) => {
    const totalMovies = movieList.length;
    const totalViews = movieList.reduce((sum, m) => sum + (parseInt(m.views) || 0), 0);
    const averageRating = totalMovies
      ? (movieList.reduce((sum, m) => sum + (parseFloat(m.rating) || 0), 0) / totalMovies).toFixed(1)
      : 0;
    setStats({ totalMovies, totalViews, averageRating });
  };

  const getMovieCategory = (movie) => {
    const cat = movie.category?.toLowerCase() || "";
    if (cat.includes("bollywood")) return "bollywood";
    if (cat.includes("hollywood")) return "hollywood";
    if (cat.includes("south")) return "south";
    if (cat.includes("web series")) return "webseries";
    return "unknown";
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter
      ? getMovieCategory(movie) === categoryFilter
      : true;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteClick = (movieId) => {
    const movie = movies.find((movie) => movie._id === movieId);
    if (movie) {
      setMovieToDelete(movie);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (movieToDelete) {
      try {
        const token = localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
        await deleteMovie(movieToDelete._id, token);
        toast.success(`"${movieToDelete.title}" has been deleted successfully`);
        fetchMovies();
      } catch (error) {
        console.error("Error deleting movie:", error);
        toast.error("Failed to delete movie");
      }
    }
    setIsDeleteModalOpen(false);
    setMovieToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setMovieToDelete(null);
  };

  const handleEditMovie = (movieId) => {
    // Find by _id only (backend ID)
    const movie = movies.find((movie) => movie._id === movieId);
    if (movie) {
      setEditingMovie(movie);
      setEditFormData({
        title: movie.title || "",
        rating: movie.rating || "",
        posterUrl: movie.posterUrl || movie.imageUrl || "",
        category: movie.category || "",
        description: movie.description || "",
        releaseDate: movie.releaseDate || "",
        duration: movie.duration || "",
        language: movie.language || "",
        quality: movie.quality || "",
        tailorPlayer: movie.tailorPlayer || "",
        fastPlayer: movie.fastPlayer || "",
        ultraPlayer: movie.ultraPlayer || "",
        imdb: movie.imdb || "",
        director: movie.director || "",
        actors: Array.isArray(movie.actors)
          ? movie.actors.join(", ")
          : movie.actors || "",
        genres: Array.isArray(movie.genres)
          ? movie.genres.join(", ")
          : movie.genres || "",
        country: movie.country || "",
      });
      setIsEditModalOpen(true);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
      if (!editingMovie || !editingMovie._id) {
        toast.error("Movie ID missing. Cannot update.");
        return;
      }
      const updatedMovie = {
        ...editFormData,
        actors: editFormData.actors.split(",").map((actor) => actor.trim()),
        genres: editFormData.genres.split(",").map((genre) => genre.trim()),
        views: editingMovie.views || 0,
        tailorPlayer: editFormData.tailorPlayer.trim() || "",
        fastPlayer: editFormData.fastPlayer.trim() || "",
        ultraPlayer: editFormData.ultraPlayer.trim() || "",
      };
      await updateMovie(editingMovie._id, updatedMovie, token);
      toast.success("Movie updated successfully!");
      setIsEditModalOpen(false);
      setEditingMovie(null);
      setEditFormData({
        title: "",
        rating: "",
        posterUrl: "",
        category: "",
        description: "",
        releaseDate: "",
        duration: "",
        language: "",
        quality: "",
        tailorPlayer: "",
        fastPlayer: "",
        ultraPlayer: "",
        imdb: "",
        director: "",
        actors: "",
        genres: "",
        country: "",
      });
      fetchMovies();
    } catch (error) {
      console.error("Error updating movie:", error);
      toast.error("Error updating movie. Please try again.");
    }
  };

  const handleLogout = () => {
    toast.info("Logging out...", {
      position: "top-right",
      autoClose: 1500,
    });
    localStorage.removeItem("rememberedCredentials");
    setTimeout(() => {
      navigate("/admin-login");
    }, 1500);
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBulkAddSubmit = async () => {
    try {
      const lines = bulkAddText.split('\n').map(l => l.trim()).filter(Boolean);
      const fieldNames = [
        'title','rating','posterUrl','category','description','releaseDate','duration','language','quality','imdb','director','actors','genres','country','tailorPlayer','fastPlayer','ultraPlayer'
      ];
      let addedCount = 0;
      let addedMovies = [];
      for (const line of lines) {
        const parts = line.split(',').map(p => p.trim());
        if (parts.length < 4) { // Require at least title, rating, posterUrl, category
          toast.error(`Invalid line (not enough fields): ${line}`);
          continue;
        }
        const movie = {};
        for (let i = 0; i < fieldNames.length; i++) {
          movie[fieldNames[i]] = parts[i] || '';
        }
        if (!movie.title || !movie.posterUrl || !movie.category) {
          toast.error(`Missing required fields in: ${line}`);
          continue;
        }
        const newId = Date.now() + Math.floor(Math.random() * 1000) + addedCount;
        const newMovie = {
          id: newId,
          ...movie,
          views: 0,
          addedDate: new Date().toISOString().split("T")[0],
          actors: movie.actors ? movie.actors.split('|').map(a => a.trim()) : [],
          genres: movie.genres ? movie.genres.split('|').map(g => g.trim()) : [],
        };
        // Save to localStorage
        const categoryKey = newMovie.category.toLowerCase().replace(" ", "-");
        const storageKey = categoryKey === "web-series" ? "webSeriesMovies" : `${categoryKey}Movies`;
        const gridKey = categoryKey === "web-series" ? "movies_web-series" : `movies_${categoryKey}`;
        const categoryMovies = JSON.parse(localStorage.getItem(storageKey) || "[]");
        categoryMovies.push(newMovie);
        localStorage.setItem(storageKey, JSON.stringify(categoryMovies));
        const gridMovies = JSON.parse(localStorage.getItem(gridKey) || "[]");
        gridMovies.push(newMovie);
        localStorage.setItem(gridKey, JSON.stringify(gridMovies));
        const allMovies = JSON.parse(localStorage.getItem("allMovies") || "[]");
        allMovies.push(newMovie);
        localStorage.setItem("allMovies", JSON.stringify(allMovies));
        const allGridMovies = JSON.parse(localStorage.getItem("movies_all") || "[]");
        allGridMovies.push(newMovie);
        localStorage.setItem("movies_all", JSON.stringify(allGridMovies));
        addedCount++;
        addedMovies.push(newMovie);
      }
      setMovies((prev) => [...prev, ...addedMovies]);
      setBulkAddText("");
      setIsAddModalOpen(false);
      toast.success(`${addedCount} movies added successfully!`);
      calculateStats();
    } catch (error) {
      toast.error("Bulk add failed");
    }
  };

  const handleAddSubmit = async () => {
    console.log("handleAddSubmit - addFormData:", addFormData);
    console.log("handleAddSubmit - JWT token:", localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken"));
    try {
      const token = localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");
      // Prepare new movie object (let backend assign the id)
      const newMovie = {
        ...addFormData,
        views: 0,
        addedDate: new Date().toISOString().split("T")[0],
        actors: addFormData.actors.split(",").map((actor) => actor.trim()),
        genres: addFormData.genres.split(",").map((genre) => genre.trim()),
      };
      await addMovie(newMovie, token); // Use backend API
      setAddFormData({
        title: "",
        rating: "",
        posterUrl: "",
        category: "",
        description: "",
        releaseDate: "",
        duration: "",
        language: "",
        quality: "",
        tailorPlayer: "",
        fastPlayer: "",
        ultraPlayer: "",
        imdb: "",
        director: "",
        actors: "",
        genres: "",
        country: "",
      });
      setIsAddModalOpen(false);
      toast.success("Movie added successfully!");
      fetchMovies(); // Reload from backend
    } catch (error) {
      console.error("Error adding movie:", error);
      toast.error("Failed to add movie");
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="forest-background">
        <div className="dashboard-content">
          {/* Sidebar */}
          <div className="dashboard-sidebar">
            <div className="admin-profile">
              <div className="admin-avatar">
                <span>👤</span>
              </div>
              <h3>Admin Panel</h3>
            </div>
            <nav className="dashboard-nav">
              <button
                className={`nav-item ${activeTab === "movies" ? "active" : ""}`}
                onClick={() => setActiveTab("movies")}
              >
                <span className="nav-icon">🎬</span>
                Movies
              </button>

              <button
                className={`nav-item ${
                  activeTab === "categories" ? "active" : ""
                }`}
                onClick={() => setActiveTab("categories")}
              >
                <span className="nav-icon">📁</span>
                Categories
              </button>
              <button
                className={`nav-item ${
                  activeTab === "settings" ? "active" : ""
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <span className="nav-icon">⚙️</span>
                Settings
              </button>
            </nav>
            <button className="logout-button" onClick={handleLogout}>
              <span className="nav-icon">🚪</span>
              Logout
            </button>
          </div>

          {/* Main Content */}
          <div className="dashboard-main">
            <div className="dashboard-header">
              <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
              <div className="header-actions">
                <button
                  className="add-button"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <span>+</span> Add New {activeTab.slice(0, -1)}
                </button>
              </div>
            </div>

            <div className="dashboard-cards">
              {/* Stats Cards */}
              <div className="stats-card">
                <div className="stats-icon">🎬</div>
                <div className="stats-info">
                  <h3>Total Movies</h3>
                  <p>{stats.totalMovies}</p>
                </div>
              </div>
              <div className="stats-card">
                <div className="stats-icon">📂</div>
                <div className="stats-info">
                  <h3>Categories</h3>
                  <p>4</p>
                </div>
              </div>
              <div className="stats-card">
                <div className="stats-icon">👁️</div>
                <div className="stats-info">
                  <h3>Total Views</h3>
                  <p>{formatViewCount(stats.totalViews)}</p>
                </div>
              </div>
              <div className="stats-card">
                <div className="stats-icon">⭐</div>
                <div className="stats-info">
                  <h3>Average Rating</h3>
                  <p>{stats.averageRating}</p>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="content-area">
              {/* Table Header */}
              <div className="table-header">
                <div className="search-bar">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Search ${activeTab}...`}
                  />
                  <span className="search-icon">🔍</span>
                </div>
                <div className="filter-options">
                  <select
                    value={categoryFilter || ''}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="category-filter-dropdown"
                  >
                    <option value="">All Categories</option>
                    <option value="bollywood">Bollywood</option>
                    <option value="hollywood">Hollywood</option>
                    <option value="south">South</option>
                    <option value="webseries">Web Series</option>
                  </select>
                </div>
              </div>

              {/* Table Content */}
              <div className="table-content">
                <table className="movies-table">
                  <thead>
                    <tr>
                      <th>Poster</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Rating</th>
                      <th>Views</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMovies.map((movie) => {
                      const category = getMovieCategory(movie);
                      const categoryName = {
                        bollywood: "Bollywood Movies",
                        hollywood: "Hollywood Movies",
                        south: "South Movies",
                        webseries: "Web Series",
                        unknown: "Unknown",
                      }[category];

                      return (
                        <tr key={movie._id}>
                          <td className="poster-cell">
                            <img
                              src={movie.posterUrl || movie.imageUrl}
                              alt={`${movie.title} poster`}
                              className="movie-poster"
                              onError={(e) => {
                                console.log(
                                  "Poster failed to load:",
                                  e.target.src
                                );
                                e.target.onerror = null;
                                // Try to load from the public folder if the direct URL fails
                                const publicUrl =
                                  process.env.PUBLIC_URL +
                                  (movie.posterUrl || movie.imageUrl);
                                if (
                                  !e.target.src.includes(process.env.PUBLIC_URL)
                                ) {
                                  e.target.src = publicUrl;
                                } else {
                                  // If both attempts fail, show a movie icon placeholder
                                  e.target.src =
                                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5ONPC90ZXh0Pjwvc3ZnPg==";
                                }
                              }}
                            />
                          </td>
                          <td>{movie.title}</td>
                          <td>
                            <span className={`category-badge ${category}`}>
                              {categoryName}
                            </span>
                          </td>
                          <td>{movie.rating || "N/A"}</td>
                          <td>{formatViewCount(parseInt(movie.views) || 0)}</td>
                          <td className="action-buttons">
                            <button
                              className="edit-button"
                              onClick={() => handleEditMovie(movie._id)}
                            >
                              ✏️
                            </button>
                            <button
                              className="delete-button"
                              onClick={() => handleDeleteClick(movie._id)}
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredMovies.length === 0 && (
                      <tr>
                        <td colSpan="6" className="no-movies">
                          No movies found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h2>Edit Movie</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSubmit();
              }}
            >
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Rating</label>
                <input
                  type="text"
                  name="rating"
                  value={editFormData.rating}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Poster URL</label>
                <input
                  type="text"
                  name="posterUrl"
                  value={editFormData.posterUrl}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={editFormData.category}
                  onChange={handleEditFormChange}
                >
                  <option value="">Select Category</option>
                  <option value="Bollywood Movies">Bollywood Movies</option>
                  <option value="Hollywood Movies">Hollywood Movies</option>
                  <option value="South Movies">South Movies</option>
                  <option value="Web Series">Web Series</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Release Date</label>
                <input
                  type="text"
                  name="releaseDate"
                  value={editFormData.releaseDate}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={editFormData.duration}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Language</label>
                <input
                  type="text"
                  name="language"
                  value={editFormData.language}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Quality</label>
                <input
                  type="text"
                  name="quality"
                  value={editFormData.quality}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Tailor Player URL</label>
                <input
                  type="text"
                  name="tailorPlayer"
                  value={editFormData.tailorPlayer}
                  onChange={handleEditFormChange}
                  placeholder="YouTube or other video URL"
                />
              </div>
              <div className="form-group">
                <label>Fast Player URL</label>
                <input
                  type="text"
                  name="fastPlayer"
                  value={editFormData.fastPlayer}
                  onChange={handleEditFormChange}
                  placeholder="Fast player video URL"
                />
              </div>
              <div className="form-group">
                <label>Ultra Player URL</label>
                <input
                  type="text"
                  name="ultraPlayer"
                  value={editFormData.ultraPlayer}
                  onChange={handleEditFormChange}
                  placeholder="Ultra player video URL"
                />
              </div>
              <div className="form-group">
                <label>IMDb Rating</label>
                <input
                  type="text"
                  name="imdb"
                  value={editFormData.imdb}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Director</label>
                <input
                  type="text"
                  name="director"
                  value={editFormData.director}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Actors (comma-separated)</label>
                <input
                  type="text"
                  name="actors"
                  value={editFormData.actors}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Genres (comma-separated)</label>
                <input
                  type="text"
                  name="genres"
                  value={editFormData.genres}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={editFormData.country}
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-button">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingMovie(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Movie Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h2>Add New Movie</h2>
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <label style={{ fontWeight: 'bold' }}>
                <input
                  type="checkbox"
                  checked={bulkAddMode}
                  onChange={() => setBulkAddMode((prev) => !prev)}
                  style={{ marginRight: '0.5rem' }}
                />
                Bulk Add
              </label>
              <span style={{ fontSize: '0.95rem', color: '#ccc' }}>
                {bulkAddMode
                  ? 'Paste JSON array of movies below.'
                  : 'Fill the form to add a single movie.'}
              </span>
            </div>
            {bulkAddMode ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleBulkAddSubmit();
                }}
              >
                <div className="form-group">
                  <label>Bulk Movies (one per line, comma separated)</label>
                  <textarea
                    value={bulkAddText}
                    onChange={(e) => setBulkAddText(e.target.value)}
                    placeholder={`title,rating,posterUrl,category,description,releaseDate,duration,language,quality,imdb,director,actors,genres,country,tailorPlayer,fastPlayer,ultraPlayer\nExample: Movie Title,8.5,http://poster.jpg,Hollywood Movies,Description,2024,120,English,HD,7.9,Director Name,Actor1|Actor2,Genre1|Genre2,USA,http://tailor.com,http://fast.com,http://ultra.com`}
                    rows={10}
                    style={{ width: '100%', fontFamily: 'monospace' }}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="save-button">
                    Add Movies
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddSubmit();
                }}
              >
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={addFormData.title}
                    onChange={handleAddFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Rating</label>
                  <input
                    type="text"
                    name="rating"
                    value={addFormData.rating}
                    onChange={handleAddFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Poster URL</label>
                  <input
                    type="text"
                    name="posterUrl"
                    value={addFormData.posterUrl}
                    onChange={handleAddFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={addFormData.category}
                    onChange={handleAddFormChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Bollywood Movies">Bollywood Movies</option>
                    <option value="Hollywood Movies">Hollywood Movies</option>
                    <option value="South Movies">South Movies</option>
                    <option value="Web Series">Web Series</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={addFormData.description}
                    onChange={handleAddFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Release Date</label>
                  <input
                    type="text"
                    name="releaseDate"
                    value={addFormData.releaseDate}
                    onChange={handleAddFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={addFormData.duration}
                    onChange={handleAddFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Language</label>
                  <input
                    type="text"
                    name="language"
                    value={addFormData.language}
                    onChange={handleAddFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Quality</label>
                  <input
                    type="text"
                    name="quality"
                    value={addFormData.quality}
                    onChange={handleAddFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>IMDb Rating</label>
                  <input
                    type="text"
                    name="imdb"
                    value={addFormData.imdb}
                    onChange={handleAddFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Director</label>
                  <input
                    type="text"
                    name="director"
                    value={addFormData.director}
                    onChange={handleAddFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Actors (comma-separated)</label>
                  <input
                    type="text"
                    name="actors"
                    value={addFormData.actors}
                    onChange={handleAddFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Genres (comma-separated)</label>
                  <input
                    type="text"
                    name="genres"
                    value={addFormData.genres}
                    onChange={handleAddFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={addFormData.country}
                    onChange={handleAddFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Tailor Player URL</label>
                  <input
                    type="text"
                    name="tailorPlayer"
                    value={addFormData.tailorPlayer}
                    onChange={handleAddFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Fast Player URL</label>
                  <input
                    type="text"
                    name="fastPlayer"
                    value={addFormData.fastPlayer}
                    onChange={handleAddFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Ultra Player URL</label>
                  <input
                    type="text"
                    name="ultraPlayer"
                    value={addFormData.ultraPlayer}
                    onChange={handleAddFormChange}
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="save-button">
                    Add Movie
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <div className={`delete-modal ${isDeleteModalOpen ? "show" : ""}`}>
        <div className="delete-modal-content">
          <h3>Delete Movie</h3>
          <p>
            Are you sure you want to delete "{movieToDelete?.title}"? This
            action cannot be undone.
          </p>
          <div className="delete-modal-buttons">
            <button
              className="delete-confirm-btn"
              onClick={handleDeleteConfirm}
            >
              Yes, Delete
            </button>
            <button className="delete-cancel-btn" onClick={handleDeleteCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      <ToastContainer theme="dark" />
    </div>
  );
};

export default AdminDashboard;
