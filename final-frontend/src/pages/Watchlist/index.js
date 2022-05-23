import { useContext, useState, useEffect, useCallback } from "react";
import { Table } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { Trash } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";
import { AppContext } from "../../context/store";
import "./style.css";
import {
  getWatchlist,
  removeFromWatchlist,
} from "../../functions/watchlist";

/**
 * Initialization value is null to ensure that before getWatchlist function
 * returns any value, we don't display anything. After some value is acquired
 * from getWatchlist, we can display either the movies if there are any, or
 * a message if there is no movie. null in this sense serves as a sentinel
 * value.
 */
function Watchlist() {
  let [movies, setMovies] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setError } = useContext(AppContext);

  // Add underscore to make the locally defined get watchlist function distinct
  // from the one imported.
  const getWatchlist_ = useCallback(async () => {
    setError("");
    if (user) {
      try {
        const data = await getWatchlist(user);
        setMovies(data);
      } catch (err) {
        console.log(err);
        setError("Unable to obtain watchlist. Please restart and try again");
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
      getWatchlist_();
    }
  }, [user, getWatchlist_]);

  // When the user clicks on a row, view movie details page
  const handleRowClick = (id) => {
    navigate("/movie-details", { state: { id: id } });
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center">Watchlist</h1>
      <br />
      <br />
      {movies !== null &&
        (movies.length > 0 ? (
          <Table striped hover variant="light">
            <thead>
              <tr>
                <th className="col-2">Poster</th>
                <th className="col-2">Title</th>
                <th className="col-2">Duration</th>
                <th className="col-2">Genre</th>
                <th className="col-2">Ratings</th>
                <th className="col-2">Box Office</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie, idx) => (
                <tr key={movie.id} onClick={() => handleRowClick(movie.id)}>
                  <td className="col-2" key={movie.image}>
                    <img
                      className="watchlistImg"
                      src={movie.image}
                      alt="poster"
                      key={movie.contentRating}
                    />
                  </td>
                  <td className="col-2" key={movie.fullTitle}>
                    {movie.fullTitle}
                  </td>
                  <td className="col-2" key={movie.runtimeStr}>
                    {movie.runtimeStr}
                  </td>
                  <td className="col-2" key={movie.genres}>
                    {movie.genres}
                  </td>
                  <td className="col-2" key={movie.imDbRating}>
                    <span key={movie.boxOffice.openingWeekendUSA}>
                      IMDB {movie.imDbRating}
                    </span>{" "}
                    <br />
                    <span key={movie.metacriticRating}>
                      Metacritic {movie.metacriticRating}
                    </span>
                  </td>
                  <td className="col-2" key={movie.boxOffice}>
                    <span key={movie.boxOffice.budget}>
                      Budget {movie.boxOffice.budget}
                    </span>{" "}
                    <br />
                    <span key={movie.boxOffice.grossUSA}>
                      Gross USA {movie.boxOffice.grossUSA}
                    </span>{" "}
                    <br />
                    <span key={movie.boxOffice.cumulativeWorldwideGross}>
                      Gross Global {movie.boxOffice.cumulativeWorldwideGross}
                    </span>
                  </td>
                  <td key={movie.plot}>
                    <Button
                      variant="danger"
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const res = await removeFromWatchlist(user, movie.id);
                          if (res) {
                            setMovies(movies.filter((v, i) => i !== idx));
                          }
                        } catch (err) {
                          console.log(err);
                          setError('Unable to delete movie from watchlist');
                        }
                      }}
                    >
                      <Trash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="text-center">
            <div>
              <p>No movies in watchlist.</p>
              <p>
                {" "}
                Add a movie to the watchlist by viewing top 250 movies or
                searching.
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Watchlist;
