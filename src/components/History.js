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

const History = () => {
    const [documentHistory, setDocumentHistory] = useState([
            {
                id: 1,
                name: "Project Proposal.docx",
                action: "uploaded",
                timestamp: new Date(Date.now() - 3600000), // 1 hour ago
                fileType: "word"
            },
            {
                id: 2,
                name: "Financial Report.xlsx",
                action: "edited",
                timestamp: new Date(Date.now() - 86400000), // 1 day ago
                fileType: "excel"
            },
            {
                id: 3,
                name: "Presentation.pptx",
                action: "shared",
                timestamp: new Date(Date.now() - 259200000), // 3 days ago
                fileType: "powerpoint"
            },
            {
                id: 4,
                name: "Budget.pdf",
                action: "downloaded",
                timestamp: new Date(Date.now() - 604800000), // 1 week ago
                fileType: "pdf"
            },
            {
                id: 5,
                name: "Design Assets.zip",
                action: "deleted",
                timestamp: new Date(Date.now() - 1209600000), // 2 weeks ago
                fileType: "archive"
            }
        ]);
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
            const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const formatTime = (date) => {
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
        {documentHistory.map((item) => (
          <div key={item.id} className="history-item">
            <div className="history-item-icon">
              {getActionIcon(item.action)}
              {getFileTypeIcon(item.fileType)}
            </div>
            <div className="history-item-details">
              <div className="history-item-name">{item.name}</div>
              <div className="history-item-action">
                {item.action.charAt(0).toUpperCase() + item.action.slice(1)}
              </div>
            </div>
            <div className="history-item-time">
              <FaClock className="time-icon" />
              <div className="time-details">
                <span>{formatTime(item.timestamp)}</span>
                <span>{formatDate(item.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
