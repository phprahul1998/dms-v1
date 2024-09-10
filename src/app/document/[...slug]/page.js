"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useSession } from "next-auth/react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import "../../assets/css/fileview.css";
import { convertSize } from '/utils/common';
const Folder = ({ params: { slug } }) => {
  const [firstParam, secondParam] = slug;
  const file_id = firstParam;
  const folder_id = secondParam;
  const { data: session } = useSession();
  const [docs, setDocs] = useState([]);
  const [fileName, setFileName] = useState('');
  const [file_url, setFileUrl] = useState('');
  const [filesize, setFileSize] = useState('');
  const [documenttype, setDocumenttype] = useState('');
  const [upload_date, setupload_date] = useState('');
  const [versions, setVersions] = useState([]);
  const [property, setProperty] = useState(true)
  const [versioncontrol, setGetversion] = useState(false)
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
                fileType: getfiledata.data.name.split('.').pop()
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
        toast.success('Link is copied', pro);
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
  const getVersion = async () => {
    const response = await fetch(`${process.env.BASE_URL_ENDPOINT}/api/file_version_list/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.token}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        "doc_id": firstParam
      })
    });

    if (response.ok) {
      const result = await response.json();
      if (result && result.data) {
        setVersions(result.data);
        setProperty(false)
        setGetversion(true)
      }
    }
  }
  const getProperty = () => {
    setProperty(true)
    setGetversion(false)
  }

  return (
    <>
      <div style={{ width: "100%" }} className=" iq-top-navbar">
        <div className="iq-navbar-custom">
          <nav className="fileviewheader navbar navbar-expand-lg navbar-light p-0">
            <div className="iq-navbar-logo d-flex align-items-center justify-content-between">
              <Link href="/folder/0" className=" navbar-brand header-logo iq-navbar-logo">
                <img src="/logo2.png" className="img-fluid rounded-normal light-logo" alt="logo" />
              </Link>
              <div className="">
                <h6 className='m-0 file_details'>{fileName}</h6>
                <Link className='parent-section' href="/folder/0"><svg width="16" height="16" viewBox="0 0 16 16" className="folder-icon" focusable="false" aria-hidden="true" role="presentation">
                  <path fill="#909090" fillRule="evenodd"
                    d="M6.6 2L8 3.375h5.6c.77 0 1.4.619 1.4 1.375v6.875c0 .756-.63 1.375-1.4 1.375H2.4c-.77 0-1.4-.619-1.4-1.375l.007-8.25C1.007 2.619 1.63 2 2.4 2h4.2zM13 5H3v1h10V5z">
                  </path></svg>&nbsp;All Files and Folders</Link>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-label="Toggle navigation">
                <i className="ri-menu-3-line"></i>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ml-auto navbar-list align-items-center">
                  <li className="nav-item nav-icon dropdown mr-2">
                    <button className="btn btn-outline-primary  search-toggle dropdown-toggle " id="dropdownMenuButton01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i className="las la-ellipsis-h"></i>
                    </button>
                    <div className="iq-sub-dropdown dropdown-menu" aria-labelledby="dropdownMenuButton01">
                      <div className="card shadow-none m-0">
                        <div className="card-body p-0 ">
                          <div className="p-3">
                            <Link href="#" onClick={getProperty} className="iq-sub-card"><i className="las la-align-justify"></i>Properties</Link>
                            <Link onClick={getVersion} href="#" className="iq-sub-card"><i className="las la-history"></i>Version History</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="nav-item   mr-2">
                    <Link href={file_url} className='btn btn-outline-primary  ' download>Download</Link>
                  </li>
                  <li className=" nav-item mr-2">
                    <button data-tooltip-id="copy"
                      data-tooltip-content="Copy"
                      onClick={handleCopyText} className='btn  btn-outline-primary'><i className="las la-link"></i></button>
                  </li>
                  <li className=" nav-item mr-2">
                    <button data-tooltip-id="share"
                      data-tooltip-content="Share"
                      onClick={shareText} className='btn  btn-primary'>Share <i className="las la-share-square"></i></button>
                  </li>
                  <li className=" nav-item mr-2">
                    <Link href="/folder/0" className='btn  btn-outline-primary'><i className="las la-times"></i></Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
      <div className='fileview'>
        <div className="container-fluid   bg-white">
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
                {property && (
                  <div className="Properties">
                    <h6 className='p-2'>File Properties</h6>
                    <div className="d-flex flex-column">
                      <div className="p-2">Name <br /> {fileName}</div>
                      <div className="p-2">Description <br /> </div>
                      <div className="p-2">File Size <br /> {filesize}</div>
                      <div className="p-2">Document type <br /> {documenttype}</div>
                      <div className="p-2">Upload date <br /> {upload_date}</div>
                    </div>
                  </div>
                )}
              </div>
              {versioncontrol && (
                <div className="filter-result version">
                  <h6 className='p-2'>Version History</h6>
                  <span className='version'>
                    {versions.map((version) => (
                      <div key={version.id} className="job-box d-md-flex align-items-center justify-content-between mb-30">
                        <div className="job-left my-2 d-md-flex align-items-center flex-wrap">
                          <div className="img-holder mr-md-4 mb-md-0 mb-4 mx-auto mx-md-0 d-md-none d-lg-flex">
                            V{version.version}
                          </div>
                          <div className="job-content">
                            <h6 className="text-center text-md-left ml-2">{version.document_name}</h6>
                          </div>
                        </div>
                      </div>
                    ))}
                  </span>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Folder;
