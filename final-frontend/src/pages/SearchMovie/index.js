import { useState, useContext, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../context/store";
import { searchIMDB } from "../../functions/imdb";
import "./style.css";

/**
 * The user can search for a movie by typing in the input box and clicking on
 * the "Search" button. The results are displayed in a table. The user can
 * click on a row to view more details about a movie. If there are no results, 
 * a message is displayed on the screen.
 */
function SearchMovie() {
  let [movies, setMovies] = useState([]);
  let [expression, setExpression] = useState("");
  let [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setError } = useContext(AppContext);

  // Check whether use logged in. If not, redirect to log in page
  useEffect(() => {
    if (!user) {
      navigate("/", { state: { from: location }, replace: true });
    }
  }, [user, location, navigate]);

  // get search results
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse("");
    setMovies([])

    // set the value of query parameters
    var params = new URLSearchParams({
      expression: expression,
    });
    try {
      const data = await searchIMDB(user, params);
      setLoading(false);
      "results" in data
        ? setMovies(data.results)
        : setResponse(data.message);
    } catch (err) {
      setLoading(false);
      console.log(err);
      setError(
        `Search IMDB with term "${expression}" failed. Please try again`,
      );
    }
  };

  // When the user clicks on a row, view movie details page
  const handleRowClick = (id) => {
    navigate("/movie-details", { state: { id: id } });
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center">Search Movies</h1>
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="expression" className="col-4 text-end">
            Title:
          </label>
          <input
            type="text"
            id="expression"
            name="expression"
            value={expression}
            onChange={(e) => {
              setExpression(e.target.value);
            }}
            className="col-4"
            required
          />
        </div>
        <br />
        <br />
        <div className="row">
          <div className="col-5"></div>
          <input
            type="submit"
            value={loading ? "Searching..." : "Search"}
            className="btn-light col-2"
          />
        </div>
      </form>
      <br />
      <br />
      {movies.length > 0 && (
        <Table striped hover variant="light">
          <thead>
            <tr>
              <th className="col-6">Poster</th>
              <th className="col-6">Title</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id} onClick={() => handleRowClick(movie.id)}>
                <td className="col-6" key={movie.image}>
                  <img
                    key={movie.boxOffice}
                    className="searchImg"
                    src={movie.image}
                    alt="poster"
                  />
                </td>
                <td className="col-6" key={movie.id}>
                  {movie.title} {movie.description}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <div id="response" name="response" className="text-center">
        {response ? <p>{response}</p> : null}
      </div>
    </div>
  );
}

export default SearchMovie;
