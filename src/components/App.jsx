import { Home } from 'pages/Home';
import { MovieDetails } from 'pages/MovieDetails';
import { Movies } from 'pages/Movies';
import { NotFound } from 'pages/NotFound';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Link } from './App.styled';
export const API = 'e7c930d9ee21da94f8fc3257d387eced';

export const App = () => {
  const [popularMovies, setPopularMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const URL = `https://api.themoviedb.org/3/trending/all/day?api_key=${API}`;
      //   fetch(URL)
      //     .then(response => response.json())
      //     .then(data => setPopularMovies(prev => [...prev, ...data.results]))
      //     .catch(err => console.error(err));
      // };
      try {
        const response = await fetch(URL);
        const data = await response.json();
        console.log(data);
        setPopularMovies(prev => [...prev, ...data.results]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/movies">Movies</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home popularMovies={popularMovies} />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};
