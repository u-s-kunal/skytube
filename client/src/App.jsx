import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Home from "./pages/Home.jsx";
import Watch from "./pages/Watch.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Channel from "./pages/Channel.jsx";
import LikedVideos from "./pages/LikedVideos.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import Playlists from "./pages/Playlists.jsx";
import PlaylistDetails from "./pages/PlaylistDetails.jsx";
import Tweets from "./pages/Tweets.jsx";

import MainLayout from "./layouts/MainLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==============================
            AUTH LAYOUT
            Navbar only
        ============================== */}

        <Route element={<AuthLayout />}>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

        </Route>

        {/* ==============================
            MAIN APPLICATION
            Navbar + Sidebar
        ============================== */}

        <Route element={<MainLayout />}>

          {/* Public */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/watch/:videoId"
            element={<Watch />}
          />

          <Route
            path="/playlists"
            element={<Playlists />}
          />

          <Route
            path="/playlists/:playlistId"
            element={<PlaylistDetails />}
          />

          <Route
            path="/tweets"
            element={<Tweets />}
          />

          {/* Protected */}

          <Route element={<ProtectedRoute />}>

            <Route
              path="/channel/:username"
              element={<Channel />}
            />

            <Route
              path="/liked-videos"
              element={<LikedVideos />}
            />

            <Route
              path="/subscriptions"
              element={<Subscriptions />}
            />

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;