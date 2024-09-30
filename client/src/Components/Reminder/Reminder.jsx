import React, { useState,useEffect } from 'react'
import './Reminder.css'
import axios from 'axios'
import Reminder_img from "../../Assets/reminder.png";

export const Reminder = () => {
  const[reminderNotes,setReminderNotes]=useState([])
  useEffect(()=>{
    const checkNotes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/home/reminders", {
          withCredentials: true, 
        });
        setReminderNotes(response.data.notes)
      } catch (error) {
        console.error("Note fetching failed", error);
      }
    };
    checkNotes();
  }
  ,[]);
  return (
    <div className=' main-style'>
        <div className="heading">Reminders</div>
        <div className="reminder-notes-container">
          {reminderNotes.map((item,i)=>{
            return <div className='reminder-note' style={{backgroundColor:item.color}}>
              <p className='reminder'><img src={Reminder_img} alt="" />{item.reminder}</p>
              <div  dangerouslySetInnerHTML={{ __html: item.content }}></div>
            </div>
          })}
        </div>
    </div>
  )
}
