import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Account.css";
import { CiEdit } from "react-icons/ci";
import user from "../../Assets/user.png";
import avatar1 from "../../Assets/avatar-1.png";
import avatar2 from "../../Assets/avatar-2.png";
import avatar3 from "../../Assets/avatar-3.png";
import avatar4 from "../../Assets/avatar-4.png";

export const Account = () => {
  const [dropDown2, setDropDown2] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordChange, setPasswordChange] = useState(false);
  const [error, setError] = useState("");
  const [detailsChanged, setDetailsChanged] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [updatedFields, setUpdatedFields] = useState({});
  
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/home/account", {
          withCredentials: true,
        });
        setUserDetails(response.data.user);
      } catch (error) {
        console.error("Failed to fetch account details", error);
      }
    };
    fetchDetails();
  }, []);
  
  const [avatar, setAvatar] = useState(userDetails.avatar_img||user);
  const toggleMenu2 = () => {
    setDropDown2(!dropDown2);
  };

  const handleAvatarClick = (newAvatar) => {
    setAvatar(newAvatar);
    setUpdatedFields((prev) => ({ ...prev, avatar_img: newAvatar }));
    setDetailsChanged(true);
  };

  const handlePasswordChange = () => {
    setPasswordChange(true);
    setDetailsChanged(true);
  };

  const handleFieldChange = (field, value) => {
    setUpdatedFields((prev) => ({ ...prev, [field]: value }));
    setDetailsChanged(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
      try {
        const token = localStorage.getItem("token");

        // Send only the fields that were updated
        const response = await fetch("http://localhost:5000/home/update-account", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...updatedFields, // Only send fields that were updated
            password, // Include password if it was updated
            newPassword,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log("Account updated successfully");
        } else {
          setError(data.message || "Failed to update account");
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setTempName(userDetails.username);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    handleFieldChange("username", tempName);
  };
  
  return (
    <div className="account-settings">
      <div className="heading">Account Settings</div>
      <div className="account-container">
        <div className="profile-settings">
          <div className="present-details">
            <div className="current-avatar">
              <img src={avatar} alt="" className="main-avatar avatar-img" />
              <img
                width="15"
                height="15"
                src="https://img.icons8.com/ios/100/expand-arrow--v2.png"
                alt="expand-arrow--v2"
                className={`drop-down ${dropDown2 ? "rotate" : ""}`}
                onClick={toggleMenu2}
              />
            </div>
            {isEditing ? (
              <input
                type="text"
                className="change-name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
              />
            ) : (
              <span>{userDetails.username}</span>
            )}
            {isEditing ? (
              <button
                className="save"
                onClick={handleSaveClick}
                style={{ cursor: "pointer", marginLeft: "10px" }}
              >
                Save
              </button>
            ) : (
              <CiEdit
                className="edit-button"
                onClick={handleEditClick}
                style={{ cursor: "pointer", marginLeft: "10px" }}
              />
            )}
          </div>
          <div className={`avatar-list ${dropDown2 ? "show" : ""}`}>
            {[user, avatar1, avatar2, avatar3, avatar4].map((avatarImg, index) => (
              <img
                key={index}
                onClick={() => handleAvatarClick(avatarImg)}
                src={avatarImg}
                alt=""
                className={`avatar-img ${avatar === avatarImg ? "selected-avatar" : ""}`}
              />
            ))}
          </div>
        </div>
        <div className="account-settings-edit">
          <div>
            <label htmlFor="user-name">User Name :</label>
            <input
              type="text"
              id="user-name"
              onChange={(e) => handleFieldChange("username", e.target.value)}
              value={userDetails.username || ""}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              onChange={(e) => handleFieldChange("email", e.target.value)}
              value={userDetails.email || ""}
              required
            />
          </div>
          <button onClick={handlePasswordChange} className="btn">
            Change Password
          </button>
          <div className={`password-section ${passwordChange ? "show" : ""}`}>
            <div>
              <label htmlFor="current-password">Current Password:</label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                id="current-password"
              />
            </div>
            <div>
              <label htmlFor="new-password">New Password :</label>
              <input
                type="password"
                id="new-password"
                style={{
                  border: error === "Passwords do not match" ? "red 2px solid" :"1px solid #DCDDDF" ,
                }}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password">Confirm Password :</label>
              <input
                type="password"
                id="confirm-password"
                style={{
                  border: error === "Passwords do not match" ? "red 2px solid" :"1px solid #DCDDDF" ,
                }}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className={detailsChanged ? "show" : ""}
            id="save-changes"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
