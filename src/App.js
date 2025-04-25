import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import MovieGrid from "./components/MovieGrid";
import VideoPlayer from "./components/VideoPlayer";
import AdminLogin from "./components/AdminLogin";
import SearchResults from "./components/SearchResults";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bollywood-movies" element={<MovieGrid category="bollywood" />} />
            <Route path="/hollywood-hindi" element={<MovieGrid category="hollywood" />} />
            <Route path="/south-hindi" element={<MovieGrid category="south" />} />
            <Route path="/web-series" element={<MovieGrid category="web-series" />} />
            <Route
              path="/web-series"
              element={<MovieGrid category="web-series" />}
            />
            <Route path="/all-movies" element={<MovieGrid category="all" />} />
            <Route path="/movie/:id" element={<VideoPlayer />} />
            <Route path="/watch/:title" element={<VideoPlayer />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
