import React, { useState } from "react";
import { useAppState } from "../Context/AppStateContext";
import { formatBytes } from "./Profile";
import {
  FaFileAlt,
  FaDownload,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCalendarAlt,
  FaDatabase,
  FaFolderOpen,
  FaShare,
  FaCopy,
} from "react-icons/fa";
import { createHistoryEntry, deleteFileForUser, getFileDownload, getFilePreview } from "../configs/appwriteconfig";

export const formatDate = (isoDate) => {
  const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
       hour: "numeric", 
       minute: "2-digit", 
       hour12: true, 
    });
  };

export default function Documents() {
  const { files ,showToast,setline,setfiles,showConfirmation} = useAppState();
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Project Proposal.docx",
      fileType: "word",
      uploadDate: new Date(Date.now() - 3600000), 
      // uploadDate:"2025-06-15T09:27:34.438+00:00",
      size: "2.4 MB",
    },
    {
      id: 2,
      name: "Financial Report.xlsx",
      fileType: "excel",
      uploadDate: new Date(Date.now() - 86400000), // 1 day ago
      size: "1.8 MB",
    },
    {
      id: 3,
      name: "Presentation.pptx",
      fileType: "powerpoint",
      uploadDate: new Date(Date.now() - 259200000), // 3 days ago
      size: "5.2 MB",
    },
    //       downloadUrl
    // :
    // undefined
    // id
    // :
    // "684e920300386ef83112"
    // isPublic
    // :
    // false
    // name
    // :
    // "assignment 4.pdf"
    // previewUrl
    // :
    // undefined
    // shareableLink
    // :
    // "http://localhost:3000/share/684e920300386ef83112"
    // size
    // :
    // 85931
    // type
    // :
    // "application/pdf"
    // uploadedAt
    // :
    // "2025-06-15T09:27:34.438+00:00"
    {
      id: 4,
      name: "User Manual.pdf",
      fileType: "pdf",
      uploadDate: new Date(Date.now() - 604800000), // 1 week ago
      size: "3.1 MB",
    },
    {
      id: 5,
      name: "Assets.zip",
      fileType: "archive",
      uploadDate: new Date(Date.now() - 1209600000), // 2 weeks ago
      size: "24.5 MB",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenDocument = async (doc) => {
    console.log(doc);
    const response = await getFilePreview(doc.id);
    console.log(response);
    if(response.success)
      {
      const a = document.createElement('a');
      a.href = response.url;
      window.open(response.url, "_blank");
      a.target = '_blank';  
      a.click(); 
    }
    else{
      showToast.error(response.message);
    }

    await setline(0)
   
  };

  const handleDownloadDocument = async (id) => {
    if(!id) {
      showToast.error("Invalid Document")
      return
    }

    await setline(80,true)
    // return;
    const response = await getFileDownload(id);
    console.log(response)
    if(response.success)
      {
        const a = document.createElement('a');
        a.href = response.url;
        a.click(); 
    }
    else{
      showToast.error(response.message);
    }

    await setline(0)
   
  };

  const handleEditDocument = (id) => {
    // const doc = documents.find((d) => d.id === id);
    // alert(`Editing document: ${doc.name}`);
  };
  const handleDeleteDocument = async (doc) => {
    const isconfirm = await showConfirmation("Deleting the docuement")
    if(!isconfirm) return;
    await  setline(60,true)
       const response = await deleteFileForUser(doc.id)
       console.log(response);
       if(response.success)
       {
        await setline(90,true)
        const result = await createHistoryEntry(doc,"Deleted")
        console.log("result is ",result)
        if(result.success){
          setfiles((prev) => prev.filter((file) => file.id !== doc.id));
          showToast.success(response.message)
        }
        else{
          showToast.error("History not created")
        }

       }
       else{
        showToast.error(response.message)
       }
       await setline(0)
     
  };
  const handleShareDocument = async (id) => {
    if (navigator.share) {
    navigator.share({
      title: 'Check this out!',
      text: 'Here is a file you might like.',
      url: 'https://your-file-url.com', // or Appwrite file view/download link
    })
    .then(() => console.log('✅ Shared successfully'))
    .catch((error) => console.error('❌ Error sharing', error));
  } else {
    alert('Sharing not supported in your browser');
  }
  };
  const filteredDocuments = files?.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
 
  return (
    <div className="documents-container">
      <h2>Your Documents</h2>
      <p className="documents-subtitle">All your saved documents</p>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search documents..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FaSearch className="search-icon" />
      </div>

      <div className="documents-list">
        {!filteredDocuments && <div style={{flex:"1",margin:"auto",padding:"10px",borderRadius:'10px'}}>loading...</div> }
        {filteredDocuments?.map((doc) => (
          <div key={doc.id} className="document-item">
            <div className="document-info">
              <FaFileAlt className={`file-icon ${doc.fileType}`} />
              <div className="document-details">
                <div className="document-name">{doc.name}</div>
                <div className="document-meta">
                  <span className="document-date">
                    <FaCalendarAlt className="meta-icon" />
                    {formatDate(doc.uploadedAt)}
                  </span>
                  <span className="document-size">
                    <FaDatabase className="meta-icon" />
                    {formatBytes(doc.fileSize)}
                  </span>
                </div>
              </div>
            </div>

            <div className="document-actions">
              <button
                className="action-btn copylink-btn"
                onClick={() => handleOpenDocument(doc.id)}
                title="copy link to share docuement"
              >
                <FaCopy />
              </button>
              <button
                className="action-btn share-btn"
                onClick={() => handleShareDocument(doc.id)}
                title="share document"
              >
                <FaShare />
              </button>
              <button
                className="action-btn open-btn"
                onClick={() => handleOpenDocument(doc)}
                title="Open"
              >
                <FaFolderOpen />
              </button>
              <button
                className="action-btn download-btn"
                onClick={() => handleDownloadDocument(doc.id)}
                title="Download"
              >
                <FaDownload />
              </button>
              <button
                className="action-btn"
                onClick={() => handleEditDocument(doc.id)}
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                className="action-btn"
                onClick={() => handleDeleteDocument(doc)}
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
