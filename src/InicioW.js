import { useEffect } from 'react';
import axios from 'axios';
import './App2.css';
import { useState } from 'react';
import YouTube from 'react-youtube';
import Rating from 'react-rating-stars-component'; // Import the star rating component

import { useAuth } from "./context/AuthContext";

import firebase, { db } from './fb';
import 'firebase/firestore';
import { addDoc, collection } from 'firebase/firestore'; // Importa las funciones necesarias
import guardar from './guardar'; 

export function InicioW() {
  const { logout, user } = useAuth();
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

  const URL_IMAGE = "https://image.tmdb.org/t/p/original";

  console.log(user);
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error.message);
    }
  };

  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Cargando películas" });
  const [playing, setPlaying] = useState(false);
  const [watchlist, setWatchlist] = useState([]);

  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
        language: 'es',
      },
    });

    setMovies(results);
    setMovie(results[0]);

    if (results.length) {
      await fetchMovie(results[0].id);
    }
  };

  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
        language: 'es',
      },
    });

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Tráiler oficial"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }

    setMovie(data);
  };

  const selectMovie = async (movie) => {
    fetchMovie(movie.id);

    setMovie(movie);
    window.scrollTo(0, 0);
  };

  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const getAgeRating = (voteAverage) => {
    if (voteAverage >= 7.5) {
      return "PG-13";
    } else if (voteAverage >= 5) {
      return "PG";
    } else {
      return "G";
    }
  };

  const addToWatchlist = async () => {
    if (!watchlist.find((item) => item.id === movie.id)) {
      setWatchlist([...watchlist, movie]);
     
      // Save the movie to Firestore
     try {
      const docRef = await addDoc(collection(db, "watchlist"), {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
      });
      console.log("Movie added to Firestore with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding movie to Firestore: ", error);
    }
  }
  };

  const handleRatingChange = (newRating) => {
    // Handle the logic to save the rating for the selected movie
    // You can use the newRating value and the movie.id to store the rating in your preferred data structure or backend.
    // For simplicity, let's just log the rating to the console for now.
    console.log(`Movie ID: ${movie.id}, Rating: ${newRating}`);
  
  
  };

  return (
    <div className="container-fluid">
      <h2 className="text-center mt-5 mb-5">PELICULAS</h2>

      <form className="mb-4" onSubmit={searchMovies}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar"
            id='hist'
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <button className="btn btn-primary"onClick={guardar}>Buscar</button>
        </div>
      </form>

      <div>
        <main>
          {movie ? (
            <div className="viewtrailer" style={{ backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")` }}>
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer.key}
                    className="reproductor container"
                    containerClassName="youtube-container amru"
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="btn btn-light mt-3">
                    Cerrar
                  </button>
                </>
              ) : (
                <div className="container">
                  <div className="">
                    {trailer ? (
                      <button className="btn btn-primary mt-3" onClick={() => setPlaying(true)} type="button">
                        Ver Tráiler
                      </button>
                    ) : (
                      <p>Lo sentimos, no hay tráiler disponible</p>
                    )}
                    <h1 className="text-white">{movie.title}</h1>
                    <p className="text-white">{movie.overview}</p>
                    <p className="text-white">Clasificación por edades: {getAgeRating(movie.vote_average)}</p>
                    <button onClick={addToWatchlist} className="btn btn-primary mt-3">
                      Agregar a la lista de seguimiento
                    </button>
                    {/* Render the star rating component */}
                    <Rating
                      count={5} // Number of stars
                      size={24} // Size of the stars
                      onChange={handleRatingChange} // Callback function to handle rating changes
                      activeColor="#ffd700" // Color of the selected stars
                    />
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>

      <div className="row row-cols-1 row-cols-md-4 g-4 mt-3">
        {movies.map((movie) => (
          <div key={movie.id} className="col">
            <div className="card">
              <img
                src={`${URL_IMAGE + movie.poster_path}`}
                alt=""
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">{movie.overview}</p>
                <button className="btn btn-primary" onClick={() => selectMovie(movie)}>
                  Ver detalles
                </button>
                {/* Render the star rating component */}
                <Rating
                  count={5} // Number of stars
                  size={16} // Size of the stars
                  onChange={handleRatingChange} // Callback function to handle rating changes
                  activeColor="#ffd700" // Color of the selected stars
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="container mt-5">
        <h2>Lista de seguimiento</h2>
        <ul>
          {watchlist.map((movie) => (
            <li key={movie.id}>
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {movie.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <button
          className="bg-slate-200 hover:bg-slate-300 rounded py-2 px-4 text-black"
          onClick={handleLogout}
        >
          Cerrar sesion
        </button>
    </div>
  );
}
