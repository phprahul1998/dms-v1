"use client"
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';


const ResetPassword = ({ params: { slug } }) => {
  const [firstParam, secondParam] = slug; 
  const [resetbtn, setResetBtn] = useState('Reset Password');
  const uidb64 = firstParam;
  const token = secondParam;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    e.preventDefault();
    if (password == '') {
      toast.warn('Please Enter New Password',property);
      return;
    }
     if(confirmPassword==''){
      toast.warn('Please Confirm your  Password',property);
      return;
    }
    if (password !== confirmPassword) {
      toast.warn('Passwords do not match',property);
      return;
    }
    try {
      setResetBtn('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class=""> Please wait</span>');
      const response = await fetch(`${process.env.BASE_URL_ENDPOINT}/api/reset-password-forget/${uidb64}/${token}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
        }),
      });

      const result = await response.json();

      if (result.status==true) {
        toast.success(result.message,property);
        setPassword('');
        setConfirmPassword('');
        setResetBtn('Reset Password')
      } else {
        toast.error(result.message,property);
        setResetBtn('Reset Password')


      }
    } catch (error) {
      toast.error('An error occurred!',property);
      setResetBtn('Reset Password')
    }
  };

  return (
    <div className="wrapper">
      <section className="login-content">
        <div className="container h-100">
          <div className="row justify-content-center align-items-center height-self-center">
            <div className="col-md-5 col-sm-12 col-12 align-self-center">
              <div className="sign-user_card">
                <img src="/logo2.png" className="img-fluid rounded-normal light-logo logo" alt="logo" />
                <h2 className="mb-3">Reset Account Password</h2>
                <p>Enter New Password</p>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="floating-label form-group">
                        <input
                          className="floating-input form-control"
                          type="password"
                          placeholder=" "
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <label>Password</label>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="floating-label form-group">
                        <input
                          className="floating-input form-control"
                          type="password"
                          placeholder=" "
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <label>Confirm Password</label>
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
};

export default ResetPassword;
