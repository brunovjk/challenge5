import React from "react";
import "./App.css";
import { Home, Web3, SPL, CandyMachine, ErrorPage } from "./pages";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <h1 className="App-logo">Metacrafters Challenge4</h1>
          <div className="App-menu">
            <NavLink to="/" className="App-menu-item">
              Home
            </NavLink>
            <NavLink to="/solana-using-javascript" className="App-menu-item">
              Solana/Javascript
            </NavLink>
            <NavLink to="/minting-tokens-and-nfts" className="App-menu-item">
              Tokens and NFTs
            </NavLink>
            <NavLink to="/candy-machine" className="App-menu-item">
              CandyMachine
            </NavLink>
          </div>
        </header>

        <div className="App-body">
          <Routes>
            <Route path="/" element={<Home />} errorElement={<ErrorPage />} />
            <Route path="/solana-using-javascript" element={<Web3 />} />
            <Route path="/minting-tokens-and-nfts" element={<SPL />} />
            <Route path="/candy-machine" element={<CandyMachine />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
