import React, { useState, useContext } from "react";
import "./Topnav.css";
import Popup from "../Maincont/Popup/Popup";
import { SearchContext } from "../../SearchContext";

const Topnav = () => {
  const [openModel, setOpenModel] = useState(false);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  return (
    <div className="top_nav">
      <a href="/"  className="logo">
        <h1>Notely</h1>
      </a>

      <div className="search_box">
        <input
          type="text"
          className="search"
          placeholder="Search notes.."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <svg
          className="search_icon"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 21l-4.35-4.35"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="11"
            cy="11"
            r="6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <button
        className="cssbuttons-io-button"
        onClick={() => setOpenModel(true)}
      >
        <svg
          height="24"
          width="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
            fill="currentColor"
          ></path>
        </svg>
        <span>Add</span>
      </button>
      {openModel && <Popup openModel={openModel} setOpenModel={setOpenModel} />}
    </div>
  );
};

export default Topnav;
