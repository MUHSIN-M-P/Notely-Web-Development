import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import DateTime from "react-datetime";
import { useLocation, useNavigate } from "react-router-dom";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import Reminder_img from "../../Assets/reminder.png";

export const Editnote = () => {
  const [reminder, setReminder] = useState(null);
  const [isPicking, setIsPicking] = useState(false);
  const [tempReminder, setTempReminder] = useState(null);
  const [color, setColor] = useState("white");
  const [textColor, setTextColor] = useState("black");
  const quillRef = useRef(null);

  const location = useLocation();
  const { id, content: initialContent } = location.state || {};  // Get id and content from the state
  const [content, setContent] = useState(initialContent);

  const handleContentChange = (value) => {
    setContent(value);  // Update content state on edit
  };

  // Quill editor configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      ["image", "code-block"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    ],
  };

  const navigate = useNavigate()
  // Handle Quill content and send to backend
  const handleSave = async () => {
    const quillEditor = quillRef.current.editor;
    const content = quillEditor.root.innerHTML; // Get HTML content from Quill
    setContent(content);
    try {
      const response = await axios.put(
        `http://localhost:5000/home/edit/${id}`, 
        {
          content, 
          color, 
          reminder, 
        },
        { withCredentials: true } // Ensures cookies (JWT token) are sent
      );
      navigate('/home')
      console.log("Note saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  // Handle date selection and confirmation
  const handleDateChange = (date) => {
    if (moment(date).isValid()) {
      setTempReminder(moment(date).format("MMMM Do YYYY, h:mm a"));
    }
  };

  const validFutureDate = (current) => current.isAfter(moment());

  const handleConfirm = () => {
    
    setReminder(tempReminder);
    setIsPicking(false);
  };

  const handleRemoveReminder = () => {
    setReminder(null);
    setIsPicking(false);
    setTempReminder(null);
  };

  // Handle color change for note

  const handleColorChange = (e) => {
    const element = e.target;
    const backgroundColor = window.getComputedStyle(element).backgroundColor;

    // Convert RGB to HEX and set the color
    const hexColor = rgbStringToHex(backgroundColor);
    setColor(hexColor);
    setTextColor("white");
  };

  // Function to convert RGB string to HEX
  const rgbStringToHex = (rgbString) => {
    const rgbValues = rgbString.match(/\d+/g);
    const r = parseInt(rgbValues[0], 10);
    const g = parseInt(rgbValues[1], 10);
    const b = parseInt(rgbValues[2], 10);

    return rgbToHex(r, g, b);
  };

  const rgbToHex = (r, g, b) => {
    const toHex = (color) => {
      const hex = color.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };
  const colors = [
    "#87baf5",
    "#aa87f5",
    "#f0864a",
    "#f674ad",
    "#1f1c2f",
    "#8ac3a3",
  ];

  return (
    <div className="create-note">
      <div className="heading">Edit Note</div>
      <div className="textarea">
        <div>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            modules={quillModules}
            value={content}
            onChange={handleContentChange}
            placeholder={"Title\nWrite something"}
          />
          <div className="editor-bottom-section">
            <div className="choose-color">
              Choose Color:
              {colors.map((item, index) => (
                <button
                  id="color-btn"
                  className={`${color===item ? 'selected': ''}`}
                  onClick={handleColorChange}
                  key={index}
                  style={{ background: item, width: "20px", height: "20px" }}
                />
              ))}
            </div>

            <div className="set-reminder">
              {!reminder && !isPicking ? (
                <button onClick={() => setIsPicking(true)}>Set Reminder</button>
              ) : (
                <div>
                  {reminder && (
                    <div id="final-reminder">
                      <p>
                        <img src={Reminder_img} alt="" /> {reminder}
                      </p>
                      <button onClick={() => setIsPicking(true)}>
                        Change Reminder
                      </button>
                      <button onClick={handleRemoveReminder}>
                        Remove Reminder
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isPicking && (
                <div>
                  <DateTime
                    onChange={handleDateChange}
                    dateFormat="MMMM Do YYYY"
                    timeFormat="h:mm a"
                    closeOnSelect={false}
                    isValidDate={validFutureDate}
                    input={false}
                  />
                  {tempReminder && (
                    <div>
                      <p>Selected: {tempReminder}</p>
                      <button onClick={handleConfirm}>Confirm</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <button className="save-content" onClick={handleSave}>
            Save Note
          </button>
          <p className="preview">Preview</p>
          <div
            className="output-viewer"
            style={{ background: color, color: textColor }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
};
