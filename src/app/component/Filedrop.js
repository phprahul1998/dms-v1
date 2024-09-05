"use client";
import "../assets/css/filedrop.css";
import React, { useRef, useState } from 'react';
import { useSession } from "next-auth/react";
import { toast } from 'react-toastify';
const Filedrop = ({ urldata }) => {
  const { data: session } = useSession();
  const [firstParam, secondParam] = urldata;
  let folder_id = firstParam == 0 ? "" : firstParam;
  const inputFile = useRef(null);
  const [isDragging, setIsDragging] = useState(false); 
  const toastProperties = {
    position: "top-right",
    autoClose: 800,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: 0,
    theme: "colored",
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  const handleFileChange = async (event) => {
    const fileUploaded = event.target.files[0];
    await uploadFile(fileUploaded);
  };
  const handleDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false); 
    const fileUploaded = event.dataTransfer.files[0];
    await uploadFile(fileUploaded);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const uploadFile = async (fileUploaded) => {
    if (!fileUploaded) {
      toast.warn('Please select a file', toastProperties);
      return;
    }

    const formData = new FormData();
    formData.append('file', fileUploaded);
    formData.append('folder_id', folder_id);

    const metadata = {
      document_type: fileUploaded.name.split('.').pop(),
      size: fileUploaded.size,
    };
    formData.append('metadata', JSON.stringify(metadata));

    try {
      toast.loading("Please wait, the file is uploading...", toastProperties);
      const response = await fetch(`${process.env.BASE_URL_ENDPOINT}/api/upload_document/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${session.token}`,
        },
      });

      if (!response.ok) {
        toast.error(`HTTP error! Status: ${response.status}`, toastProperties);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      toast.dismiss(); 
      toast.success('File uploaded successfully', toastProperties);
      window.location.reload(); 
    } catch (error) {
      toast.dismiss(); 
      toast.error('Error uploading file', toastProperties);
    }
  };

  return (
    <>
      <div
        className={`drag-area ${isDragging ? 'dragging' : ''}`} 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className='FolderEmptyStateContent'>
          <div className="icon">
            <img src="/dropfile.png" alt="Drop File" />
          </div>
          <h5>Get started by adding your first file</h5>
          <span>Create new documents directly within Box or upload an existing file</span>
          <br /><br />
          <div className="btn-group" role="group">
            <button
              id="btnGroupDrop1"
              type="button"
              className="btn btn-sm btn-primary dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Upload
            </button>
            <div className="dropdown-menu dropmenu" aria-labelledby="btnGroupDrop1">
              <a onClick={onButtonClick} className="dropdown-item" href="#">Upload file</a>
            </div>
          </div>
        </div>
      </div>
      <input
        type='file'
        id='file'
        ref={inputFile}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default Filedrop;
