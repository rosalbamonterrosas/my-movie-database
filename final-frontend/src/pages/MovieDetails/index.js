import { useContext, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/store";
import { Button } from "react-bootstrap";
import {
  addToWatchlist,
  removeFromWatchlist,
  queryWatchlist,
} from "../../functions/watchlist";
import { getIMDBMovieDetail, getIMDBTrailer } from "../../functions/imdb";
import { Dot, StarFill } from "react-bootstrap-icons";

/**
 * Show more information about a movie, including the movie's trailer. The
 * user can add or remove a movie from their watchlist on this page.
 */
function MovieDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setError } = useContext(AppContext);
  const [movie, setMovie] = useState();
  const [trailer, setTrailer] = useState("");
  const [movieInWatchlist, setMovieInWatchlist] = useState(false);

  // get information about a movie
  const getMovieDetail = useCallback(async () => {
    setError("");
    if (user && location.state.id) {
      try {
        const data = await queryWatchlist(user, location.state.id);
        if (Object.keys(data).length > 0) {
          setMovieInWatchlist(true);
          setMovie(data);
        } else {
          // Need to fetch the movie from IMDB API
          setMovieInWatchlist(false);
          const newData = await getIMDBMovieDetail(user, location.state.id);
          setMovie(newData);
        }
      } catch (err) {
        console.log(err);
        setError("Unable to get movie detail");
      }
    }
  }, [user, location, setError]);

  // get the movie's trailer link
  const getTrailer = useCallback(async () => {
    setError("");
    if (user && location.state.id) {
      try {
        const data = await getIMDBTrailer(user, location.state.id);
        setTrailer(data);
      } catch (err) {
        console.log(err);
        setError("Unable to get trailer");
      }
    }
  }, [user, location, setError]);

  // handle click of remove from watchlist button
  const removeButtonOnClick = async () => {
    if (user && movie.id) {
      try {
        const res = await removeFromWatchlist(user, movie.id);
        if (res) {
          setMovieInWatchlist(false);
        }
      } catch (err) {
        console.log(err);
        setError("Unable to remove the target movie.");
      }
    }
  };

  // handle click of add to watchlist button
  const addButtonOnClick = async () => {
    if (user && movie) {
      try {
        const res = await addToWatchlist(user, movie);
        if (res) {
          setMovieInWatchlist(true);
        }
      } catch (err) {
        console.log(err);
        setError("Unable to add the target movie.");
      }
    }
  };

  // Check whether use logged in. If not, redirect to log in page
  useEffect(() => {
    if (!user) {
      navigate("/", { state: { from: location }, replace: true });
    }
  }, [user, location, navigate]);

  useEffect(() => {
    if (user) {
      getMovieDetail();
      getTrailer();
    }
  }, [user, getMovieDetail, getTrailer]);

  return (
    <div>
      {movie && (
        <div>
          <div className="container-fluid">
            <div className="row">
              <h1 className="col">{movie.fullTitle}</h1>
              <span className="col">
                {movieInWatchlist ? (
                  <Button
                    className="float-end"
                    variant="danger"
                    onClick={removeButtonOnClick}
                  >
                    Remove from Watchlist
                  </Button>
                ) : (
                  <Button className="float-end" onClick={addButtonOnClick}>
                    Add to Watchlist
                  </Button>
                )}
              </span>
            </div>
            <div className="row">
              <div className="col">
                {movie.genres} <Dot /> {movie.contentRating} <Dot />{" "}
                {movie.runtimeStr}
              </div>
              <div className="col text-end">
                IMDB Rating <StarFill /> {movie.imDbRating} / 10
              </div>
            </div>

            <br />
            <div className="row">
              <img
                className="movieDetailsImg col-4"
                src={movie.image}
                alt="poster"
              />
              <iframe
                className="col"
                src={trailer}
                allowFullScreen={true}
                mozallowfullscreen="true"
                webkitallowfullscreen="true"
                frameBorder="no"
                scrolling="no"
                title="Embedded imdb video"
              ></iframe>
            </div>
          </div>
          <br />
          <br />
          <h3>Plot</h3>
          <div>{movie.plot}</div>
          <br />
          <h3>Box Office</h3>
          <h5>Budget</h5>
          <p>{movie.boxOffice.budget}</p>
          <h5>Gross USA</h5>
          <p>{movie.boxOffice.grossUSA}</p>
          <h5>Gross Global</h5>
          <p>{movie.boxOffice.cumulativeWorldwideGross}</p>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;
