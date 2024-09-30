import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import dateWhite from "../../Assets/date-white.png";
import dateBlack from "../../Assets/date-black.png";
import pinWhite from "../../Assets/pin-white.png";
import pinBlack from "../../Assets/pin-black.png";
import pinnedWhite from "../../Assets/pinned-white.png";
import pinnedBlack from "../../Assets/pinned-black.png";
import optionsWhite from "../../Assets/options-white.png";
import optionsBlack from "../../Assets/options-black.png";
import "./Notes.css";

// Bind modal to your app element
Modal.setAppElement("#root");

export const Notes = (props) => {
  const [showOption, setShowOption] = useState(false);
  const [pin, setPin] = useState(props.pinned); 
  const [hover, setHover] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  // Sync local pin state with props.pinned when it changes
  useEffect(() => {
    setPin(props.pinned); 
  }, [props.pinned]);

  const toggleOption = () => {
    setShowOption(!showOption);
  };

  const handleMouseIn = () => {
    if (props.color !== "white") {
      setHover(true);
    }
  };

  const handleMouseOut = () => {
    if (props.color !== "white") {
      setHover(false);
    }
  };

  const handlePin = async (noteId) => {
    try {
      const response = await fetch(`http://localhost:5000/home/pin/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin }),
      });
      if (response.ok) {
        console.log("Note pinned successfully");
        setPin(!pin);
      }
    } catch (error) {
      console.log("error in pinning/unpinning note", error);
    }
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleDelete = async (noteId) => {
    try {
      const response = await fetch(`http://localhost:5000/home/${noteId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Note deleted successfully");
        props.removeNote(noteId);
      }
    } catch (error) {
      console.log("error in deleting note", error);
    }
  };

  return (
    <div
      onMouseOver={handleMouseIn}
      onMouseOut={handleMouseOut}
      style={{
        "--hover-bg-color": props.color,
        "--hover-color": props.color === "white" ? "black" : "white",
      }}
      className="note"
    >
      <div className="header">
        <div className="date">
          <img src={hover ? dateWhite : dateBlack} alt="" />
          <p className="updated-date">{props.updated_at}</p>
        </div>
        <div className="option">
          <div className="container">
            <img
              className={`${pin ? "pinned" : "pin"}`}
              onClick={() => handlePin(props.id)}
              src={
                hover
                  ? pin
                    ? pinnedWhite
                    : pinWhite
                  : pin
                  ? pinnedBlack
                  : pinBlack
              }
              alt="pin"
            />
            <img
              onClick={toggleOption}
              src={hover ? optionsWhite : optionsBlack}
              alt="options"
            />
          </div>
          <div className={`note-options ${showOption ? "show" : ""}`}>
            <div onClick={openModal}>
              <img
                src="https://img.icons8.com/?size=20&id=16100&format=png&color=000000"
                alt="view"
              />
              <p>View</p>
            </div>
            <Link style={{ all: "unset" }} to={`/home/edit`} state={{ id: props.id, content: props.content }}>
              <div>
                <img
                  src="https://img.icons8.com/?size=20&id=15049&format=png&color=000000"
                  alt="edit"
                />
                <p>Edit</p>
              </div>
            </Link>
            <div onClick={() => handleDelete(props.id)}>
              <img
                src="https://img.icons8.com/?size=20&id=85081&format=png&color=000000"
                alt="delete"
              />
              <p>Delete</p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: props.content }}
      ></div>
      <div
        className="footer-bar"
        style={{ backgroundColor: props.color }}
      ></div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="View Note"
        style={{ content: { backgroundColor: props.color } }}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <button onClick={closeModal}>Close</button>
        <div dangerouslySetInnerHTML={{ __html: props.content }}></div>
      </Modal>
    </div>
  );
};
