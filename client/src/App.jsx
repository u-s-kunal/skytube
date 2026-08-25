import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home.jsx";
import Watch from "./pages/Watch.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Channel from "./pages/Channel.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LikedVideos from "./pages/LikedVideos.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/watch/:videoId"
            element={<Watch />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/login"
            element={<Login />}
          />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/channel/:username"
              element={<Channel />}
            />
            <Route
              path="/liked-videos"
              element={<LikedVideos />}
            />

            {/* More protected pages will go here */}
          </Route>
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;