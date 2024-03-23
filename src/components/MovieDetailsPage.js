// src/components/MovieDetailsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import styles from './MovieDetailsPage.module.css';
import Footer from './Footer'; 

function MovieDetailsPage() {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=6229c9565d3a99077270bdd9658407e2&language=en-US`
        );
        setMovieDetails(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movieDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
    <div className={styles.container}>
      <div className={styles.movieDetails}>
        <h2>{movieDetails.title}</h2>
        <p>Release Year: {movieDetails.release_date}</p>
        <p>Plot Summary: {movieDetails.overview}</p>
        <p>Rating: {movieDetails.vote_average}</p>
        <p>Genres: {movieDetails.genres.map(genre => genre.name).join(', ')}</p>
        {/* You can add more details like cast, director, etc. if available */}
      </div>
      <Link to="/" className={styles.backButton}>Back to Home</Link>
    </div>
    <Footer></Footer>
    </div>
  );
}

export default MovieDetailsPage;
