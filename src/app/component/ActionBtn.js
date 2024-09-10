"use client";
import "../assets/css/filedrop.css";
import React, { useRef, useState } from 'react';
import { useSession } from "next-auth/react";
import { toast } from 'react-toastify';
import 'react-tooltip/dist/react-tooltip.css'
import Link from 'next/link';
import { Tooltip } from 'react-tooltip'
import Swal from 'sweetalert2'

const ActionBtn = ({ itemid, itemType}) => {
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
    const moveTrash = async()=>{
        let doc_id="";
        let folder_id="";
        if(itemType=='folder'){
            folder_id =itemid;
        }else{
            doc_id =itemid;
        }
        Swal.fire({
            title: "Are you sure want to delete this file ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0d6efd",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
          }).then(async (result) => {
            if (result.isConfirmed) {
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
                    Swal.fire({
                        title: "Deleted!",
                        text: "Data has been deleted.",
                        icon: "success"
                      });
                   window.location.reload(); 
                  }else{
                    toast.error('Somethings went wrong !', toastProperties);
                  }
             
            }
          });
     
    }
    return (
        <>
<Tooltip id="my-tooltip" />
            <div className="more-button">
                <ul>
                    <li className="actionbtn dropdown"  data-tooltip-id="my-tooltip" data-tooltip-content="More options">
                        <span
                            className=""
                            id="dropdownMenuButton5"
                            data-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="las la-ellipsis-h"></i>
                        </span>
                        <div
                            className="dropdown-menu dropdown-menu-right"
                            aria-labelledby="dropdownMenuButton5"
                        >
                            <Link className="dropdown-item" href="#">
                            <i className="ri-file-download-fill mr-2"></i>Download
                            </Link>
                            <Link onClick={moveTrash} className="dropdown-item" href="#">
                                <i className="ri-delete-bin-6-fill mr-2"></i>Trash
                            </Link>
                            
                        </div>
                    </li>
                    <li  data-tooltip-id="my-tooltip" data-tooltip-content="Add to collection"><i className="las la-star"></i></li>
                    <li data-tooltip-id="my-tooltip" data-tooltip-content="Copy Shared Link"><i className="las la-link"></i></li>
                    <li data-tooltip-id="my-tooltip" data-tooltip-content="Share"><i className="las la-share-square"></i></li>
                </ul>
            </div>

        </>
    );
};

export default ActionBtn;
