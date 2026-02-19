import React, { useState, useEffect, useRef, useContext } from "react";
import "./Trash.css";
import { MdOutlineStickyNote2, MdDelete } from "react-icons/md";
import { SearchContext } from "../../../SearchContext";

function Trash() {
  const [trash, setTrash] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: "", desc: "" });
  const menuBtnRef = useRef(null);
  const { searchQuery } = useContext(SearchContext);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("notes");
      if (saved) {
        const allNotes = JSON.parse(saved);
        setTrash(allNotes.filter(n => n.isDeleted));
      }
    } catch (e) {
      setTrash([]);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      try {
        const saved = localStorage.getItem("notes");
        const allNotes = saved ? JSON.parse(saved) : [];
        setTrash(allNotes.filter(n => n.isDeleted));
      } catch (e) {
        setTrash([]);
      }
    };
    window.addEventListener("notesUpdated", handler);
    return () => window.removeEventListener("notesUpdated", handler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuOpen !== null &&
        !e.target.closest(".note_menu") &&
        !e.target.closest(".menu_btn")
      ) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  const restoreNote = (id) => {
    const allNotes = JSON.parse(localStorage.getItem("notes"));
    const updated = allNotes.map((n) =>
      n.id === id ? { ...n, isDeleted: false } : n
    );
    localStorage.setItem("notes", JSON.stringify(updated));
    setTrash(updated.filter(n => n.isDeleted));
    setMenuOpen(null);
    window.dispatchEvent(new Event("notesUpdated"));
  };

  const permanentlyDeleteNote = (id) => {
    const allNotes = JSON.parse(localStorage.getItem("notes"));
    const updated = allNotes.filter(n => n.id !== id);
    localStorage.setItem("notes", JSON.stringify(updated));
    setTrash(updated.filter(n => n.isDeleted));
    setMenuOpen(null);
    window.dispatchEvent(new Event("notesUpdated"));
  };

  const handleMenuClick = (e, noteId) => {
    if (menuOpen === noteId) {
      setMenuOpen(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 8,
      left: rect.right - 120,
    });
    setMenuOpen(noteId);
  };

  const handleCardClick = (e, note) => {
    if (e.target.closest(".menu_btn") || e.target.closest(".note_menu") || e.target.closest(".fav_btn")) {
      return;
    }
  };

  return (
    <div>
      {trash.length === 0 ? (
        <div className="empty">
          <MdOutlineStickyNote2 className="sticky_icon" />
          <h2>No deleted notes</h2>
          <p>Deleted notes will appear here.</p>
        </div>
      ) : (
        <div className="notes_list">
          {trash
            .filter(n => 
              n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              n.desc.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((n) => (
            <div
              key={n.id}
              className="note_card"
              onClick={(e) => handleCardClick(e, n)}
            >
              <div className="note_card_body">
                <div className="note_card_top">
                  <h3>{n.title || "Untitled"}</h3>
                </div>

                <p className="note_desc">{n.desc}</p>

                <button
                  className="menu_btn"
                  ref={menuBtnRef}
                  onClick={(e) => handleMenuClick(e, n.id)}
                  aria-label="More options"
                >
                  ⋯
                </button>
              </div>
            </div>
          ))}

          {menuOpen && (
            <div
              className="note_menu"
              style={{
                top: `${menuPos.top}px`,
                left: `${menuPos.left}px`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="menu_item"
                onClick={() => {
                  const noteId = menuOpen;
                  restoreNote(noteId);
                }}
              >
                <span>Restore</span>
              </button>
              <button
                className="menu_item delete"
                onClick={() => {
                  const noteId = menuOpen;
                  permanentlyDeleteNote(noteId);
                }}
              >
                <MdDelete />
                <span>Delete Permanently</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Trash;
