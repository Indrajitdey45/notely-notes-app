import React, { useState, useEffect } from 'react'
import './Sidenav.css'
import { Link, useLocation } from 'react-router-dom'
import { TbNotes } from "react-icons/tb";
import { IoMdStar } from "react-icons/io";
import { PiArchiveDuotone } from "react-icons/pi";
import { FaTrashAlt } from "react-icons/fa";



const Sidenav = () => {
  const location = useLocation();
  const [counts, setCounts] = useState({
    all: 0,
    favorites: 0,
    archived: 0,
    trash: 0
  });

  useEffect(() => {
    const updateCounts = () => {
      try {
        const saved = localStorage.getItem("notes");
        const notes = saved ? JSON.parse(saved) : [];
        
        setCounts({
          all: notes.filter(n => !n.isArchived && !n.isDeleted).length,
          favorites: notes.filter(n => n.isFavorite && !n.isDeleted).length,
          archived: notes.filter(n => n.isArchived && !n.isDeleted).length,
          trash: notes.filter(n => n.isDeleted).length
        });
      } catch (e) {
        setCounts({ all: 0, favorites: 0, archived: 0, trash: 0 });
      }
    };

    updateCounts();
    window.addEventListener("notesUpdated", updateCounts);
    return () => window.removeEventListener("notesUpdated", updateCounts);
  }, []);

  return (
    <div className="side_nav">
      <Link to="/" className="options">
        <div className={`opt ${location.pathname === '/' ? 'active' : ''}`}>
          <TbNotes />
          <p>All Notes {counts.all > 0 && <span className="count">{counts.all}</span>}</p>
        </div>
      </Link>
      <Link to="/favorites" className="options">
        <div className={`opt ${location.pathname === '/favorites' ? 'active' : ''}`}>
          <IoMdStar />
          <p>Favorites {counts.favorites > 0 && <span className="count">{counts.favorites}</span>}</p>
        </div>
      </Link>
      <Link to="/archived" className="options">
        <div className={`opt ${location.pathname === '/archived' ? 'active' : ''}`}>
          <PiArchiveDuotone />
          <p>Archived {counts.archived > 0 && <span className="count">{counts.archived}</span>}</p>
        </div>
      </Link>
      <Link to="/trash" className="options">
        <div className={`opt ${location.pathname === '/trash' ? 'active' : ''}`}>
          <FaTrashAlt />
          <p>Trash {counts.trash > 0 && <span className="count">{counts.trash}</span>}</p>
        </div>
      </Link>
    </div>
  )
}

export default Sidenav