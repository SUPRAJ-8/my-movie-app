import React from "react";
import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">🎬 MOVI.PK</div>
      <nav className="nav">
        <a href="#">Bollywood Movies</a>
        <a href="#">Hollywood</a>
        <a href="#">Web Series</a>
        <a href="#">Genre</a>
      </nav>
      <input className="search" type="text" placeholder="Search.." />
    </header>
  );
}

export default Header;
