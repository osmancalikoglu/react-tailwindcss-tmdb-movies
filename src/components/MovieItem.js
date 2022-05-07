import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import StarIcon from "@mui/icons-material/Star";
import React from "react";
import { Link } from "react-router-dom";

const MovieItem = ({ movie }) => {
  const release_date = new Date(movie.release_date);
  const rating = movie.vote_average * 10;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      className={
        "relative w-56 shadow-md bg-neutral-600 text-white p-1.5 cursor-pointer hover:scale-105 transition opacity-80 hover:opacity-100 group"
      }
    >
      <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center bg-gray-100">
        <IconButton
          id="customized-button"
          aria-controls={open ? "customized-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <MoreVertIcon className="rotate-90" fontSize="small" />
        </IconButton>
        <Menu
          elevation={0}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          MenuListProps={{
            "aria-labelledby": "customized-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            className="!text-sm gap-x-2"
            onClick={handleClose}
            disableRipple
          >
            <FavoriteIcon fontSize={"16"} />
            Favorite
          </MenuItem>
          <Divider />
          <MenuItem
            className="!text-sm gap-x-2"
            onClick={handleClose}
            disableRipple
          >
            <BookmarkIcon fontSize="16" />
            Watchlist
          </MenuItem>
          <Divider />
          <MenuItem
            className="!text-sm gap-x-2"
            onClick={handleClose}
            disableRipple
          >
            <StarIcon fontSize="16" />
            Your rating
          </MenuItem>
        </Menu>
      </div>
      <div className="absolute -top-2 -left-2 h-12 w-12 rounded-full bg-black flex items-center justify-center text-gray-700">
        <CircularProgress
          className="absolute z-0"
          variant="determinate"
          value={100}
          size={42}
          color="inherit"
        />
        <CircularProgress
          className="absolute z-10"
          variant="determinate"
          value={rating}
          color={`${
            rating < 50 ? "error" : rating < 70 ? "warning" : "success"
          }`}
          size={42}
        />
        <span className="text-sm font-semibold text-white">
          {rating}
          <span className="text-[0.7rem]">%</span>
        </span>
      </div>
      <Link to={`/movie/${movie.id}`}>
        <img
          src={`https://www.themoviedb.org/t/p/w500${movie.poster_path}`}
          alt="poster"
        />
        <h3 className="font-semibold">{movie.title}</h3>
        <h6 className="text-sm text-gray-100">
          {release_date.toDateString().substring(4, 15)}
        </h6>
      </Link>
    </div>
  );
};

export default MovieItem;
