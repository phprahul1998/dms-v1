import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useSession } from "next-auth/react";
import { toast } from 'react-toastify';

function Popupbox({ show, restoreData, itemType, handleClose }) {
  const { data: session } = useSession();
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
  const [getFolder, setFolderList] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [restoreApiMessage, setrestoreApiMessage] = useState('');
  const [isoriginal_deleted, setISoriginal_deleted] = useState('');
  const [newfolderId, setNewFolderId] = useState('');
  const [documentOrFolderId, setDocumentOrFolderId] = useState('');
  const [restoreBtn, setrestoreBtn] = useState('Restore');
  const [getItemtype, setItemType] = useState('');
  useEffect(() => {

    if (restoreData) {
      const availableFolders = restoreData.data?.available_folders || [];
      const original_deleted = restoreData.data?.original_deleted
      setItemType(itemType)
      setDocumentOrFolderId(restoreData.data?.document_id || [])
      setISoriginal_deleted(original_deleted);
      setFolderList(availableFolders);
      setrestoreApiMessage(restoreData.message)
    }
  }, [restoreData]);
  const handleFolderClick = (folderIndex, itemId) => {
    setSelectedFolder(folderIndex);
    setNewFolderId(itemId)
  };
  const finalRestore = async (e) => {
    setrestoreBtn('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="">Restoring...</span>');
    let restore_option = '';
    let new_folder_id = '';
    let docs_id = "";
    let folder_id = "";

    if (getItemtype == 'folder') {
      folder_id = documentOrFolderId;
    } else {
      docs_id = documentOrFolderId;
    }
    if (isoriginal_deleted == true) {
      restore_option = 'new';
      new_folder_id = newfolderId
    } else {
      if (newfolderId) {
        restore_option = 'new';
        new_folder_id = newfolderId
      } else {
        restore_option = 'original';
        new_folder_id = ''
      }

    }
    if (restore_option == 'new' && new_folder_id == '') {
      toast.warning('Please select any folder '
        , toastProperties);
      setrestoreBtn('Restore')
    } else {
      const response = await fetch(`${process.env.BASE_URL_ENDPOINT}/api/recycle_bin/restore/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          "folder_id": folder_id,
          "docs_id": docs_id,
          "new_folder_id": new_folder_id,
          "restore_option": restore_option,
        })
      });
      if (response.ok) {
        const result = await response.json();
        toast.success(result.message
          , toastProperties);
        window.location.reload();
      } else {
        toast.error('Somethings went wrong !', toastProperties);
        setrestoreBtn('Restore')
      }
    }

  }
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Restoring Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <strong>{restoreApiMessage}</strong><br /><br />
          {getFolder?.length > 0 && (
            getFolder.map((item, index) => (
              !item.is_root && ( // Using a simple condition check here
                <div
                  className={`d-flex folderList ${index === selectedFolder ? 'folderlistselected' : ''}`}
                  key={index}
                  onClick={() => handleFolderClick(index, item.id)}
                >
                  <div className="mr-auto p-2">
                    <img src="/folder.png" alt="Folder" /> {item.name}
                  </div>
                  <div className="p-2">
                    <input
                      type="radio"
                      name="folderSelection"
                      checked={index === selectedFolder}
                      onChange={() => handleFolderClick(index, item.id)}
                    />
                  </div>
                </div>
              )
            ))
          )}

          {getFolder?.length === 0 && <p>No folders available</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <button type="submit" className="btn btn-primary mr-2" onClick={finalRestore} dangerouslySetInnerHTML={{ __html: restoreBtn }} />
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Popupbox;