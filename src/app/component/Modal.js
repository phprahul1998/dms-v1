"use client"
import React, {useState } from 'react';
import { useSession } from "next-auth/react"
import { toast } from 'react-toastify';
const Modal = ({ onClose,slugdata }) => {
const [folderName, setFolderName] = useState('');
const [btnLoader, setbtnLoader] = useState('Create');
const { data: session } = useSession();
const [firstParam, secondParam] = slugdata;
let folder_id = firstParam == 0 ? "" : firstParam;
const handleSubmit  = async (e) => {
  const property = {
    position: "top-right",
    autoClose: 800,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: 0,
    theme: "colored",
  }
  e.preventDefault();
  if(folderName==''){
    toast.warn('Folder name cannot be empty',property);
  }else{
    try {
      setbtnLoader('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class=""> Please wait</span>');
    const response = await fetch(`${process.env.BASE_URL_ENDPOINT}/api/create_folder/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.token}`,
      },
      body: JSON.stringify({
        folder_name: folderName,
        parent_folder_id: folder_id,
      }),
    });

    const result = await response.json();
    if (result.status==true) {
      toast.success(result.message,property);
      onClose();
      setbtnLoader('Create')
      setFolderName('')
      window.location.reload(); 
    } else {
      toast.warn(result.message,property);
      setbtnLoader('Create')

    }
  } catch (error) {
    toast.warn('An error occurred!',property);
    setbtnLoader('Create')
  }
  }
}
  return (
    <div className="modal fade show " style={{ display: 'block' }} tabIndex="-1"
    role="dialog"
    aria-labelledby="exampleModalCenterTitle"
    aria-hidden="true">
      <form onSubmit={handleSubmit}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create a New Folder</h5>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
          <div className="row">
                    <div className="col-12">
                      <div className="floating-label form-group">
                      <small>Folder Name</small>
                        <input
                          className="floating-input form-control"
                          type="text"
                          placeholder="Enter Folder Name"
                          value={folderName}
                          onChange={(e) => setFolderName(e.target.value)}
                        />
                      </div>
                    </div>
                    </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary"  dangerouslySetInnerHTML={{ __html: btnLoader }} />
            </div>
        </div>
      </div>
      </form>
    </div>
  );
};

export default Modal;
