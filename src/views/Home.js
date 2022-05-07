import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import MovieItem from "../components/MovieItem";

async function getMovies() {
  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`
  );
  return res.data.results;
}

const Home = () => {
  const [movies, setMovies] = useState(null);
  useEffect(() => {
    getMovies()
      .then((res) => setMovies(res))
      .catch((err) => alert(err));
  }, []);

  if (movies === null || !movies || movies.lenght === 0) {
    return (
      <>
        <div className="max-w-7xl min-h-screen mx-auto flex gap-4 flex-wrap justify-center opacity-5">
          <Loading />
        </div>
        <div className="fixed top-1/2 left-1/2 bg-slate-400 text-white w-64 h-16 -my-8 -mx-32 rounded-xl shadow-2xl drop-shadow-2xl z-10 flex items-center justify-evenly">
          <svg
            className="animate-spin h-10 w-10"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="font-semibold text-2xl">Loading...</span>
        </div>
      </>
    );
  } else {
    return (
      <div className="max-w-7xl mx-auto flex gap-4 flex-wrap justify-center transform transition duration-1000">
        {movies.map((movie, i) => (
          <MovieItem key={i} movie={movie} />
        ))}
      </div>
    );
  }
};

export default Home;
