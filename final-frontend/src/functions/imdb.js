/**
 * Call the backend endpoint for getting the top 250 movies
 * @param {*} user user object of the currently signed-in user
 */
export const getIMDBTop250 = async (user) => {
  const idToken = await user.getIdToken(true);
  const res = await fetch(`http://localhost:5678/top-movies`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + idToken,
      "Content-Type": "application/json",
    },
  });
  if (res.status === 200) {
    const data = await res.json();
    return data.items;
  }
  throw Error(
    `Get top 250 movies failed. API return status ${res.status}`,
  )

  //Below is the mock data to be used for development purposes only

  // const mockData = [
  //   {
  //     id: "tt0111161",
  //     rank: "1",
  //     title: "The Shawshank Redemption",
  //     fullTitle: "The Shawshank Redemption (1994)",
  //     year: "1994",
  //     image:
  //       "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UX128_CR0,3,128,176_AL_.jpg",
  //     crew: "Frank Darabont (dir.), Tim Robbins, Morgan Freeman",
  //     imDbRating: "9.2",
  //     imDbRatingCount: "2580166",
  //   },
  //   {
  //     id: "tt0068646",
  //     rank: "2",
  //     title: "The Godfather",
  //     fullTitle: "The Godfather (1972)",
  //     year: "1972",
  //     image:
  //       "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UX128_CR0,1,128,176_AL_.jpg",
  //     crew: "Francis Ford Coppola (dir.), Marlon Brando, Al Pacino",
  //     imDbRating: "9.2",
  //     imDbRatingCount: "1776365",
  //   },
  //   {
  //     id: "tt0468569",
  //     rank: "3",
  //     title: "The Dark Knight",
  //     fullTitle: "The Dark Knight (2008)",
  //     year: "2008",
  //     image:
  //       "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_UX128_CR0,3,128,176_AL_.jpg",
  //     crew: "Christopher Nolan (dir.), Christian Bale, Heath Ledger",
  //     imDbRating: "9.0",
  //     imDbRatingCount: "2549206",
  //   },
  // ];
  // return mockData;
};

/**
 * Call the backend endpoint for getting the details of a movie given its id 
 * from IMDB
 * @param {*} user user object of the currently signed-in user
 * @param {*} id IMDB ID assigned to the movie
 */
export const getIMDBMovieDetail = async (user, id) => {
  const idToken = await user.getIdToken(true);
  const res = await fetch(`http://localhost:5678/movies/${id}`, {
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
  throw Error(
    `Get movie detail for ${id} failed. API return status ${res.status}`,
  )

  //Below is the mock data to be used for development purposes only

  // const mockData = [
  //   {
  //     id: "tt0111161",
  //     rank: "1",
  //     title: "The Shawshank Redemption",
  //     fullTitle: "The Shawshank Redemption (1994)",
  //     year: "1994",
  //     image:
  //       "https://imdb-api.com/images/original/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_Ratio0.6751_AL_.jpg",
  //     crew: "Frank Darabont (dir.), Tim Robbins, Morgan Freeman",
  //     imDbRating: "9.2",
  //     imDbRatingCount: "2580166",
  //     runtimeStr: "2h 22min",
  //     genres: "Drama",
  //     metacriticRating: "81",
  //     boxOffice: {
  //       budget: "$25,000,000 (estimated)",
  //       openingWeekendUSA: "$727,327",
  //       grossUSA: "$28,767,189",
  //       cumulativeWorldwideGross: "$28,884,504",
  //     },
  //     contentRating: "PG-13",
  //     plot: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  //   },
  //   {
  //     id: "tt0068646",
  //     rank: "2",
  //     title: "The Godfather",
  //     fullTitle: "The Godfather (1972)",
  //     year: "1972",
  //     image:
  //       "https://imdb-api.com/images/original/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_Ratio0.6751_AL_.jpg",
  //     crew: "Francis Ford Coppola (dir.), Marlon Brando, Al Pacino",
  //     imDbRating: "9.2",
  //     imDbRatingCount: "1776365",
  //     runtimeStr: "2h 22min",
  //     genres: "Crime, Drama",
  //     metacriticRating: "100",
  //     boxOffice: {
  //       budget: "$6,000,000 (estimated)",
  //       openingWeekendUSA: "$302,393",
  //       grossUSA: "$136,381,073",
  //       cumulativeWorldwideGross: "$250,341,816",
  //     },
  //     contentRating: "PG-13",
  //     plot: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  //   },
  //   {
  //     id: "tt0468569",
  //     rank: "3",
  //     title: "The Dark Knight",
  //     fullTitle: "The Dark Knight (2008)",
  //     year: "2008",
  //     image:
  //       "https://imdb-api.com/images/original/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_Ratio0.6751_AL_.jpg",
  //     crew: "Christopher Nolan (dir.), Christian Bale, Heath Ledger",
  //     imDbRating: "9.0",
  //     imDbRatingCount: "2549206",
  //     runtimeStr: "2h 22min",
  //     genres: "Drama",
  //     metacriticRating: "81",
  //     boxOffice: {
  //       budget: "$185,000,000 (estimated)",
  //       openingWeekendUSA: "$158,411,483",
  //       grossUSA: "$534,987,076",
  //       cumulativeWorldwideGross: "$1,006,102,277",
  //     },
  //     contentRating: "PG-13",
  //     plot: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  //   },
  // ];

  // for (const movie of mockData) {
  //   if (movie.id === id) {
  //     return movie;
  //   }
  // }
  // throw Error(`Get movie detail for ${id} failed. API return status 400`);
};

/**
 * Call the backend endpoint to get the link to the trailer of the specified 
 * movie imdb id.
 * @param {*} user user object of the currently signed-in user
 * @param {*} id IMDB ID assigned to the movie
 */
export const getIMDBTrailer = async (user, id) => {
  const idToken = await user.getIdToken(true);
  const res = await fetch(`http://localhost:5678/trailer/${id}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + idToken,
      "Content-Type": "application/json",
    },
  });
  if (res.status === 200) {
    const data = await res.json();
    var link = data.linkEmbed + "?autoplay=false";
    return link;
  }
  throw Error(`Get trailer for ${id} failed. API return status ${res.status}`);

  // //Below is the mock data to be used for development purposes only

  // return "https://www.imdb.com/video/imdb/vi3877612057/imdb/embed?autoplay=false";
};

/**
 * Call the backend endpoint to search IMDB given the parameters in params
 * @param {*} user user object of the currently signed-in user
 * @param {*} params an object {expression: search_query}.
 * this object is used to search IMDB API with the search_query.
 */
export const searchIMDB = async (user, params) => {
  const idToken = await user.getIdToken(true);
  const res = await fetch(`http://localhost:5678/movies/?${params}`, {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + idToken,
      "Content-Type": "application/json",
    },
  });
  if (res.status === 200) {
    const data = await res.json();
    return data;
  }
  throw Error(`Search movie on IMDB failed. API return status ${res.status}`);

  //Below is the mock data to be used for development purposes only
  
  // return {
  //   results: [
  //     {
  //       id: "tt0111161",
  //       rank: "1",
  //       title: "The Shawshank Redemption",
  //       fullTitle: "The Shawshank Redemption (1994)",
  //       description: "(1994)",
  //       image:
  //         "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UX128_CR0,3,128,176_AL_.jpg",
  //       crew: "Frank Darabont (dir.), Tim Robbins, Morgan Freeman",
  //       imDbRating: "9.2",
  //       imDbRatingCount: "2580166",
  //     },
  //     {
  //       id: "tt0068646",
  //       rank: "2",
  //       title: "The Godfather",
  //       fullTitle: "The Godfather (1972)",
  //       description: "(1972)",
  //       image:
  //         "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UX128_CR0,1,128,176_AL_.jpg",
  //       crew: "Francis Ford Coppola (dir.), Marlon Brando, Al Pacino",
  //       imDbRating: "9.2",
  //       imDbRatingCount: "1776365",
  //     },
  //     {
  //       id: "tt0468569",
  //       rank: "3",
  //       title: "The Dark Knight",
  //       fullTitle: "The Dark Knight (2008)",
  //       description: "(2008)",
  //       image:
  //         "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_UX128_CR0,3,128,176_AL_.jpg",
  //       crew: "Christopher Nolan (dir.), Christian Bale, Heath Ledger",
  //       imDbRating: "9.0",
  //       imDbRatingCount: "2549206",
  //     },
  //   ],
  //   message: "foo",
  // };
};
