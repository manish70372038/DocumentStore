import { createContext, useContext, useState } from 'react';
import { FaUser, FaFileAlt, FaShareAlt, FaCog, FaHistory,FaCheck, FaTimes } from 'react-icons/fa';


const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('history');
  const [files,setfiles] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
   const [confirmationState, setConfirmationState] = useState({
    show: false,
    message: '',
    resolve: null
  });

  console.log("this is app context");
  const showConfirmation = (message) => {
    return new Promise((resolve) => {
      setConfirmationState({
        show: true,
        message,
        resolve
      });
    });
  };

  const handleConfirm = () => {
    confirmationState.resolve(true);
    setConfirmationState({ ...confirmationState, show: false });
  };

  const handleCancel = () => {
    confirmationState.resolve(false);
    setConfirmationState({ ...confirmationState, show: false });
  };

  
  const [documentHistory, setDocumentHistory] = useState([
    {
      id: 1,
      name: "Project Proposal.docx",
      action: "uploaded",
      timestamp: new Date(Date.now() - 3600000),
      fileType: "word"
    },
  ]);
  
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Project Proposal.docx",
      fileType: "word",
      uploadDate: new Date(Date.now() - 3600000),
      size: "2.4 MB"
    },
  ]);

  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: null,
    isVip: true,
    joinDate: new Date('2023-01-15'),
    totalDocuments: 42,
    totalStorageUsed: 256000000,
    documentTypes: {
      pdf: 12,
      doc: 15,
      ppt: 5,
      xls: 7,
      other: 3
    }
  });

  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [uploadData, setUploadData] = useState({
    fileName: '',
    filePassword: '',
    file: null,
    sharedUsers: []
  });

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
    duration:5000,
  });

  const [availableUsers] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  ]);

  const navItems = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'documents', label: 'Documents', icon: <FaFileAlt /> },
    { id: 'history', label: 'History', icon: <FaHistory /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> }
  ];

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

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const success = (message,toastDuration=4000)=>{
    setToast({
      show: true,
      message,
      type:"success",
      duration:toastDuration
    });
    
  }
  const error = (message,toastDuration=6000)=>{
    setToast({
      show: true,
      message,
      type:"error",
      duration:toastDuration
    });
   
  }
  const showToast =  {
    success,
    error,
  };

  const value = {
    currentPage,
    isMobile,
    documentHistory,
    documents,
    user,
    showUploadPopup,
    uploadData,
    toast,
    availableUsers,
    navItems,
    showToast,
    files,
    
    setfiles,
    showConfirmation,
    setCurrentPage,
    setDocumentHistory,
    setDocuments,
    setUser,
    setShowUploadPopup,
    setUploadData,
    setToast,
    
    // Utility functions
    formatDate,
    formatTime,
    formatBytes,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
       {confirmationState.show && (
        <div className="confirmation-overlay">
          <div className="confirmation-box">
            <p>{confirmationState.message}</p>
            <div className="confirmation-buttons">
              <button className="cancel-btn" onClick={handleCancel}>
                <FaTimes /> Cancel
              </button>
              <button className="confirm-btn" onClick={handleConfirm}>
                <FaCheck /> Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};