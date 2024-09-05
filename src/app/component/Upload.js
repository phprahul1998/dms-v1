"use client"
import React, { useRef,useState } from 'react';
import Modal from '../component/Modal';
import { useSession } from "next-auth/react"
import { toast } from 'react-toastify';
const Upload = ({urldata}) => {  
  const [firstParam, secondParam] = urldata;
  let folder_id = firstParam == 0 ? "" : firstParam;
  const { data: session } = useSession();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

    const inputFile = useRef(null);

    const onButtonClick = () => {
      inputFile.current.click();
    };
  
    const handleFileChange = async (event) => {
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
      const fileUploaded = event.target.files[0]; 
      if(fileUploaded==''){
        toast.warn('Please select file',property);

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
        toast.loading("Please wait the file is uploading....",property)
        const response = await fetch(`${process.env.BASE_URL_ENDPOINT}/api/upload_document/`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${session.token}`,
         },
        });
        if (!response.ok) {
          toast.error(`HTTP error! status: ${response.status}`,property);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        toast.success('File uploaded successfully',property);
        window.location.reload(); 
      } catch (error) {
        toast.error('Error uploading file:', property);
      }
      
    };
    return (
    <>
    
    <div className="upload select-dropdown input-prepend input-append">
                  <div className="btn-group">
                      <div data-toggle="dropdown">
                      <button type="button" className="btn btn-outline-secondary text-bold">New <i className="las la-plus"></i></button>
                      </div>
                      <ul className="dropdown-menu">
                      <li onClick={onButtonClick} ><div className="item"><i className="ri-file-upload-line pr-3"></i>Upload File</div></li>
                      <li><div className="item"><i className="ri-folder-upload-line pr-3"></i>Upload Folder</div></li>
                      <hr/>
                     <li onClick={handleOpenModal}><div className="item"><i className="ri-folder-add-line pr-3"></i>New Folder</div></li>
                      </ul>
                  </div>
              </div>
              <input
        type='file'
        id='file'
        ref={inputFile}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
     {isModalVisible && (
        <Modal slugdata={urldata} onClose={handleCloseModal} />
      )}
    </>
    )

}
export default Upload;
