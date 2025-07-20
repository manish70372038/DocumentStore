import React, { useState, useEffect } from "react";
import { 
  FaFileAlt, 
  FaUpload,
  FaDownload,
  FaEdit,
  FaTrash,
  FaClock,
} from "react-icons/fa";

import { FiShare2 } from "react-icons/fi";
import { useAppState } from "../Context/AppStateContext";

const History = () => {
  const {history} = useAppState()
  console.log("this is history",history)
   
        const getActionIcon = (action) => {
                switch(action) {
                    case 'uploaded': return <FaUpload className="action-icon uploaded" />;
                    case 'downloaded': return <FaDownload className="action-icon downloaded" />;
                    case 'edited': return <FaEdit className="action-icon edited" />;
                    case 'shared': return <FiShare2 className="action-icon shared" />;
                    case 'deleted': return <FaTrash className="action-icon deleted" />;
                    default: return <FaFileAlt className="action-icon" />;
                }
            };
        
            const getFileTypeIcon = (fileType) => {
                switch(fileType) {
                    case 'word': return <FaFileAlt className="file-icon word" />;
                    case 'excel': return <FaFileAlt className="file-icon excel" />;
                    case 'powerpoint': return <FaFileAlt className="file-icon powerpoint" />;
                    case 'pdf': return <FaFileAlt className="file-icon pdf" />;
                    case 'archive': return <FaFileAlt className="file-icon archive" />;
                    default: return <FaFileAlt className="file-icon" />;
                }
            };
 const formatDate = (timestamp) => {
  const date = new Date(timestamp);  // Convert string to Date
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);  // Convert string to Date
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
  return (
    <div className="history-container">
      <h2>Document History</h2>
      <p className="history-subtitle">Recent activities on your documents</p>

      <div className="history-list">
        {history?.map((item) => (
          <div key={item.id} className="history-item">
            <div className="history-item-icon">
              {getActionIcon(item.action)}
              {getFileTypeIcon(item.fileType)}
            </div>
            <div className="history-item-details">
              <div className="history-item-name">{item.name}</div>
              <div className="history-item-action">
                {item.action}
              </div>
            </div>
            <div className="history-item-time">
              <FaClock className="time-icon" />
              <div className="time-details">
                <span>{formatDate(item.timestamp)} at {formatTime(item.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
