import React, { useState, useEffect, useRef, useContext } from "react";
import "./Notes.css";
import { MdOutlineStickyNote2 } from "react-icons/md";
import Popup from "../Popup/Popup";
import { MdDelete, MdArchive } from "react-icons/md";
import { IoMdStar } from "react-icons/io";
import { SearchContext } from "../../../SearchContext";

const Notes = () => {
  const [openModel, setOpenModel] = useState(false);
  const [notes, setNotes] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: "", desc: "" });
  const menuBtnRef = useRef(null);
  const { searchQuery } = useContext(SearchContext);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("notes");
      if (saved) setNotes(JSON.parse(saved));
    } catch (e) {
      setNotes([]);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      try {
        const saved = localStorage.getItem("notes");
        setNotes(saved ? JSON.parse(saved) : []);
      } catch (e) {
        setNotes([]);
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

  const addNote = (note) => {
    const newNote = { id: Date.now(), ...note };
    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem("notes", JSON.stringify(updated));
    setOpenModel(false);
  };

  const deleteNote = (id) => {
    const updated = notes.map((n) =>
      n.id === id ? { ...n, isDeleted: true } : n
    );
    setNotes(updated);
    localStorage.setItem("notes", JSON.stringify(updated));
    setMenuOpen(null);
    window.dispatchEvent(new Event("notesUpdated"));
  };

  const toggleFavorite = (id) => {
    const updated = notes.map((n) =>
      n.id === id ? { ...n, isFavorite: !n.isFavorite } : n
    );
    setNotes(updated);
    localStorage.setItem("notes", JSON.stringify(updated));
    window.dispatchEvent(new Event("notesUpdated"));
  };

  const archiveNote = (id) => {
    const updated = notes.map((n) =>
      n.id === id ? { ...n, isArchived: true } : n
    );
    setNotes(updated);
    localStorage.setItem("notes", JSON.stringify(updated));
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
    const updated = notes.map((n) =>
      n.id === editingId
        ? { ...n, title: editData.title, desc: editData.desc }
        : n,
    );
    setNotes(updated);
    localStorage.setItem("notes", JSON.stringify(updated));
    setEditingId(null);
  };

  const handleCardClick = (e, note) => {
    if (e.target.closest(".menu_btn") || e.target.closest(".note_menu") || e.target.closest(".fav_btn")) {
      return;
    }
    startEdit(note);
  };
  return (
    <div>
      {notes.filter(n => !n.isArchived && !n.isDeleted).length === 0 ? (
        <div className="empty">
          <MdOutlineStickyNote2 className="sticky_icon" />
          <h2>Create your first note</h2>
          <p>
            Get started by creating a new note. Click the
            <br /> "New" button to begin.
          </p>
          <button
            className="button-84"
            role="button"
            onClick={() => setOpenModel(true)}
          >
            Create Note
          </button>
          {openModel && (
            <Popup
              openModel={openModel}
              setOpenModel={setOpenModel}
              addNote={addNote}
            />
          )}
        </div>
      ) : (
        <div className="notes_list">
          <div className="notes_header">
            {notes.filter(n => !n.isArchived && !n.isDeleted).length === 0 && (
              <button
                className="button-84"
                role="button"
                onClick={() => setOpenModel(true)}
              >
                New
              </button>
            )}
          </div>
          {openModel && (
            <Popup
              openModel={openModel}
              setOpenModel={setOpenModel}
              addNote={addNote}
            />
          )}
          {notes
            .filter(n => !n.isArchived && !n.isDeleted)
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
                  style={{ color: n.isFavorite ? '#EAB308' : 'inherit' }}
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
};

export default Notes;
