"use client"
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';
const Forgetpassword =()=>{
   const [resetmail, setResetmail] = useState('');
   const [resetbtn, setResetBtn] = useState('Reset');
   const property = {
      position: "top-right",
      autoClose: 600,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: 0,
      theme: "colored",
     
      }
   const handleSubmit = async (e) => {
    setResetBtn('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class=""> Please wait</span>');
      e.preventDefault();
      if (resetmail == '') {
        toast.warn('Please Enter Your Registered Email ID.',property);
        return;
      }
      
      try {
        const response = await fetch(`${process.env.BASE_URL_ENDPOINT}/api/forgot-password/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'email':resetmail
          }),
        });
  
        const result = await response.json();
        if (result.status==true) {
          toast.success(result.message,property);
          setResetmail('')
          setResetBtn('Reset')
        } else {
          toast.warn(result.message,property);
          setResetBtn('Reset')
  
        }
      } catch (error) {
        toast.warn('An error occurred!',property);
        setResetBtn('Reset')
      }
    };
    return(
        <div className="wrapper">
        <section className="login-content">
           <div className="container h-100">
              <div className="row justify-content-center align-items-center height-self-center">
                 <div className="col-md-5 col-sm-12 col-12 align-self-center">
                    <div className="sign-user_card">
                          <img src="/logo2.png" className="img-fluid rounded-normal light-logo logo" alt="logo"/>
                       <h2 className="mb-3">Reset Password</h2>
                       <p>Enter your email address and we will send you an email with instructions to reset your password.</p>
                       <form onSubmit={handleSubmit}>
                       <div className="row">
                             <div className="col-lg-12">
                                <div className="floating-label form-group">
                                   <input className="floating-input form-control" type="email" placeholder=" " value={resetmail}
                          onChange={(e) => setResetmail(e.target.value)} />
                                   <label>Email</label>
                                </div>
                             </div>
                          </div>
                          <button type="submit" className="btn btn-primary"  dangerouslySetInnerHTML={{ __html: resetbtn }} />
                          <p className="mt-3">
                          
                    <Link className="text-primary" href="/login">
                      Back to Login
                    </Link>
                  </p>
                       </form>
                    </div>
                 </div>
              </div>
           </div>
        </section>
        </div>
    );
}
export default Forgetpassword