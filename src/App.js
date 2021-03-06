import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";
import "./index.css";
import NotFound from "./components/NotFound";
import Home from "./views/Home";
import MovieDetail from "./views/MovieDetail";
import PersonDetail from "./views/PersonDetail";

function App() {
  return (
    <Router>
      <main className="min-h-screen pb-3 bg-zinc-700">
        <div className="w-full bg-zinc-800 text-white font-extrabold text-3xl p-6 mb-4 shadow-lg">
          <div className="max-w-6xl flex flex-col md:flex-row gap-y-2 justify-between items-center mx-auto">
            <NavLink to="/">wMovies</NavLink>
            <input
              placeholder="Search..."
              className="p-2 text-base rounded-md focus:ring-2 outline-none ring-zinc-400 focus:ring-offset-1 ring-offset-zinc-800 transition text-zinc-800"
            />
          </div>
        </div>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/movie/:id" element={<MovieDetail />} />
          <Route exact path="/actor/:id" element={<PersonDetail />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
