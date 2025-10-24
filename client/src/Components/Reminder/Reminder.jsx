import React, { useState, useEffect } from "react";
import "./Reminder.css";
import axios from "axios";
import moment from "moment";
import Reminder_img from "../../Assets/reminder.png";

export const Reminder = () => {
    const [reminderNotes, setReminderNotes] = useState([]);
    useEffect(() => {
        const checkNotes = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/home/reminders",
                    {
                        withCredentials: true,
                    }
                );
                if (response.data && response.data.notes) {
                    setReminderNotes(response.data.notes);
                } else {
                    setReminderNotes([]);
                }
            } catch (error) {
                console.error("Note fetching failed", error);
                setReminderNotes([]);
            }
        };
        checkNotes();
    }, []);
    return (
        <div className=" main-style">
            <div className="heading">Reminders</div>
            <div className="reminder-notes-container">
                {reminderNotes && reminderNotes.length > 0 ? (
                    reminderNotes.map((item, i) => {
                        return (
                            <div
                                key={i}
                                className="reminder-note"
                                style={{ backgroundColor: item.color }}
                            >
                                <p className="reminder">
                                    <img src={Reminder_img} alt="" />
                                    {item.reminder
                                        ? moment(item.reminder).format(
                                              "MMMM Do YYYY, h:mm a"
                                          )
                                        : "No reminder set"}
                                </p>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: item.content,
                                    }}
                                ></div>
                            </div>
                        );
                    })
                ) : (
                    <p>No reminders found</p>
                )}
            </div>
        </div>
    );
};
