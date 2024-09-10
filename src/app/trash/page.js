"use client";
import { useState, useEffect } from 'react';
import Sidebar from "../component/sidebar";
import Footer from "../component/footer";
import { toast } from 'react-toastify';
import { useSession } from "next-auth/react";
const Trash = () => {
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
    const [folderName, setFolderName] = useState('');
    const [recyclebindata, setRecyclebindata] = useState([]);
    useEffect(() => {
        if (session && session.user) {
            RecycleBindata();
        }
    }, [session]);
    const RecycleBindata = async () => {
        try {
            const response = await fetch(`${process.env.BASE_URL_ENDPOINT}/api/recycle_bin/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.token}`,
                },
            });

            const result = await response.json();
            if (result && result.data) {
                const recyclebindata = result.data;
                setRecyclebindata(recyclebindata)
            } else {
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {

        }
    }

  
    const moveTrash = async(itemtype,item_id)=>{
        let doc_id="";
        let folder_id="";
        if(itemtype=='folder'){
            folder_id =item_id;
        }else{
            doc_id =item_id;
        }
        const response = await fetch(`${process.env.BASE_URL_ENDPOINT}/api/deletion_api/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.token}`,
              'Content-Type': 'application/json',
            },
      
            body: JSON.stringify({
                "folder_id": folder_id,
                "doc_id":doc_id
            })
          });
      
          if (response.ok) {
            const result = await response.json();
           toast.success('Data deleted successfully', toastProperties);
           window.location.reload(); 
          }else{
            toast.error('Somethings went wrong !', toastProperties);
          }
    }
   

    return (
        <div>
            <Sidebar folderId="0" pageName="trash" />

            <div className="content-page">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12 col-lg-12 col-md-12 col-xl-12">
                            <div className="d-flex justify-content-between mb-2">
                                <div className="header-title">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className={`breadcrumb-item ${!folderName ? "active" : "inactive"}`}>
                                                <a href="/folder/0">
                                                    <h6>All Trash</h6>
                                                </a>
                                            </li>
                                            {folderName && (
                                                <li className={`breadcrumb-item ${folderName ? "active" : "inactive"}`}>
                                                    <h6>{folderName}</h6>
                                                </li>
                                            )}
                                        </ol>
                                    </nav>

                                </div>

                            </div>
                            <div className='row'>
                                {recyclebindata.length > 0 ? (
                                    recyclebindata.map((item, index) => (
                                        <div key={index} className="col-lg-2 col-md-3 col-sm-6">
                                            <div className="card card-block card-stretch card-height">
                                                <div className="trash card-body image-thumb ">
                                                    <div className="mb-4 text-center p-3 rounded iq-thumb">
                                                        <img src={item.type === 'folder' ? '/folder.png' : `${process.env.FTP_FILE_PATH}/${item.path}`} className="img-fluid" alt="" />
                                                        <div className="iq-image-overlay"></div>
                                                    </div>
                                                    <div className=" d-flex justify-content-between">
                                                        <h6>{item.item_name}</h6>
                                                        <div className="card-header-toolbar">
                                                            <div className="dropdown">
                                                                <span className="dropdown-toggle" id="dropdownMenuButton001" data-toggle="dropdown">
                                                                    <i className="ri-more-2-fill"></i>
                                                                </span>
                                                                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton001">
                                                                <a className="dropdown-item" href="#" onClick={() => moveTrash(item.type, item.item_id)}>
                                                                <i className="ri-delete-bin-6-fill mr-2"></i>Delete</a>
                                                                    <a className="dropdown-item" href="#"><i className="ri-restart-line mr-2"></i>restore</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))

                                ) : (
                                    <small></small>
                                )}
                            </div>


                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>

    );
};

export default Trash;
