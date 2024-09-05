"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from "../../component/sidebar";
import Footer from "../../component/footer";
import { useSession } from "next-auth/react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

const Folder = ({ params: { slug } }) => {
  const [firstParam, secondParam] = slug;
  const file_id = firstParam;
  const folder_id = secondParam;
  const { data: session } = useSession();
  const [docs, setDocs] = useState([]); // State to hold the documents array
  const [fileName, setFileName] = useState(''); // State to hold the documents array
  useEffect(() => {
    if (session && session.user) {
      const token = session.token;
      getFiledata(token, folder_id, file_id);
    }
  }, [session]);

  const getFiledata = async (token, folder_id, file_id) => {
    if (token) {
      try {
        const response = await fetch(`${process.env.BASE_URL_ENDPOINT}/api/view_file/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            folder_id: folder_id,
            file_id: file_id
          }),
        });

        if (response.ok) {
          const getfiledata = await response.json();
          if (getfiledata && getfiledata.data) {
            setDocs([
              {
                uri: getfiledata.data.metadata.file_url, 
                fileType:getfiledata.data.name.split('.').pop()
              }
            ]);
            setFileName(getfiledata.data.name)
          }
        } else {
          console.log('Failed to fetch user data');
        }
      } catch (error) {
        console.log('Failed to fetch user data');
      }
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-dark fileviewHeader">
        <div className="container-fluid">
          <Link href="/folder/0" className="header-logo iq-navbar-logo">
            <img src="/logo2.png" className="img-fluid rounded-normal light-logo" alt="logo" />
          </Link>
          <div className='file_details'>
            <h6>{fileName}</h6>
            <p><Link href="/folder/0">All Files and Folders</Link></p>
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mynavbar">
          </div>
        </div>
      </nav>

      <div className="container-fluid mt-3">
        <div className='row'>
          <div className='col-md-9 filePreview'>
            <DocViewer
              documents={docs} // Pass the dynamic docs array here
              pluginRenderers={DocViewerRenderers}
              style={{ height: 580 }}
              config={{
                header: {
                  disableHeader: false,
                  disableFileName: false,
                  retainURLParams: false,
                },
              }}
            />
          </div>
          <div className='col-md-3 bg-white'>
          </div>
        </div>
      </div>
    </>
  );
};

export default Folder;
