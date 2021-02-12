import React,{useState,useEffect} from 'react'
import YouTube from "react-youtube";
import MovieTrailer from "movie-trailer";
import "./Row.css"
import axios from "./axios"
const base_url="https://image.tmdb.org/t/p/original/"
const Row = ({ title, fetchUrl , isLargeRow}) => {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl]=useState("")
    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            // console.log(request)
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);
    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        }
        
    }
    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl("")
        } else {
            MovieTrailer(movie?.title || movie?.name || movie.original_name)
                .then((url) => {
                    const urlparams = new URLSearchParams(new URL(url).search);
                    setTrailerUrl(urlparams.get("v"));
                })
                .catch((error) => console.log(error));
        }
    }
    return (
        <div className="row">
            <h1>{title}</h1>
            <div className="row__posters">
            {movies.map((movie) => ( 
                <img
                    onClick={()=> handleClick(movie)}
                    className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                    src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path }`}
                    alt={movie.name}/>
            ))}
            </div>
                <div style={{ padding: "40px" }}>
                {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}

                </div>
        </div>
    )
}

export default Row