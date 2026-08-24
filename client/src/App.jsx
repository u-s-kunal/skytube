import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css"
import Home from "./pages/Home.jsx";
import Watch from "./pages/Watch.jsx";
import MainLayout from "./layouts/MainLayout.jsx";

import "./App.css";

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;