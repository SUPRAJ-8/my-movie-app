import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FastPlayer from '../components/FastPlayer';
import fastPlayerService from '../services/fastPlayerService';
import '../styles/WatchPage.css';

const WatchPage = () => {
  const { fileId } = useParams();
  const [fileDetails, setFileDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFileDetails = async () => {
      try {
        setLoading(true);
        const response = await fastPlayerService.getFileDetails(fileId);
        if (response.status && response.data) {
          setFileDetails(response.data);
        } else {
          throw new Error('Failed to load file details');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading file details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (fileId) {
      loadFileDetails();
    }
  }, [fileId]);

  if (loading) {
    return (
      <div className="watch-page-loading">
        <div className="loading-spinner"></div>
        <p>Loading video details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="watch-page-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="watch-page">
      <div className="watch-page-content">
        <FastPlayer 
          fileId={fileId} 
          onError={(err) => setError(err.message)} 
        />
        {fileDetails && (
          <div className="video-details">
            <h1>{fileDetails.name}</h1>
            <div className="video-meta">
              <span>Quality: {fileDetails.quality}p</span>
              <span>Genre: {fileDetails.genre}</span>
              {fileDetails.seasonNumber && (
                <span>Season {fileDetails.seasonNumber}</span>
              )}
              {fileDetails.episodeNumber && (
                <span>Episode {fileDetails.episodeNumber}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchPage; 