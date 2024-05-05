import { API } from 'components/App';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export const MovieDetails = () => {
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [genreDetails, setGenreDetails] = useState([]);
  const [castDetails, setCastDetails] = useState([]);
  const [reviewsDetails, setReviewsDetails] = useState([]);
  const [showCast, setShowCast] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const URL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API}`;

      try {
        const response = await fetch(URL);
        const data = await response.json();
        setMovieDetails(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  useEffect(() => {
    const fetchCastDetails = async () => {
      const URL = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API}`;

      try {
        const response = await fetch(URL);
        const data = await response.json();

        setCastDetails(data.cast);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCastDetails();
  }, [movieId]);

  useEffect(() => {
    const fetchReviews = async () => {
      const URL = `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${API}`;

      try {
        const response = await fetch(URL);
        const data = await response.json();
        setReviewsDetails(data.results);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReviews();
  }, [movieId]);

  useEffect(() => {
    const fetchGenres = async () => {
      if (movieDetails && movieDetails.genre_ids) {
        const genreIds = movieDetails.genre_ids;
        try {
          const genreDetails = await Promise.all(
            genreIds.map(async genreId => {
              const genreURL = `https://api.themoviedb.org/3/genre/${genreId}?api_key=${API}`;

              const response = await fetch(genreURL);
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              const data = await response.json();

              return data;
            })
          );
          setGenreDetails(genreDetails);
        } catch (error) {
          console.error('Error fetching genre details:', error);
        }
      }
    };

    fetchGenres();
  }, [movieDetails]);

  if (!movieDetails) {
    return <p>Ładowanie...</p>;
  }

  const handleCastClick = () => {
    setShowReviews(false);
    setShowCast(!showCast);
    navigate(`/movies/${movieId}/cast`);
  };

  const handleReviewsClick = () => {
    setShowCast(false);
    setShowReviews(!showReviews);
    if (showReviews) {
      navigate(`/movies/${movieId}`);
    } else {
      navigate(`/movies/${movieId}/reviews`);
    }
  };

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
          <p>
            User Score: {((movieDetails.vote_average / 10) * 100).toFixed(0)}%
          </p>
          <h3>Overview:</h3>
          <p>{movieDetails.overview}</p>
          <h3>Generes:</h3>

          <ul>
            {genreDetails.map((genre, index) => {
              console.log(genreDetails);
              return <li key={index}>{genre.name}</li>;
            })}
          </ul>
        </div>
      </div>
      <hr />
      <div>
        <p>Additional information</p>
        <ul>
          <li>
            <Link to={`/movies/${movieId}/cast`} onClick={handleCastClick}>
              Cast
            </Link>
          </li>
          <li>
            <Link
              to={`/movies/${movieId}/reviews`}
              onClick={handleReviewsClick}
            >
              Reviews
            </Link>
          </li>
        </ul>
      </div>
      <hr />
      <div className="information--section">
        <ul>
          {showCast &&
            castDetails.map((val, index) => {
              return (
                val.profile_path && (
                  <li key={index} className="cast">
                    <img
                      src={`https://image.tmdb.org/t/p/w200/${val.profile_path}`}
                      alt=""
                    />
                    {val.name}
                  </li>
                )
              );
            })}
        </ul>
        {showReviews && (
          <ul>
            {reviewsDetails.length > 0 ? (
              reviewsDetails.map((val, index) => {
                return (
                  <li key={index}>
                    <h4>Author: {val.author}</h4>
                    <p>{val.content}</p>
                  </li>
                );
              })
            ) : (
              <p>There is no reviews</p>
            )}
          </ul>
        )}
      </div>
    </>
  );
};
