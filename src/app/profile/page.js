"use client"
import Link from 'next/link'
import { useEffect,useState } from 'react';
import { useSession } from "next-auth/react"
import Sidebar from "../component/sidebar";
import Footer from "../component/footer";
import { toast } from 'react-toastify';
const Profile =()=>{
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
   const { data: session } = useSession();
   const [updatebtn, setUpdateBtn] = useState('Update');
   const [saveBtn, setSavingBtn] = useState('Save');
   const [formData, setFormData] = useState({
      username: '',
      name: '',
      email: '',
      phone: '',
      profilePic: null
   });
   const [passwordData, setPasswordData] = useState({
      old_password: '',
      new_password: '',
      confirm_password: ''
   });

   useEffect(() => {
      if (session && session.user) {
         const token = session.token;
         fetchUserData(token);
      }
   }, [session]);

   const fetchUserData = async (token) => {
      
      if (token) {
         try {
            const response = await fetch(`${process.env.BASE_URL_ENDPOINT}/api/user_profile/`, {
               method: 'GET',
               headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
               },
            });
            if (response.ok) {
               const userData = await response.json();
               setFormData(prevState => ({
                  ...prevState,
                  username: userData.data.username || '',
                  name: userData.data.name || '',
                  email: userData.data.email || '',
                  phone: userData.data.phone || ''
               }));
            } else {
               toast.error('Failed to fetch user data',pro);

            }
         } catch (error) {
            toast.error('Failed to fetch user data',pro);
         }
      }
   };

   const handleInputChange = (e) => {
      const { id, value } = e.target;
      setFormData(prevState => ({
         ...prevState,
         [id]: value
      }));
   };

   const handlePasswordChange = (e) => {
      const { id, value } = e.target;
      setPasswordData(prevState => ({
         ...prevState,
         [id]: value
      }));
   };

   const handleFileChange = (e) => {
      setFormData(prevState => ({
         ...prevState,
         profilePic: e.target.files[0]
      }));
   };

   const handlePersonalInfoSubmit = async (e) => {
      e.preventDefault();
      setUpdateBtn('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="">Updating...</span>');
      if (!session || !session.token) {
         console.error('No session or token available');
         return;
      }
      const formDataToSend = new FormData();
      for (const key in formData) {
         formDataToSend.append(key, formData[key]);
      }
      try {
         const response = await fetch(`${process.env.BASE_URL_ENDPOINT}/api/profile_update/`, {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${session.token}`,
            },
            body: formDataToSend
         });

         if (response.ok) {
            const result = await response.json();
            setUpdateBtn('Update')
            toast.success('Profile Updated successfully.',pro);

         } else {
            toast.error('Failed to update ',pro);
            setUpdateBtn('Update')

         }
      } catch (error) {
         toast.error('Failed to update ',pro);
         setUpdateBtn('Update')
      }
   };

   const handlePasswordSubmit = async (e) => {
      e.preventDefault();
      if (!session || !session.token) {
         console.error('No session or token available');
         return;
      }

      try {
         setSavingBtn('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="">Saving...</span>');
         const response = await fetch(`${process.env.BASE_URL_ENDPOINT}/api/reset_password/`, {
            method: 'POST',
            headers: {
               'Authorization': `Bearer ${session.token}`,
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(passwordData)
         });

         if (response.ok) {
            const result = await response.json();
            if(result.status==false){
               toast.error(result.data[0],pro);
               setSavingBtn('Save');

            }else{
               toast.success(result.message,pro);
               setSavingBtn('Save');
               setPasswordData({ old_password: '', new_password: '',confirm_password:'' });
            }
         } else {
         }
      } catch (error) {
         setSavingBtn('Save');
         toast.error('Error changing password',pro);
      }
   };
return(
<div>
<Sidebar/>
<div className="content-page">
      <div className="container-fluid">
         <div className="row">
            <div className="col-lg-12">
               <div className="card">
                  <div className="card-body p-0">
                     <div className="iq-edit-list usr-edit">
                        <ul className="iq-edit-profile d-flex nav nav-pills">
                           <li className="col-md-3 p-0">
                              <a className="nav-link active" data-toggle="pill" href="#personal-information">
                              Personal Information
                              </a>
                           </li>
                           <li className="col-md-3 p-0">
                              <a className="nav-link" data-toggle="pill" href="#chang-pwd">
                              Change Password
                              </a>
                           </li>
                           
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
            <div className="col-lg-12">
               <div className="iq-edit-list-data">
                  <div className="tab-content">
                     <div className="tab-pane fade active show" id="personal-information" role="tabpanel">
                        <div className="card">
                           <div className="card-header d-flex justify-content-between">
                              <div className="iq-header-title">
                                 <h4 className="card-title">Personal Information</h4>
                              </div>
                           </div>
                           <div className="card-body">
                           <form onSubmit={handlePersonalInfoSubmit}>
                                       <div className="form-group row align-items-center">
                                          <div className="col-md-12">
                                             <div className="profile-img-edit">
                                                <div className="crm-profile-img-edit">
                                                   <img className="crm-profile-pic rounded-circle avatar-100" src="/11.png" alt="profile-pic"/>
                                                   <div className="crm-p-image bg-primary">
                                                      <i className="las la-pen upload-button"></i>
                                                      <input className="file-upload" type="file" accept="image/*" onChange={handleFileChange} />
                                                   </div>
                                                </div>                                          
                                             </div>
                                          </div>
                                       </div>
                                       <div className=" row align-items-center">
                                          <div className="form-group col-sm-6">
                                             <label>User Name</label>
                                             <input type="text" className="form-control" readOnly id="username" value={formData.username} onChange={handleInputChange} />
                                          </div>
                                          <div className="form-group col-sm-6">
                                             <label>Full Name</label>
                                             <input type="text" required className="form-control" id="name" value={formData.name} onChange={handleInputChange} />
                                          </div>
                                          <div className="form-group col-sm-6">
                                             <label>Email</label>
                                             <input type="text" required className="form-control" id="email" value={formData.email} onChange={handleInputChange} />
                                          </div>
                                          <div className="form-group col-sm-6">
                                             <label>Phone</label>
                                             <input type="text" required className="form-control" id="phone" value={formData.phone} onChange={handleInputChange} />
                                          </div>
                                       </div>
                                       <button type="submit" className="btn btn-primary"  dangerouslySetInnerHTML={{ __html: updatebtn }} />
                                    </form>
                           </div>
                        </div>
                     </div>
                     <div className="tab-pane fade" id="chang-pwd" role="tabpanel">
                        <div className="card">
                           <div className="card-header d-flex justify-content-between">
                              <div className="iq-header-title">
                                 <h4 className="card-title">Change Password</h4>
                              </div>
                           </div>
                           <div className="card-body">
                           <form onSubmit={handlePasswordSubmit}>
                                       <div className="form-group">
                                          <label>Current Password:</label>
                                          <input type="password" required className="form-control" id="old_password" value={passwordData.old_password} onChange={handlePasswordChange} />
                                       </div>
                                       <div className="form-group">
                                          <label>New Password:</label>
                                          <input type="password" required className="form-control" id="new_password" value={passwordData.new_password} onChange={handlePasswordChange} />
                                       </div>
                                       <div className="form-group">
                                          <label>Confirm Password:</label>
                                          <input type="password" required className="form-control" id="confirm_password" value={passwordData.confirm_password} onChange={handlePasswordChange} />
                                       </div>
                                       <button type="submit" className="btn btn-primary mr-2"  dangerouslySetInnerHTML={{ __html: saveBtn }} />
                                    </form>
                           </div>
                        </div>
                     </div>
                     
                  </div>
               </div>
            </div>
         </div>
      </div>
      </div>
<Footer/>
</div>
);
}
export default Profile