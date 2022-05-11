import { Circle as CircleIcon } from "@mui/icons-material";
import {
  CircularProgress,
  Divider,
  Modal,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
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

async function getImages(id) {
  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}/images?api_key=${process.env.REACT_APP_API_KEY}`
  );
  return res.data;
}

async function getVideos(id) {
  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
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
  var hours = num / 60;
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);
  return rhours + "h " + rminutes + "m";
}

const MovieDetail = () => {
  const [movie, setMovie] = useState(null);
  const [crews, setCrews] = useState(null);
  const [cast, setCast] = useState(null);
  const [backdrops, setBackdrops] = useState(null);
  const [posters, setPosters] = useState(null);
  const [videos, setVideos] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const path = useLocation().pathname;
  const id = path.substring(7, path.length);
  const rating = movie?.vote_average * 10;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    getMovie(id)
      .then((res) => setMovie(res))
      .catch((err) => alert(err));
    getCredits(id)
      .then((res) => {
        setCrews(res?.crew?.slice(0, 5));
        setCast(res?.cast?.slice(0, 7));
      })
      .catch((err) => alert(err));
    getImages(id)
      .then((res) => {
        setBackdrops(res?.backdrops?.slice(0, 5));
        setPosters(res?.posters?.slice(0, 5));
      })
      .catch((err) => alert(err));
    getVideos(id)
      .then((res) =>
        setVideos(
          res?.results?.map((v) => v.site === "YouTube" && v).slice(0, 5)
        )
      )
      .catch((err) => alert(err));
  }, []);

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
            className="h-auto min-h-max xl:max-h-[48rem] absolute 2xl:right-1/2 2xl:translate-x-1/2 md:right-0 xl:right-0 blur-sm opacity-30 transition group-hover:opacity-70 group-hover:blur-0"
            src={`https://www.themoviedb.org/t/p/original${movie?.backdrop_path}`}
            alt="cover"
          />
          <div
            className={`relative w-full max-w-7xl mx-auto mt-6 bg-opacity-10 bg-no-repeat bg-cover bg-right-top flex md:flex-row flex-col items-center gap-x-2`}
          >
            <img
              className="relative w-80 p-2 bg-zinc-700"
              src={`https://www.themoviedb.org/t/p/w500${movie?.poster_path}`}
              alt="poster"
            />
            <div className="relative bg-zinc-800 bg-opacity-30 group-hover:bg-opacity-60 transition min-h-fit text-white p-5">
              <div className="flex flex-col gap-y-2">
                <h2 className="text-4xl font-bold">
                  {movie?.title}{" "}
                  <span className="font-normal text-gray-400 tracking-tight">
                    ({movie?.release_date.substring(0, 4)})
                  </span>
                </h2>
                <div className="flex items-center justify-start ">
                  <span className="text-sm shrink-0">
                    {movie?.release_date}
                  </span>
                  <CircleIcon sx={{ fontSize: "8px" }} className="mx-2" />
                  <div className="text-sm flex flex-wrap gap-y-1">
                    {movie?.genres.map((genre, i) => (
                      <button
                        className="bg-gray-400 bg-opacity-60 shrink-0 rounded-full px-2 mx-0.5 scale-95 hover:scale-100 transition"
                        key={i}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                  <CircleIcon sx={{ fontSize: "8px" }} className="mx-2" />
                  <span className="text-sm shrink-0">
                    {timeConvert(movie?.runtime)}
                  </span>
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
                <h4 className="text-lg font-semibold my-1">Overview</h4>
                <p className="text-sm leading-2">{movie?.overview}</p>
                <div className="grid grid-cols-3 w-full mt-2 gap-2">
                  {crews?.map((crew) => (
                    <div className="flex flex-col">
                      <h5 className="font-semibold">{crew.name}</h5>
                      <span>{crew.job}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full bg-zinc-700 min-h-[24rem]">
          <div className="-translate-y-4 bg-zinc-100 p-5 flex max-w-7xl mx-auto">
            <div className="w-full flex flex-col gap-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Top Billed Cast</h3>
                <Link
                  className="font-semibold text-sm text-blue-500 hover:bg-blue-100 p-2"
                  to={`/cast/${movie?.id}`}
                >
                  See all cast
                </Link>
              </div>
              <div className="flex w-full gap-x-2 px-4 overflow-x-auto">
                {cast?.map((castItem) => (
                  <Link
                    to={`/person/${castItem.id}`}
                    className="hover:opacity-80 transition h-auto w-full min-w-[7rem] border border-gray-300 rounded-xl shadow"
                  >
                    <img
                      className="w-full max-h-28 md:max-h-52 object-cover origin-top rounded-t-xl"
                      src={
                        castItem.profile_path
                          ? `https://www.themoviedb.org/t/p/w500${castItem.profile_path}`
                          : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                      }
                      alt="profile"
                    />
                    <div className="w-full p-2 overflow-hidden">
                      <strong className="block font-semibold">
                        {castItem.name}
                      </strong>
                      <span>{castItem.character}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <Divider className="!my-4" />
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Media</h3>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="basic tabs example"
                >
                  <Tab className="!text-xs !p-1" label="Videos" id="tab-0" />
                  <Tab className="!text-xs !p-1" label="Backdrops" id="tab-1" />
                  <Tab className="!text-xs !p-1" label="Posters" id="tab-2" />
                </Tabs>
              </div>
              <TabPanel value={tabValue} index={0}>
                <div className="flex w-full gap-x-2 px-4 overflow-x-auto">
                  {videos?.map((video) => (
                    <>
                      <img
                        className="w-full max-h-24 md:max-h-52 object-cover rounded-xl cursor-pointer hover:opacity-80 transition"
                        src="https://martialartspasadenantc.com/wp-content/uploads/sites/185/2015/12/video-placeholder.png"
                        alt="video"
                        onClick={openModal}
                      />
                      <Modal open={modalOpen} onClose={closeModal}>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white w-3/4 h-3/4">
                          <ReactPlayer
                            url={`https://www.youtube.com/watch?v=${video.key}`}
                            width="100%"
                            height="100%"
                          />
                        </div>
                      </Modal>
                    </>
                  ))}
                </div>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <div className="flex w-full gap-x-2 px-4 overflow-x-auto">
                  {backdrops?.map((backdrop) => (
                    <a
                      href={`https://www.themoviedb.org/t/p/w500${backdrop.file_path}`}
                      target="_blank"
                      className="hover:opacity-80 transition h-auto w-full min-w-[7rem] border border-gray-300 rounded-xl shadow"
                    >
                      <img
                        className="w-full max-h-52 md:max-h-72 object-cover origin-top rounded-xl"
                        src={`https://www.themoviedb.org/t/p/w500${backdrop.file_path}`}
                        alt="backdrop"
                      />
                    </a>
                  ))}
                </div>
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <div className="flex w-full gap-x-2 px-4 overflow-x-auto">
                  {posters?.map((poster) => (
                    <a
                      href={`https://www.themoviedb.org/t/p/w500${poster.file_path}`}
                      target="_blank"
                      className="hover:opacity-80 transition h-auto w-full min-w-[7rem] border border-gray-300 rounded-xl shadow"
                    >
                      <img
                        className="w-full max-h-52 md:max-h-72 object-cover origin-top rounded-xl"
                        src={`https://www.themoviedb.org/t/p/w500${poster.file_path}`}
                        alt="poster"
                      />
                    </a>
                  ))}
                </div>
              </TabPanel>
              <div className="w-full flex items-center justify-end">
                <Link
                  className="font-semibold text-sm text-blue-500 hover:bg-blue-100 p-2"
                  to={`/media/${
                    tabValue === 0
                      ? "video"
                      : tabValue === 1
                      ? "backdrop"
                      : "poster"
                  }/${movie?.id}`}
                >
                  See all{" "}
                  {tabValue === 0
                    ? "videos"
                    : tabValue === 1
                    ? "backdrops"
                    : "posters"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default MovieDetail;
