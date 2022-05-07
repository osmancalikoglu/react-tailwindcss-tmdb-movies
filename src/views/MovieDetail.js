import { TabPanelUnstyled } from "@mui/base";
import { Circle as CircleIcon } from "@mui/icons-material";
import { CircularProgress, Divider, Tab, Tabs, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Loading from "../components/Loading";


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

async function getMovie(id) {
  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
  );
  return res.data;
}

async function getCredits(id) {
  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
  );
  return res.data;
}

function timeConvert(n) {
  var num = n;
  var hours = (num / 60);
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);
  return rhours + "h " + rminutes + "m";
  }

const MovieDetail = () => {
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const path = useLocation().pathname;
  const id = path.substring(7, path.length);
  const rating = movie?.vote_average * 10;

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    getMovie(id)
      .then((res) => setMovie(res))
      .catch((err) => alert(err));
    getCredits(id)
      .then((res) => setCredits(res))
      .catch((err) => alert(err));
  }, []);

  let crews = credits?.crew?.slice(0, 5);
  let crewGroup = crews?.reduce((r, a) => {
    r[a.id] = [...r[a.id] || [], a];
    return r;
  }, []);
  let cast = credits?.cast?.slice(0, 7);
  console.log(cast);

  if (movie === null || !movie || movie.lenght === 0) {
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
    <div className="max-h-screen">
      <div className="flex w-full group pb-10 overflow-hidden bg-zinc-700">
        <img
          className="h-auto max-h-screen min-h-max xl:max-h-[48rem] absolute 2xl:right-1/2 2xl:translate-x-1/2 md:right-0 xl:right-0 blur-sm opacity-30 transition group-hover:opacity-70 group-hover:blur-0"
          src={`https://www.themoviedb.org/t/p/original${movie?.backdrop_path}`}
          alt="cover"
        />
        <div
          className={`relative md:flex-row flex-col w-full max-w-7xl mx-auto mt-6 bg-opacity-10 bg-no-repeat bg-cover bg-right-top flex items-center gap-x-2`}
        >
          <img
            className="relative w-80 p-2 bg-zinc-700"
            src={`https://www.themoviedb.org/t/p/w500${movie?.poster_path}`}
            alt="poster"
          />
          <div className="relative bg-zinc-800 bg-opacity-30 group-hover:bg-opacity-60 transition min-h-fit max-h-[32rem] text-white p-5">
            <div className="flex flex-col gap-y-2">
              <h2 className="text-4xl font-bold">
                {movie?.title}{" "}
                <span className="font-normal text-gray-400 tracking-tight">
                  ({movie?.release_date.substring(0, 4)})
                </span>
              </h2>
              <div className="flex items-center justify-start">
                <span className="text-sm">{movie?.release_date}</span>
                <CircleIcon sx={{ fontSize: "8px" }} className="mx-2" />
                <span className="text-sm">{movie?.genres.map((genre, i) => (<a href="#" className="bg-gray-400 bg-opacity-60 rounded-full px-2 mx-0.5 scale-95 hover:scale-100 transition" key={i}>{genre.name}</a>))}</span>
                <CircleIcon sx={{ fontSize: "8px" }} className="mx-2" />
                <span className="text-sm">{timeConvert(movie?.runtime)}</span>
              </div>
            </div>
            <div className="absolute mt-4 h-20 w-20 rounded-full bg-black flex items-center justify-center text-gray-700 cursor-pointer">
              <CircularProgress
                className="absolute z-0"
                variant="determinate"
                value={100}
                size={72}
                color="inherit"
              />
              <CircularProgress
                className="absolute z-10"
                variant="determinate"
                value={rating}
                color={`${
                  rating < 50 ? "error" : rating < 70 ? "warning" : "success"
                }`}
                size={72}
              />
              <span className="text-2xl font-semibold text-white">
                {rating}
                <span className="text-sm">%</span>
              </span>
            </div>
            <div className="mt-24">
              <h5 className="text-lg italic text-gray-300">
                {movie?.tagline}
              </h5>
              <h4 className="text-lg font-semibold my-1">
                Overview
              </h4>
              <p className="text-sm leading-2">
                {movie?.overview}
              </p>
              <div className="grid grid-cols-3 w-full mt-2">
                {
                  crewGroup?.map((crew) => (
                    <div className="flex flex-col">
                      <h5 className="font-semibold">
                        {crew[0].name}
                      </h5>
                      <span>
                        {crew[0].job}
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full bg-zinc-700 min-h-[24rem]">
        <div className="-translate-y-4 bg-white p-5 flex max-w-7xl mx-auto">
          <div className="w-full flex flex-col gap-y-2">
            <div className="flex items-center justify-between"><h3 className="text-2xl font-semibold">Top Billed Cast</h3><Link className="font-semibold text-sm text-blue-500 hover:bg-blue-100 p-2" to={`/cast/${movie?.id}`}>See all cast</Link></div>
            <div className="flex w-full gap-x-2 px-4">
                {
                  cast?.map((castItem) => (
                    <Link to={`/person/${castItem.id}`} className="hover:opacity-80 transition h-auto w-full border border-gray-300 rounded-xl shadow">
                      <img 
                        className="w-full max-h-48 object-cover origin-top rounded-t-xl"
                        src={`https://www.themoviedb.org/t/p/w500${castItem.profile_path}`} 
                        alt="profile" 
                      />
                      <div className="w-full p-2">
                        <strong className="block font-semibold">{castItem.name}</strong>
                        <span>{castItem.character}</span>
                      </div>
                    </Link>
                  ))
                }
            </div>
            <Divider className="!my-4" />
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Media</h3>
              <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Videos" id="tab-0" />
                <Tab label="Backdrops" id="tab-1" />
                <Tab label="Posters" id="tab-2" />
              </Tabs>
              <Link className="font-semibold text-sm text-blue-500 hover:bg-blue-100 p-2" to={`/media/${tabValue === 0 ? "video" : tabValue === 1 ? "backdrop" : "poster"}/${movie?.id}`}>See all {tabValue === 0 ? "videos" : tabValue === 1 ? "backdrops" : "posters"}</Link>
            </div>
            <div className="flex w-full gap-x-2 px-4">
              <TabPanel value={tabValue} index={0}>
                Item One
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                Item Two
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                Item Three
              </TabPanel>
              {/* {
                cast?.map((castItem) => (
                  <Link to={`/person/${castItem.id}`} className="hover:opacity-80 transition h-auto w-full border border-gray-300 rounded-xl shadow">
                    <img 
                      className="w-full max-h-48 object-cover origin-top rounded-t-xl"
                      src={`https://www.themoviedb.org/t/p/w500${castItem.profile_path}`} 
                      alt="profile" 
                    />
                    <div className="w-full p-2">
                      <strong className="block font-semibold">{castItem.name}</strong>
                      <span>{castItem.character}</span>
                    </div>
                  </Link>
                ))
              } */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  }
};

export default MovieDetail;
