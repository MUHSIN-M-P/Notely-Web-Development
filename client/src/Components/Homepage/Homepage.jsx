import React, { useEffect, useState } from "react";
import { Notes } from "../Notes/Notes";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Homepage.css';

export const Homepage = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const checkNotes = async () => {
      try {
        let url;
        if (selectedCategory === 'All') {
          url = "http://localhost:5000/home";
        } else if (selectedCategory === 'Pin Notes') {
          url = "http://localhost:5000/home/pin";
        }
        const response = await axios.get(url, {
          withCredentials: true,
        });
        setNotes(response.data.notes);
      } catch (error) {
        console.error("Note fetching failed", error);
      }
    };
    checkNotes();
  }, [selectedCategory]);

  const removeNote = (noteId) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  };

  const handleClick = () => {
    navigate("/home/create-note");
  };

  return (
    <div>
      <div className="main-content">
        <div className="new-note-section" onClick={handleClick}>
          <div>
            <img
              src="https://img.icons8.com/?size=15&id=11737&format=png&color=000000"
              alt=""
            />
            <p>Write Your Note...</p>
          </div>
        </div>

        <div className="notes-section">
          <h1>Your Notes</h1>
          <div className="categories">
            <p
              className={`${selectedCategory === 'All' ? 'selected-cat' : null}`}
              onClick={() => setSelectedCategory('All')}
            >
              All
            </p>
            <p
              className={`${selectedCategory === 'Pin Notes' ? 'selected-cat' : null}`}
              onClick={() => setSelectedCategory('Pin Notes')}
            >
              Pin Notes
            </p>
          </div>

          <div className="notes-list">
            {notes && notes.length>0 ? (notes.map((item, i) => {
              return (
                <Notes
                  key={i}
                  id={item.id}
                  content={item.content}
                  updated_at={item.updated_at}
                  color={item.color}
                  removeNote={removeNote}
                  pinned={item.pinned}
                />
              );
            })):(<p>No notes available</p>)}
          </div>
        </div>
      </div>
    </div>
  );
};
