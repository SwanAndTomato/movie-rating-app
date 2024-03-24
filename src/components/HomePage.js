import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=6229c9565d3a99077270bdd9658407e2&language=en-US`
        );
        setGenres(response.data.genres);
        setLoadingGenres(false);
      } catch (error) {
        console.error('Error fetching genres:', error);
        setLoadingGenres(false);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let url = `https://api.themoviedb.org/3/movie/top_rated?api_key=6229c9565d3a99077270bdd9658407e2&language=en-US&page=${currentPage}`;
        if (searchTerm && selectedGenre) {
          url = `https://api.themoviedb.org/3/search/movie?api_key=6229c9565d3a99077270bdd9658407e2&query=${searchTerm}&with_genres=${selectedGenre}&page=${currentPage}`;
        } else if (searchTerm) {
          url = `https://api.themoviedb.org/3/search/movie?api_key=6229c9565d3a99077270bdd9658407e2&query=${searchTerm}&page=${currentPage}`;
        } else if (selectedGenre) {
          url = `https://api.themoviedb.org/3/discover/movie?api_key=6229c9565d3a99077270bdd9658407e2&with_genres=${selectedGenre}&page=${currentPage}`;
        }
        const response = await axios.get(url);
        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [currentPage, searchTerm, selectedGenre]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    setCurrentPage(1); // Reset to the first page when changing genre
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search movies by title..."
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>Search</button>
        <select
          value={selectedGenre}
          onChange={(e) => handleGenreChange(e.target.value)}
          className={styles.select}
          disabled={loadingGenres} // Disable dropdown while loading genres
        >
          <option value="">Select Genre</option>
          {loadingGenres ? (
            <option disabled>Loading genres...</option>
          ) : (
            genres.map((genre) => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))
          )}
        </select>
      </div>

      <ul className={styles.movieList}>
        {movies.map((movie) => (
          <li key={movie.id} className={styles.movieItem}>
            <div className={styles.movieInfo}>
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={`${movie.title} Poster`}
                className={styles.poster}
              />
              <div className={styles.details}>
                <h2>{movie.title}</h2>
                <p>Release Date: {movie.release_date}</p>
                <p>Average Rating: {movie.vote_average}</p>
                <Link to={`/movie/${movie.id}`} className={styles.detailsButton}>View Details</Link>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.pagination}>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous Page</button>
        <span>{currentPage} / {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next Page</button>
      </div>
    </div>
  );
}

export default HomePage;
