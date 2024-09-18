"use client"
import Esign from "../component/Esign";
import "../assets/css/sign.css";
import Link from 'next/link';
 const  Sign = () => {
    return (
       <>
       <div style={{ width: "100%" }} className=" iq-top-navbar">
        <div className="iq-navbar-custom">
          <nav className="fileviewheader navbar navbar-expand-lg navbar-light mt-2 ">
            <div className=" iq-navbar-logo d-flex align-items-center justify-content-between">
               <div className="sign">
               <Link href="/sign" className="navbar-brand header-logo iq-navbar-logo">
              <i className="las la-signature"></i>
              </Link>
               </div>
              <div className="">
                <h6 className='m-0 file_details'>New Sign Request
                </h6>
                <Link className='parent-section' href="/sign"><svg width="16" height="16" viewBox="0 0 16 16" className="folder-icon" focusable="false" aria-hidden="true" role="presentation">
                  <path fill="#909090" fillRule="evenodd"
                    d="M6.6 2L8 3.375h5.6c.77 0 1.4.619 1.4 1.375v6.875c0 .756-.63 1.375-1.4 1.375H2.4c-.77 0-1.4-.619-1.4-1.375l.007-8.25C1.007 2.619 1.63 2 2.4 2h4.2zM13 5H3v1h10V5z">
                  </path></svg>&nbsp;My Sign Requests</Link>
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
                    Send Request
                    </button>
                 
                  </li>
                 
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
      <div className="col-md-9">
      <div className="Esign">
      <Esign/>
      </div>
      </div>
      <div className='col-md-3 bg-white'>
      </div>
     
    </>
    );
}
export default Sign