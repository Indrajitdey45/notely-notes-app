import React from "react";
import "./Maincont.css";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { Routes, Route } from "react-router-dom";
import Notes from "./Notes/Notes";
import Favorites from "./Favorites/Favorites";
import Archived from "./Archived/Archived";
import Trash from "./Trash/Trash";

const Maincont = () => {
  return (
    <div className="main_content">
      <Routes>
        <Route path="/" element={<Notes />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/archived" element={<Archived />} />
        <Route path="/trash" element={<Trash />} />

      </Routes>
    </div>
  );
};

export default Maincont;
