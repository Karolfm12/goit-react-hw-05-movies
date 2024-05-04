import { Link } from 'react-router-dom';

export const Home = ({ popularMovies }) => {
  return (
    <main>
      <ul>
        {popularMovies.map((val, index) => {
          return (
            val.title && (
              <li key={index}>
                <Link to={`/movies/${val.id}`}>{val.title}</Link>
              </li>
            )
          );
        })}
      </ul>
    </main>
  );
};
