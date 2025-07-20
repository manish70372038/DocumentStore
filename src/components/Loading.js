import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt  } from '@fortawesome/free-solid-svg-icons';
import "../Styles/Loading.css"; 

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-icon">
          <FontAwesomeIcon icon={faFileAlt} />
        </div>
        <div className="loading-text">Loading D-OCSAVE</div>
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;