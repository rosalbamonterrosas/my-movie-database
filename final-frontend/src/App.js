import { useEffect, useContext } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Top250Movies from "./pages/Top250Movies";
import MovieDetails from "./pages/MovieDetails";
import Watchlist from "./pages/Watchlist";
import SearchMovie from "./pages/SearchMovie";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import { auth } from "./firebase";
import { AppContext } from "./context/store";

function App() {
  const { setUser } = useContext(AppContext);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, [setUser]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" exact element={<Login />} />
            <Route path="/top250movies" element={<Top250Movies />} />
            <Route path="/movie-details" element={<MovieDetails />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/search" element={<SearchMovie />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
