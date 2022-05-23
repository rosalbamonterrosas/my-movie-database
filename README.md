# My Movie Database Web App

Rosalba Monterrosas

# Table of Contents

- [About the Project](#about-the-project)
  - [Built With](#built-with)
  - [Versions](#versions)
  - [Deploying the Application](#deploying-the-application)
- [Project Explanation](#project-explanation)
  - [Get Movie](#get-movie)
  - [Search Movies](#search-movies)
  - [Get the Top 250 Movies](#get-the-top-250-movies)
  - [Get Trailer](#get-trailer)
  - [Create Watchlist](#create-watchlist)
  - [Add a Movie to Watchlist](#add-a-movie-to-watchlist)
  - [Get Movies in Watchlist](#get-movies-in-watchlist)
  - [Get a Movie from Watchlist](#get-a-movie-from-watchlist)

## About the Project

This project is a movie database with a watchlist.

This project contains a main home page at http://localhost:3000/. The
user can sign in with Google, view the top 250 movies, search for movies,
and manage their own watchlist. The IMDB Api is used to retrive movie
information, and MongoDB is used to store a user's watchlist. The backend is a 
Node.js application running Express.js. The frontend is a React web 
application.

### Built With

- [React](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [Node.js](https://nodejs.org/)
- [HTML](https://html.com)
- [CSS](https://www.w3.org/Style/CSS/)
- [Bootstrap](https://getbootstrap.com)
- [JavaScript](https://www.javascript.com/)

### Versions

- node v17.5.0
- npm v8.4.1
- Bootstrap v5

### Deploying the Application

1.	Install the following
    * node v16.14.0
    * npm v8.4.1
    *	MongoDB

2.	Run the command `npm install` to install all modules listed as dependencies 
in `package.json`

3.	Start MongoDB

4.	Run the command `node movieserver.js` under the `backend` folder to start 
the server

5.	Run the command `npm start` under the `final-frontend` folder to run the 
React app in the development mode.


## Project Explanation

### Get Movie

The backend endpoint below uses a GET request to get the details of a movie by calling the Title IMDB api using the imdb id.

```
app.get("/movies/:id", checkAuth, function (req, res) {
  var id = req.params.id;
  return getMovie(id, res);
});

const getMovie = async (id, res) => {
  try {
    let imdbRes = await fetch(
      `https://imdb-api.com/en/API/Title/${imdbApiKey}/${id}`,
      {
        method: "GET",
      }
    );
    // get response data
    imdbRes.json().then((data) => {
      if (data.errorMessage == null) {
        // movie found
        return res.status(200).send(data);
      } else {
        // movie not found
        var rspObj = {};
        rspObj._id = id;
        rspObj.status = 404;
        rspObj.message = "error - movie not found";
        return res.status(rspObj.status).send(rspObj);
      }
    });
  } catch (err) {
    // failed to send request
    console.log(err);
    return res
      .status(500)
      .send({ message: "error - internal server error: cannot send request" });
  }
};
```

### Search Movies

The backend endpoint below uses a GET request to search movies by calling the SearchMovie IMDB api using an expression provided by the user.

```
app.get("/movies", checkAuth, function (req, res) {
  var expression = req.query.expression;
  return searchMovies(expression, res);
});

const searchMovies = async (expression, res) => {
  try {
    let imdbRes = await fetch(
      `https://imdb-api.com/en/API/SearchMovie/${imdbApiKey}/${expression}`,
      {
        method: "GET",
      }
    );
    // get response data
    imdbRes.json().then((data) => {
      if (data.results.length == 0) {
        // no movies found
        return res.status(200).send({ message: "No results found." });
      } else {
        // movie found
        return res.status(200).send(data);
      }
    });
  } catch (err) {
    // failed to send request
    console.log(err);
    return res
      .status(500)
      .send({ message: "error - internal server error: cannot send request" });
  }
};
```

### Get the Top 250 Movies

The backend endpoint below uses a GET request to get the top 250 movies by calling the Top250Movies IMDB api.

```
app.get("/top-movies", checkAuth, function (req, res) {
  return getTopMovies(res);
});

const getTopMovies = async (res) => {
  try {
    let imdbRes = await fetch(
      `https://imdb-api.com/en/API/Top250Movies/${imdbApiKey}`,
      {
        method: "GET",
      }
    );
    // get response data
    imdbRes.json().then((data) => {
      return res.status(200).send(data);
    });
  } catch (err) {
    // failed to send request
    console.log(err);
    return res
      .status(500)
      .send({ message: "error - internal server error: cannot send request" });
  }
};
```

### Get Trailer

The backend endpoint below uses a GET request to get the trailer of a movie by calling the Trailer IMDB api using the imdb id.

```
app.get("/trailer/:id", checkAuth, function (req, res) {
  var id = req.params.id;
  return getTrailer(id, res);
});

const getTrailer = async (id, res) => {
  try {
    let imdbRes = await fetch(
      `https://imdb-api.com/en/API/Trailer/${imdbApiKey}/${id}`,
      {
        method: "GET",
      }
    );
    // get response data
    imdbRes.json().then((data) => {
      if (data.errorMessage == "") {
        // trailer found
        return res.status(200).send(data);
      } else {
        // trailer not found
        var rspObj = {};
        rspObj._id = id;
        rspObj.status = 404;
        rspObj.message = "error - trailer not found";
        return res.status(rspObj.status).send(rspObj);
      }
    });
  } catch (err) {
    // failed to send request
    console.log(err);
    return res
      .status(500)
      .send({ message: "error - internal server error: cannot send request" });
  }
};
```

### Create Watchlist

The backend endpoint below uses a POST request to create and insert a user's initial watchlist object into the database when the user logs in for the first time.

```
app.post("/watchlist", checkAuth, function (req, res) {
  return createWatchlist(req, res);
});

const createWatchlist = (req, res) => {
  MongoClient.connect(
    uri,
    { useUnifiedTopology: true },
    function (err, client) {
      if (err) {
        return res.status(500).send({
          message: "error - internal server error: cannot connect to database",
        });
      }
      var dbo = client.db("movies");
      // create JSON object for user to insert
      var obj = createWatchlistObj(req.user.uid);
      // insert user's empty watchlist
      return insertWatchlistObj(obj, dbo, client, res);
    }
  );
};
```

### Add a Movie to Watchlist

The backend endpoint below uses a PUT request to add a movie to a user's watchlist. The function connects to the MongoClient, finds the user in the database, and adds the new movieList object into the user's movieList.

```
app.put("/watchlist/add", checkAuth, function (req, res) {
  var userId = req.user.uid;
  var movieListObj = createMovieListObj(req);
  return addMovie(userId, movieListObj, res);
});

const addMovie = (userId, movieListObj, res) => {
  MongoClient.connect(
    uri,
    { useUnifiedTopology: true },
    function (err, client) {
      if (err) {
        return res.status(500).send({
          message: "error - internal server error: cannot connect to database",
        });
      }
      var dbo = client.db("movies");
      // Define a filter query
      var query = { _id: userId };

      var newMovieList = {
        $push: {
          movieList: movieListObj,
        },
      };

      dbo
        .collection("watchlist")
        .updateOne(query, newMovieList, function (err, mongoRes) {
          if (err) {
            return res.status(500).send({
              message: "error - internal server error: cannot add movie",
            });
          }
          client.close();
          var rspObj = {};
          rspObj._id = userId;
          rspObj.status = 200;
          rspObj.message = "successfully added movie to watchlist";
          return res.status(rspObj.status).send(rspObj);
        });
    }
  );
};
```

### Delete a Movie from Watchlist

The backend endpoint below uses a PUT request to delete a movie from a user's watchlist. The function connects to the MongoClient, finds the user in the database, and deletes the new movieList object from the user's movieList using the imdb id.

```
app.put("/watchlist/delete", checkAuth, function (req, res) {
  var userId = req.user.uid;
  var id = req.body.id;
  return deleteMovie(userId, id, res);
});

const deleteMovie = (userId, id, res) => {
  MongoClient.connect(
    uri,
    { useUnifiedTopology: true },
    function (err, client) {
      if (err) {
        return res.status(500).send({
          message: "error - internal server error: cannot connect to database",
        });
      }
      var dbo = client.db("movies");
      // Define a filter query
      var query = { _id: userId };

      var newMovieList = {
        $pull: {
          movieList: { id: id },
        },
      };

      dbo
        .collection("watchlist")
        .updateOne(query, newMovieList, function (err, mongoRes) {
          if (err) {
            return res.status(500).send({
              message: "error - internal server error: cannot delete movie",
            });
          }
          client.close();
          var rspObj = {};
          rspObj._id = userId;
          rspObj.status = 200;
          rspObj.message = "successfully deleted movie from watchlist";
          return res.status(rspObj.status).send(rspObj);
        });
    }
  );
};
```

### Get Movies in Watchlist

The backend endpoint below uses a GET request to get the movies in a user's watchlist. The function connects to the MongoClient, finds the user in the database, and gets the movieList objects from the user's movieList.

```
app.get("/watchlist", checkAuth, function (req, res) {
  var userId = req.user.uid;
  return getWatchlist(userId, res);
});

const getWatchlist = (userId, res) => {
  MongoClient.connect(
    uri,
    { useUnifiedTopology: true },
    function (err, client) {
      if (err) {
        return res.status(500).send({
          message: "error - internal server error: cannot connect to database",
        });
      }
      var dbo = client.db("movies");
      // Define a filter query
      var query = { _id: userId };

      dbo.collection("watchlist").findOne(query, function (err, mongoRes) {
        if (err) {
          return res
            .status(500)
            .send({ message: "error - internal server error: cannot fetch" });
        }
        var movieList = mongoRes.movieList;
        return res.status(200).send(movieList);
      });
    }
  );
};
```

### Get a Movie from Watchlist

The backend endpoint below uses a GET request to get a movie from a user's watchlist. The function connects to the MongoClient, finds the user in the database, and query a movie in user's watchlist. If the movie is found in the watchlist, return the movie object. Otherwise, return an empty object.

```
app.get("/watchlist/:id", checkAuth, function (req, res) {
  const userId = req.user.uid;
  const id = req.params.id;
  return queryWatchlist(userId, id, res);
});

const queryWatchlist = (userId, id, res) => {
  MongoClient.connect(
    uri,
    { useUnifiedTopology: true },
    function (err, client) {
      if (err) {
        return res.status(500).send({
          message: "error - internal server error: cannot connect to database",
        });
      }
      var dbo = client.db("movies");
      // Define a filter query
      var query = { _id: userId };

      dbo.collection("watchlist").findOne(query, function (err, mongoRes) {
        if (err) {
          return res
            .status(500)
            .send({ message: "error - internal server error: cannot fetch" });
        }
        var movieList = mongoRes.movieList;
        for (const movie of movieList) {
          if (movie.id === id) {
            return res.status(200).send(movie);
          }
        }
        return res.status(200).send({});
      });
    }
  );
};
```