import { useEffect, useState } from "react";
import Search from "./components/Search";
import "./index.css";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [debouncedSearchTerm,setDebouncedSearchTerm] = useState('')
  useDebounce(() =>setDebouncedSearchTerm(searchTerm),500,[searchTerm])
  const fetchMovies = async (query='') => {
    setLoader(true);
    setErrorMessage("");
    try {
      const apiEndPoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` 
      :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(apiEndPoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      if (data.response === "False") {
        setErrorMessage(data.error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
      console.log(data);
    } catch (error) {
      console.error(error);
      setErrorMessage("Error In Fetching Movies Please Try Again Later");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> you will enjoy
            without hustle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          {loader ? (
           <Spinner/>
          ) : errorMessage ? (
            <p>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie}/>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
