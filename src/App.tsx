import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.scss";

import Home from "./Pages/Home/Home";
import Party from "./Pages/Party/Party";

import { socket } from "./socket.tsx";
import { useEffect } from "react";
import Host from "./Pages/PreLobby/Host.tsx";
import Join from "./Pages/PreLobby/Join.tsx";

function App() {

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/host" element={<Host />} />
          <Route path="/join/:gameId" element={<Join />} />
          <Route path="/party" element={<Navigate to="/" />} />
          <Route path="/party/:gameId" element={<Party />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
