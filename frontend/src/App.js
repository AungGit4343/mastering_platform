import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Jobs from "./pages/Jobs";
import PostJob from "./pages/PostJob";
import "./styles/main.css";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/post" element={<PostJob />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;