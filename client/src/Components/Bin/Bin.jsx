import React from "react";
import Modal from "react-modal";
import "./Bin.css";
import { useState, useEffect } from "react";
import axios from "axios";
import dateWhite from "../../Assets/date-white.png";
import dateBlack from "../../Assets/date-black.png";
import optionsWhite from "../../Assets/options-white.png";
import optionsBlack from "../../Assets/options-black.png";

export const Bin = () => {
  const [binNotes, setBinNotes] = useState([]);
  const [showOption, setShowOption] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [hover, setHover] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const checkNotes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/home/bin", {
          withCredentials: true,
        });
        
        if (response.data && Array.isArray(response.data.notes)) {
          setBinNotes(response.data.notes); 
        } 
      } catch (error) {
        console.error("Note fetching failed", error);
      }
    };
    checkNotes();
  }, []);

  const toggleOption = () => {
    setShowOption(!showOption);
  };

  const handleMouseIn = (e) => {
    if (e.target.backgroundColor !== "white") {
      setHover(true);
    }
  };

  const handleMouseOut = (e) => {
    if (e.target.backgroundColor !== "white") {
      setHover(false);
    }
  };

  const openModal = (note) => {
    setSelectedNote(note); 
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedNote(null); // Reset the selected note
  };

  const handleDelete = async (noteId) => {
    try {
      const response = await fetch(`http://localhost:5000/home/bin/${noteId}`, {
        method: "DELETE",
        credentials: 'include',
      });
      if (response.ok) {
        setBinNotes((prevNotes) => prevNotes.filter(note => note.id !== noteId)); 
      }
    } catch (error) {
      console.log("error in deleting note", error);
    }
  };

  const handleRestore = async (noteId) => {
    try {
      const response = await fetch(`http://localhost:5000/home/bin/${noteId}`, {
        method: "PUT",
        credentials: 'include',
      });
      if (response.ok) {
        setBinNotes((prevNotes) => prevNotes.filter(note => note.id !== noteId)); // Remove the restored note
      }
    } catch (error) {
      console.log("error in restoring note", error);
    }
  };

  return (
    <div className="bin main-style">
      <div className="heading">Bin</div>
      <div className="bin-container">
        {binNotes && binNotes.length > 0 ? (
          binNotes.map((item, i) => {
            return (
              <div
                key={i}  
                onMouseOver={handleMouseIn}
                onMouseOut={handleMouseOut}
                style={{
                  "--hover-bg-color": item.color,
                  "--hover-color": item.color === "white" ? "black" : "white",
                }}
                className="note"
              >
                <div className="header">
                  <div className="date">
                    <img src={hover ? dateWhite : dateBlack} alt="" />
                    <p className="updated-date">{item.updated_at}</p>
                  </div>
                  <div className="option">
                    <div className="container">
                      <img
                        onClick={toggleOption}
                        src={hover ? optionsWhite : optionsBlack}
                        alt=""
                      />
                    </div>
                    <div className={`note-options ${showOption ? "show" : ""}`}>
                      <div onClick={() => openModal(item)}>
                        <img
                          src="https://img.icons8.com/?size=20&id=16100&format=png&color=000000"
                          alt=""
                        />
                        <p>View</p>
                      </div>
                      <div onClick={() => handleRestore(item.id)}>
                        <img
                          src="https://img.icons8.com/?size=20&id=50828&format=png&color=000000"
                          alt=""
                        />
                        <p>Restore</p>
                      </div>
                      <div onClick={() => handleDelete(item.id)}>
                        <img
                          src="https://img.icons8.com/?size=20&id=85081&format=png&color=000000"
                          alt=""
                        />
                        <p>Permanently Delete</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="content"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                ></div>
                <div
                  className="footer-bar"
                  style={{ backgroundColor: item.color }}
                ></div>

      
                {isModalOpen && selectedNote && (
                  <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="View Note"
                    style={{
                      content: { backgroundColor: selectedNote.color || "white" },
                    }}
                    className="modal-content"
                    overlayClassName="modal-overlay"
                  >
                    <button onClick={closeModal}>Close</button>
                    <div dangerouslySetInnerHTML={{ __html: selectedNote.content }}></div>
                  </Modal>
                )}
              </div>
            );
          })
        ) : (
          <p>No notes found in the bin.</p>
        )}
      </div>
    </div>
  );
};
