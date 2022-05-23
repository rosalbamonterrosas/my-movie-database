require("dotenv").config();
const fetch = require("node-fetch");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const MongoClient = require("mongodb").MongoClient;
var uri = "mongodb://127.0.0.1:27017/";
const imdbApiKey = process.env.IMDB_API_KEY;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./public"));

const admin = require("firebase-admin");
const serviceAccount = require("./firebase-adminsdk.json");

/**
 * Initialize the credentail
 */
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Authorization"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

/**
 * Check whether the authorization token is legit
 * @param {*} req the request
 * @param {*} res the response of the request
 * @param {*} next pass to next layer of middleware
 */
function checkAuth(req, res, next) {
  function throwAuthError(message, status = 403) {
    res.status(status).send({ message: "Auth Error: " + message });
  }
  if (!req.headers.authorization) {
    return throwAuthError("Missing authorization header", 401);
  }
  let token = req.headers.authorization.split('Bearer ')[1];
  if (!token) {
    return throwAuthError("Invalid ID token", 401);
  }
  admin.auth()
    .verifyIdToken(token)
    .then((decoded) => {
      // attach auth info to request:
      req.user = decoded;

      // continue on
      next();
    })
    .catch((err) => {
      console.log(err.message);
      throwAuthError("Invalid ID token", 403);
    });
}

/**
 * Get the details of a movie using the imdb id
 */
app.get("/movies/:id", checkAuth, function (req, res) {
  var id = req.params.id;
  return getMovie(id, res);
});

/**
 * Call the Title IMDB api to get more information about a movie
 * @param {*} id imdb id
 * @param {*} res the response of the request
 */
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

/**
 * Search movies using the expression provided by the user
 */
app.get("/movies", checkAuth, function (req, res) {
  var expression = req.query.expression;
  return searchMovies(expression, res);
});

/**
 * Call the SearchMovie IMDB api to search movies using an expression
 * @param {*} expression input provided by the user to search movies
 * @param {*} res the response of the request
 */
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

/**
 * Get the top 250 movies
 */
app.get("/top-movies", checkAuth, function (req, res) {
  return getTopMovies(res);
});

/**
 * Call the Top250Movies IMDB api to get the top 250 movies.
 * @param {*} res the response of the request
 */
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

/**
 * Get the trailer of a movie using the imdb id
 */
app.get("/trailer/:id", checkAuth, function (req, res) {
  var id = req.params.id;
  return getTrailer(id, res);
});

/**
 * Call the Trailer IMDB api to get the trailer of a movie using the imdb id
 * @param {*} id imdb id
 * @param {*} res the response of the request
 */
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

/**
 * Create and insert a user's initial watchlist into the database when the
 * user logs in for the first time
 */
app.post("/watchlist", checkAuth, function (req, res) {
  return createWatchlist(req, res);
});

/**
 * Connect to the MongoClient and creates an initial watchlist object for a 
 * user. The watchlist object is then inserted into the database.
 * @param {*} req the request
 * @param {*} res the response of the request
 */
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

/**
 * Insert a new watch list. This function first check whether the user Id 
 * contained in obj already exists in the "watchlist" collection. If it does, 
 * then we do nothing. Otherwise, we create a new watchlist.
 * @param {*} obj watchlist object containing the userId and movieList
 * @param {*} dbo database in MongoDB
 * @param {*} client MongoClient that allows for connection to MongoDB
 * @param {*} res the response of the request
 */
const insertWatchlistObj = (obj, dbo, client, res) => {
  const query = { _id: obj._id};
  dbo.collection("watchlist").findOne(query, function (err, mongoRes) {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .send({ message: "error - internal server error: cannot create watchlist" });
    }
    if (!mongoRes) {
      dbo.collection("watchlist").insertOne(obj, function (err, mongoRes) {
        if (err) {
          return res
            .status(500)
            .send({
              message: "error - internal server error: cannot create watchlist",
            });
        }
        client.close();
        return res.status(200).send({_id: obj._id, message: 'successfully created'});
      });
    } else {
      client.close();
      return res.status(200).send({_id: obj._id, message: 'watchlist already exists'});
    }
  });
};

/**
 * Create a watchlist object containing the user Id and an empty movieList
 * @param {*} userId the unique id of a user
 */
const createWatchlistObj = (userId) => {
  var obj = {};
  obj._id = userId;
  obj.movieList = [];
  return obj;
};

/**
 * Create an object for an element of the movieList containing movie 
 * information using the request body. 
 * @param {*} req the request
 */
const createMovieListObj = (req) => {
  var obj = {};
  obj.id = req.body.id;
  obj.image = req.body.image;
  obj.fullTitle = req.body.fullTitle;
  obj.runtimeStr = req.body.runtimeStr;
  obj.genres = req.body.genres;
  obj.imDbRating = req.body.imDbRating;
  obj.metacriticRating = req.body.metacriticRating;
  obj.boxOffice = req.body.boxOffice;
  obj.contentRating = req.body.contentRating;
  obj.plot = req.body.plot;

  return obj;
};

/**
 * Add a movie to a user's watchlist
 */
app.put("/watchlist/add", checkAuth, function (req, res) {
  var userId = req.user.uid;
  var movieListObj = createMovieListObj(req);
  return addMovie(userId, movieListObj, res);
});

/**
 * Connect to the MongoClient, find the user in the database, and add the new
 * movieList object into the user's movieList.
 * @param {*} userId the unique id of a user
 * @param {*} movieListObj object inside a user's movieList containing 
 * information about a movie
 * @param {*} res the response of the request
 */
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

/**
 * Delete a movie from a user's watchlist using the imdb id
 */
app.put("/watchlist/delete", checkAuth, function (req, res) {
  var userId = req.user.uid;
  var id = req.body.id;
  return deleteMovie(userId, id, res);
});

/**
 * Connect to the MongoClient, find the user in the database, and delete the
 * movieList object from the user's movieList using the imdb id.
 * @param {*} userId the unique id of a user
 * @param {*} id imdb id
 * @param {*} res the response of the request
 */
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

/**
 * Get the movies in a user's watchlist
 */
app.get("/watchlist", checkAuth, function (req, res) {
  var userId = req.user.uid;
  return getWatchlist(userId, res);
});

/**
 * Connect to the MongoClient, find the user in the database, and get the
 * movieList objects from the user's movieList.
 * @param {*} userId the unique id of a user
 * @param {*} res the response of the request
 */
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

/**
 * Get a movie from a user's watchlist
 */
app.get("/watchlist/:id", checkAuth, function (req, res) {
  const userId = req.user.uid;
  const id = req.params.id;
  return queryWatchlist(userId, id, res);
});

/**
 * Connect to the MongoClient, find the user in the database, and query a 
 * movie in user's watchlist. If the movie is found in the watchlist, return 
 * the movie object. Otherwise, return an empty object.
 * @param {*} userId the unique id of a user
 * @param {*} id imdb id
 * @param {*} res the response of the request
 */
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


app.listen(5678); //start the server
console.log("Server is running at http://localhost:5678");
