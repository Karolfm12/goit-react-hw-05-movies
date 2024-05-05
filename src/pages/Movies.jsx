import { API } from 'components/App';
import { useState } from 'react';
import { Link } from 'react-router-dom';
export const Movies = () => {
  const [query, setQuery] = useState('');
  const [moviesList, setMoviesList] = useState([]);

  const handleOnChange = e => {
    setQuery(e.target.value);
  };

  const handleOnSubmit = e => {
    e.preventDefault();
    fetchMovieFromQuery();
    setQuery('');
  };

  const fetchMovieFromQuery = async () => {
    const URL = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${API}`;

    try {
      const response = await fetch(URL);
      const data = await response.json();
      console.log(data.results);
      setMoviesList(data.results);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <form action="" onSubmit={handleOnSubmit}>
        <input type="text" onChange={handleOnChange} />
        <button type="submit">OK</button>
      </form>
      <div>{query}</div>
      <ul>
        {moviesList.map((val, index) => {
          return (
            <li key={index}>
              <Link to={`/movies/${val.id}`}>{val.title}</Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
};
