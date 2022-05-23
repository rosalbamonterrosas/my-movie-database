/**
 * Create a new watchlist for the given user. The check for whether user
 * already exists is handled by the API. This function does not return anything
 * @param {*} user user object pf the currently singed-in user
 */
export const createWatchlist = async (user) => {
  const idToken = await user.getIdToken(true);
  const res = await fetch("http://localhost:5678/watchlist/", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + idToken,
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    throw Error(`Create watchlist failed. API return status ${res.status}`);
  }
}

/**
 * Obtain the watchlist of a given user. Any error during the execution will
 * be caught by the called. Also, if the API return status code is not 200,
 * we aso escalate that to an error, such that this situation can also be
 * handled by the caller
 * @param {*} user user object of the currently signed-in user
 */
export const getWatchlist = async (user) => {
  const idToken = await user.getIdToken(true);      
  const res = await fetch("http://localhost:5678/watchlist", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + idToken,
      "Content-Type": "application/json",
    },
  });
  if (res.status === 200) {
    const data = await res.json();
    return data;
  }
  throw Error(`Get watchlist failed. API return status ${res.status}`);
}

/**
 * Add a movie to watchlist
 * @param {*} user user object of the currently signed-in user
 * @param {*} movie movie object
 */
export const addToWatchlist = async (user, movie) => {
  const movieObj = {
    fullTitle: movie.fullTitle,
    id: movie.id, // note that the data from IMBD uses id, not id
    image: movie.image,
    imDbRating: movie.imDbRating,
    metacriticRating: movie.metacriticRating,
    runtimeStr: movie.runtimeStr,
    genres: movie.genres,
    boxOffice: movie.boxOffice,
    plot: movie.plot,
    contentRating: movie.contentRating,
  };
  const idToken = await user.getIdToken(true);
  const res = await fetch(`http://localhost:5678/watchlist/add`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + idToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movieObj),
  });
  const data = await res.json();
  if (res.status === 200) {
    return true;
  }
  throw Error(
    `Unable to add movie to watchlist. ${data.message}`,
  )
};

/**
 * Remove a movie from watchlist. If operation successful, return True.
 * Otherwise, always throw a new error and have the caller deal with the
 * error handling.
 * @param {*} user user object of the currently signed-in user
 * @param {*} id IMDB ID assigned to the movie
 */
export const removeFromWatchlist = async (user, id) => {
  const idToken = await user.getIdToken(true);
  const res = await fetch(`http://localhost:5678/watchlist/delete`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + idToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  });
  const data = await res.json();
  if (res.status === 200) {
    // successful request, simply return True indicating that the operation
    // has been successful.
    return true;
  }
  throw Error(`Unable to remove movie from wathclist. ${data.message}`);
};

/**
 * Query a given id in the watchlist. Return the movie object if it is in
 * the watchlist, otherwise empty object
 * @param {*} user user object of the currently signed-in user
 * @param {*} id IMDB ID assigned to the movie
 */
export const queryWatchlist = async (user, id) => {
  const idToken = await user.getIdToken(true);
  const res = await fetch(`http://localhost:5678/watchlist/${id}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + idToken,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (res.status === 200) {
    return data;
  }
  // encountered an error
  throw Error(`Query watchlist failed. ${data.message}`);
};
