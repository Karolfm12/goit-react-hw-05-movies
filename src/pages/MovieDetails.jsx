import { API } from 'components/App';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const MovieDetails = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [genreDetails, setGenreDetails] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const URL = `https://api.themoviedb.org/3/movie/${id}?api_key=${API}`;

      try {
        const response = await fetch(URL);
        const data = await response.json();
        setMovieDetails(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    const fetchGenres = async () => {
      if (movieDetails && movieDetails.genre_ids) {
        const genreIds = movieDetails.genre_ids;
        const genreDetails = await Promise.all(
          genreIds.map(async genreId => {
            const genreURL = `https://api.themoviedb.org/3/genre/${genreId}?api_key=${API}`;
            const response = await fetch(genreURL);
            const data = await response.json();
            return data;
          })
        );
        setGenreDetails(genreDetails);
      }
    };

    fetchGenres();
  }, [movieDetails]);

  //   useEffect(() => {
  //     const fetchMovieDetails = async () => {
  //       const URL = `https://api.themoviedb.org/3/movie/${id}?api_key=${API}`;

  //       try {
  //         const response = await fetch(URL);
  //         const data = await response.json();
  //         setMovieDetails(data);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     };

  //     const fetchGenres = async () => {
  //       if (movieDetails && movieDetails.genre_ids) {
  //         // Added null check for movieDetails.genre_ids
  //         const genreIds = movieDetails.genre_ids;
  //         const genreDetails = await Promise.all(
  //           genreIds.map(async genreId => {
  //             const genreURL = `https://api.themoviedb.org/3/genre/${genreId}?api_key=${API}`;
  //             const response = await fetch(genreURL);
  //             const data = await response.json();
  //             return data;
  //           })
  //         );
  //         setGenreDetails(genreDetails);
  //       }
  //     };

  //     fetchMovieDetails();
  //     fetchGenres();
  //   }, [id, movieDetails]);

  if (!movieDetails) {
    return <p>Ładowanie...</p>;
  }

  return (
    <>
      <div className="container__details">
        <div className="container__details--left">
          <img
            src={`https://image.tmdb.org/t/p/w500/${movieDetails.backdrop_path}`}
            alt=""
          />
        </div>
        <div className="container__details--right">
          <h1>
            {movieDetails.title} ({movieDetails.release_date.slice(0, 4)})
          </h1>
          <p>User Score: {(movieDetails.vote_average / 10) * 100}%</p>
          <h3>Overview:</h3>
          <p>{movieDetails.overview}</p>
          <h3>Generes:</h3>

          <ul>
            {genreDetails.map(genre => (
              <li key={genre.id}>{genre.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
