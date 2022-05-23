import { useState, useEffect, useContext, useCallback } from "react";
import { Table } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../context/store";
import {getIMDBTop250} from '../../functions/imdb';
import "./style.css";

/**
 * Display the top 250 movies in a table. The user can click on a row to view
 * more details about the movie.
 */
function Top250Movies() {
  let [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setError } = useContext(AppContext);

  // get the top 250 movies
  let loadMovies = useCallback(async () => {
    setError("");
    if (user) {
      try {
        const data = await getIMDBTop250(user)
        setMovies(data);
      } catch (err) {
        console.log(err);
        setError('Unable to obtain top 250 movies');
      }
    }
  }, [user, setError]);

  // Check whether use logged in. If not, redirect to log in page
  useEffect(() => {
    if (!user) {
      navigate("/", { state: { from: location }, replace: true });
    }
  }, [user, location, navigate]);

  useEffect(() => {
    if (user) {
      loadMovies();
    }
  }, [user, loadMovies]);

  // When the user clicks on a row, view movie details page
  const handleRowClick = (id) => {
    navigate("/movie-details", { state: { id: id } });
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center">Top 250 Movies</h1>
      <br />
      <br />
      {movies && (
        <Table striped hover variant="light">
          <thead>
            <tr>
              <th className="col-2">Rank</th>
              <th className="col-4">Poster</th>
              <th className="col-4">Title</th>
              <th className="col-4">Rating</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr
                key={movie.id}
                onClick={() => handleRowClick(movie.id)}
              >
                <td className="col-2" key={movie.rank}>{movie.rank}</td>
                <td  className="col-4" key={movie.image}>
                  <img className="topMoviesImg" src={movie.image} alt="poster" />
                </td>
                <td  className="col-4" key={movie.fullTitle}>{movie.fullTitle}</td>
                <td  className="col-4" key={movie.imDbRating}>IMDB {movie.imDbRating}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default Top250Movies;
