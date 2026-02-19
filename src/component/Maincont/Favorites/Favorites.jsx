import React, { useState, useEffect, useRef, useContext } from "react";
import "./Favorites.css";
import { MdOutlineStickyNote2, MdDelete, MdArchive } from "react-icons/md";
import { IoMdStar } from "react-icons/io";
import { SearchContext } from "../../../SearchContext";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
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
        setFavorites(allNotes.filter(n => n.isFavorite && !n.isDeleted));
      }
    } catch (e) {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      try {
        const saved = localStorage.getItem("notes");
        const allNotes = saved ? JSON.parse(saved) : [];
        setFavorites(allNotes.filter(n => n.isFavorite && !n.isDeleted));
      } catch (e) {
        setFavorites([]);
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

  const toggleFavorite = (id) => {
    const allNotes = JSON.parse(localStorage.getItem("notes"));
    const updated = allNotes.map((n) =>
      n.id === id ? { ...n, isFavorite: !n.isFavorite } : n
    );
    localStorage.setItem("notes", JSON.stringify(updated));
    setFavorites(updated.filter(n => n.isFavorite && !n.isDeleted));
    window.dispatchEvent(new Event("notesUpdated"));
  };

  const archiveNote = (id) => {
    const allNotes = JSON.parse(localStorage.getItem("notes"));
    const updated = allNotes.map((n) =>
      n.id === id ? { ...n, isArchived: true } : n
    );
    localStorage.setItem("notes", JSON.stringify(updated));
    setFavorites(updated.filter(n => n.isFavorite && !n.isDeleted));
    setMenuOpen(null);
    window.dispatchEvent(new Event("notesUpdated"));
  };

  const deleteNote = (id) => {
    const allNotes = JSON.parse(localStorage.getItem("notes"));
    const updated = allNotes.map((n) =>
      n.id === id ? { ...n, isDeleted: true } : n
    );
    localStorage.setItem("notes", JSON.stringify(updated));
    setFavorites(updated.filter(n => n.isFavorite && !n.isDeleted));
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

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditData({ title: note.title, desc: note.desc });
  };

  const updateNote = () => {
    const allNotes = JSON.parse(localStorage.getItem("notes"));
    const updated = allNotes.map((n) =>
      n.id === editingId
        ? { ...n, title: editData.title, desc: editData.desc }
        : n,
    );
    localStorage.setItem("notes", JSON.stringify(updated));
    setFavorites(updated.filter(n => n.isFavorite && !n.isDeleted));
    setEditingId(null);
    window.dispatchEvent(new Event("notesUpdated"));
  };

  const handleCardClick = (e, note) => {
    if (e.target.closest(".menu_btn") || e.target.closest(".note_menu") || e.target.closest(".fav_btn")) {
      return;
    }
    startEdit(note);
  };

  return (
    <div>
      {favorites.length === 0 ? (
        <div className="empty">
          <MdOutlineStickyNote2 className="sticky_icon" />
          <h2>No favorite notes</h2>
          <p>
            Star notes to mark them as favorites and find <br /> them easily here.
          </p>
        </div>
      ) : (
        <div className="notes_list">
          {favorites
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
                <button 
                  className="fav_btn"
                  onClick={() => toggleFavorite(n.id)}
                  style={{ color: '#EAB308' }}
                >
                  <IoMdStar />
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
                  archiveNote(noteId);
                }}
              >
                <MdArchive />
                <span>Archive</span>
              </button>
              <button
                className="menu_item delete"
                onClick={() => {
                  const noteId = menuOpen;
                  deleteNote(noteId);
                }}
              >
                <MdDelete />
                <span>Delete</span>
              </button>
            </div>
          )}

          {editingId && (
            <div
              className="edit_modal_backdrop"
              onClick={() => setEditingId(null)}
            >
              <div className="edit_modal" onClick={(e) => e.stopPropagation()}>
                <div className="edit_modal_header">
                  <h2>Edit Note</h2>
                  <button
                    className="edit_close_btn"
                    onClick={() => setEditingId(null)}
                  >
                    ✕
                  </button>
                </div>

                <div className="edit_modal_content">
                  <input
                    type="text"
                    className="edit_title_input"
                    placeholder="Note title..."
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                  />
                  <textarea
                    className="edit_desc_input"
                    placeholder="Note description..."
                    value={editData.desc}
                    onChange={(e) =>
                      setEditData({ ...editData, desc: e.target.value })
                    }
                  />
                </div>

                <div className="edit_modal_footer">
                  <button
                    className="edit_cancel_btn"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                  <button className="edit_save_btn" onClick={updateNote}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Favorites;
