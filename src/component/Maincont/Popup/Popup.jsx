// import React from "react";
// import "./Popup.css";
// import { RxCross2 } from "react-icons/rx";

// const Popup = ({ setOpenModel }) => {
//   return (
//     <div className="popup_backdrop" onClick={() => setOpenModel(false)}>
//       <div className="addnote" onClick={(e) => e.stopPropagation()}>
//         <div className="box-top">
//           <h1>Create New Note</h1>
//           <RxCross2 onClick={() => setOpenModel(false)} className="cut"/>
//         </div>

//         <div className="line"></div>
//         <div className="box">
//           <input
//             type="text"
//             className="search title"
//             placeholder="Note title..."
//           />
//           <textarea
//             className="search dec"
//             placeholder="Start typing your note..."
//           ></textarea>
//         </div>

//         <div className="btn">
//           <button className="bt-2" onClick={() => setOpenModel(false)}>Cancel</button>
//           <button onClick={() => setOpenModel(false)}>Save Note</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Popup;




import React, { useState } from "react";
import "./Popup.css";
import { RxCross2 } from "react-icons/rx";

const Popup = ({ setOpenModel, addNote }) => {

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handleSave = () => {
    if (!title && !desc) return;
    if (typeof addNote === 'function') {
      addNote({
        title: title,
        desc: desc
      });
    } else {
      // fallback: save directly to localStorage and notify listeners
      try {
        const existing = JSON.parse(localStorage.getItem('notes') || '[]');
        const newNote = { id: Date.now(), title, desc };
        const updated = [newNote, ...existing];
        localStorage.setItem('notes', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('notesUpdated'));
        setOpenModel(false);
      } catch (e) {
        console.error('Failed to save note', e);
      }
    }
  };

  return (
    <div className="popup_backdrop" onClick={() => setOpenModel(false)}>
      <div className="addnote" onClick={(e) => e.stopPropagation()}>

        <div className="box-top">
          <h1>Create New Note</h1>
          <RxCross2 onClick={() => setOpenModel(false)} className="cut"/>
        </div>

        <div className="line"></div>

        <div className="box">
          <input
            type="text"
            className="search title"
            placeholder="Note title..."
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
          />

          <textarea
            className="search dec"
            placeholder="Start typing your note..."
            value={desc}
            onChange={(e)=>setDesc(e.target.value)}
          ></textarea>
        </div>

        <div className="btn">
          <button className="bt-2" onClick={() => setOpenModel(false)}>
            Cancel
          </button>

          <button onClick={handleSave}>
            Save Note
          </button>
        </div>

      </div>
    </div>
  );
};

export default Popup;
