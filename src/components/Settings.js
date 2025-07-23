import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import setRoutes from "../configs/routconfig";
import { appwriteAuth } from "../Auth/appwriteauth";
import { callAppwriteFunction } from "../API/functioncall";
import {
  FaUser,
  FaHistory,
  FaEdit,
  FaTrash,
  FaDatabase,
  FaUserCog,
  FaLock,
  FaBell,
  FaShieldAlt,
  FaEye,
  FaSlidersH,
  FaPalette,
  FaMoon,
  FaSun,
  FaLanguage,
  FaDesktop,
  FaArrowUp,
  FaCloudDownloadAlt,
  FaTrashAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuthState } from "../Context/Authcontext";
import { useAppState } from "../Context/AppStateContext";

const Settings = () => {
  const { showConfirmation,showToast,setline } = useAppState();
  const { updateuser, user} = useAuthState();
  const navigate = useNavigate();

  const logout = async (e) => {
    e.preventDefault();
    if(!await showConfirmation("Your session on this device will be deleted you can login again any time")){
      return;
    }
    try {
      await setline(90,true)
      const response = await appwriteAuth.logout();
      console.log(response);
      if (response.success) {
        updateuser(null);
        localStorage.removeItem("page");
        showToast.success(response.message);
        navigate("/");
       
      }
      else{

        showToast.error(response.message,5000);
      }

    } catch (error) {
      showToast.error(error.message,5000);
    } finally{
      setline(0);
    }
  };

 const deleteaccount = async(e)=>{
  e.preventDefault();
  try {
const isconfirm = await showConfirmation(
  "Are you sure you want to delete your account?\nThis action is permanent and cannot be undone."
);    if(!isconfirm)return;
    await setline(90,true)
   const response =  await callAppwriteFunction("post",{userId:user?.$id,work:"deleteAccount"});
   console.log(response);
   if(response.success)
   {
    showToast.success(response.message);
     updateuser(null);
     navigate("/");
   }
   else{

    showToast.error(response.message);
    }

  } catch (error) {
    console.log(error)
    showToast.error(error.message);
    
  }
  finally{
    setline(0)
  }

 }

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <p className="settings-subtitle">
        Configure your application preferences
      </p>

      <div  className="settings-categories">
        {/* Account Settings */}
        <div className="settings-category">
          <div className="category-header">
            <FaUserCog className="category-icon" />
            <h3>Account Settings</h3>
          </div>
          <div className="category-content">
            <div className="setting-item">
              <div className="setting-info">
                <FaLock className="setting-icon" />
                <div>
                  <h4>Password</h4>
                  <p>Change your account password</p>
                </div>
              </div>
              <button className="edit-btn">
                <FaEdit /> Change
              </button>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <FaSignOutAlt className="setting-icon" />
                <div>
                  <h4>Logout Account</h4>
                  <p>Logout or Delete the session on this device</p>
                </div>
              </div>
              <button onClick={logout} className="edit-btn">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="settings-category">
          <div className="category-header">
            <FaShieldAlt className="category-icon" />
            <h3>Privacy & Security</h3>
          </div>
          <div className="category-content">

            <div className="setting-item toggle-item">
              <div className="setting-info">
                <FaHistory className="setting-icon" />
                <div>
                  <h4>Data Collection</h4>
                  <p>Allow analytics data collection</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <FaTrash className="setting-icon" />
                <div>
                  <h4>Delete Account</h4>
                  <p>Permanently delete your account</p>
                </div>
              </div>
              <button onClick={deleteaccount} className="delete-btn">
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        </div>

        {/* Application Preferences */}
        <div className="settings-category">
          <div className="category-header">
            <FaSlidersH className="category-icon" />
            <h3>App Preferences</h3>
          </div>
          <div className="category-content">
            <div className="setting-item">
              <div className="setting-info">
                <FaPalette className="setting-icon" />
                <div>
                  <h4>Theme</h4>
                  <p>Dark/Light mode preferences</p>
                </div>
              </div>
              <div className="theme-options">
                <button className="theme-option dark active">
                  <FaMoon /> Dark
                </button>
                <button className="theme-option light">
                  <FaSun /> Light
                </button>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <FaLanguage className="setting-icon" />
                <div>
                  <h4>Language</h4>
                  <p>Select your preferred language</p>
                </div>
              </div>
              <select className="language-select">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Storage Settings */}
        <div className="settings-category">
          <div className="category-header">
            <FaDatabase className="category-icon" />
            <h3>Storage Management</h3>
          </div>
          <div className="category-content">
            <div className="storage-info">
              <div className="storage-progress">
                <div className="progress-bar" style={{ width: "65%" }}></div>
              </div>
              <div className="storage-details">
                <span>13.2 GB of 20 GB used</span>
                <button className="upgrade-btn">
                  <FaArrowUp /> Upgrade
                </button>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <FaCloudDownloadAlt className="setting-icon" />
                <div>
                  <h4>Auto Backup</h4>
                  <p>Configure automatic backups</p>
                </div>
              </div>
              <button className="edit-btn">
                <FaEdit /> Configure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
