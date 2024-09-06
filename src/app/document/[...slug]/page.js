"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useSession } from "next-auth/react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { convertSize } from '/utils/common';
const Folder = ({ params: { slug } }) => {
  const [firstParam, secondParam] = slug;
  const file_id = firstParam;
  const folder_id = secondParam;
  const { data: session } = useSession();
  const [docs, setDocs] = useState([]); // State to hold the documents array
  const [fileName, setFileName] = useState(''); // State to hold the documents array
  const [file_url, setFileUrl] = useState(''); // State to hold the documents array
  const [filesize, setFileSize] = useState('');
  const [documenttype, setDocumenttype] = useState('');
  const [upload_date, setupload_date] = useState('');

  useEffect(() => {
    if (session && session.user) {
      const token = session.token;
      getFiledata(token, folder_id, file_id);
    }
  }, [session]);

  const pro = {
    position: "top-right",
    autoClose: 800,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: 0,
    theme: "colored",
 }

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
            setFileUrl(getfiledata.data.metadata.file_url)
            setFileSize(convertSize(getfiledata.data.metadata.file_size))
            setDocumenttype(getfiledata.data.metadata.document_type)
            setupload_date(new Date(getfiledata.data.metadata.upload_date).toDateString())
          }
        } else {
          console.log('Failed to fetch user data');
        }
      } catch (error) {
        console.log('Failed to fetch user data');
      }
    }
  };

  const handleCopyText = () => {
    const textToCopy = file_url
    console.log(textToCopy)
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success('Link is copied',pro);
      })
      .catch((err) => {
        toast.error("Unable to copy text to clipboard", pro);
      });
  };

  const shareText = () => {
    const pTagText = file_url
    if (navigator.share) {
      navigator
        .share({
          title: "Share Text",
          text: pTagText,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert(`Share this text: ${pTagText}`);
    }
  };

  return (
    <>
    <nav className="navbar navbar-expand-sm fileviewHeader">
  <div className="container-fluid">
    <Link href="/folder/0" className="navbar-brand header-logo iq-navbar-logo">
            <img src="/logo2.png" className="img-fluid rounded-normal light-logo" alt="logo" />
    </Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="mynavbar">
      <ul className="navbar-nav me-auto d-block">
        <li className="nav-item">
           <h6 className='m-0 file_details'>{fileName}</h6>
          <Link className='parent-section' href="/folder/0"><svg width="16" height="16" viewBox="0 0 16 16" className="folder-icon" focusable="false" aria-hidden="true" role="presentation">
            <path fill="#909090" fillRule="evenodd"
           d="M6.6 2L8 3.375h5.6c.77 0 1.4.619 1.4 1.375v6.875c0 .756-.63 1.375-1.4 1.375H2.4c-.77 0-1.4-.619-1.4-1.375l.007-8.25C1.007 2.619 1.63 2 2.4 2h4.2zM13 5H3v1h10V5z">
            </path></svg>&nbsp;All Files and Folders</Link>
        </li>
      </ul>
      <div className="d-flex">
      <div className="mr-2">
        <button className='btn  btn-outline-primary'><i className="las la-ellipsis-h"></i></button>
      </div>
      <div className="mr-2">
      <Link href={file_url} className='btn  btn-outline-primary' download>Download</Link>
      </div>
      <div className="mr-2">
      <button data-tooltip-id="copy"
                      data-tooltip-content="Copy"
                      onClick={handleCopyText}  className='btn  btn-outline-primary'><i className="las la-link"></i></button>
      </div>
      <div className="mr-2">
      <button  data-tooltip-id="share"
                      data-tooltip-content="Share"
                      onClick={shareText} className='btn  btn-primary'>Share <i className="las la-share-square"></i></button>
      </div>
      <div className="mr-2">
      <Link href="/folder/0" className='btn  btn-outline-primary'><i className="las la-times"></i></Link>
      </div>
      </div>
    </div>
  </div>
</nav>
      
      <div className="container-fluid  bg-white">
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
            <div className='mt-3'>
            <h5>File Properties</h5>
            <div class="d-flex flex-column">
            <div class="p-2 ">Name <br/> {fileName}</div>
            <div class="p-2 ">Description <br/> </div>
            <div class="p-2 ">File Size <br/> {filesize}</div>
            <div class="p-2 ">Document type <br/> {documenttype}</div>
            <div class="p-2 ">Upload date <br/> {upload_date}</div>

            </div>
            

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Folder;
