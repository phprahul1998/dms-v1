"use client"
import { useState } from 'react';
import Link from 'next/link';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify';
const Signup = () => {
   const { push } = useRouter();
   const [signupbtntext, setBtnText] = useState('Register');
  const [formData, setFormData] = useState({
    userName: '',
    fullName: '',
    phoneNo: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
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
    const { userName, fullName, email,phoneNo, password, confirmPassword } = formData;
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!userName ){
      toast.warn('Enter User Name',property);
      return false;
    }else if(!fullName){
      toast.warn('Enter Your Full Name.',property);
      return false;
    }
    else if(!email){
      toast.warn('Enter Your Email Id.',property);
      return false;
    }
    else if(!emailRegex.test(email)) {
      toast.warn('Please enter a valid email address.',property);
      return false;
    }
    else if(!phoneNo){
      toast.warn('Enter Your Phone number.',property);
      return false;
    }
    else if(!password){
      toast.warn('Enter Your Password.',property);
      return false;
    }
    else if(!confirmPassword){
      toast.warn('Please confirm your password.',property);
      return false;
    }
    else if (password !== confirmPassword) {
      toast.warn('Passwords do not match.',property);
      return false;
    }
    return true;
  };
  
  const handleSubmit  = async (e) => {
    e.preventDefault();
    if (validateForm()) {
         setBtnText('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class=""> Please wait</span>');
         const registerResponse = await fetch(`${process.env.BASE_URL_ENDPOINT}/api/register/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: formData.userName,
              password: formData.password,
              email: formData.email,
              name: formData.fullName,
              phone: formData.phoneNo,
            }),
          });
          const data = await registerResponse.json();
          if(data.status==true){
            const res = await signIn('credentials', {
               redirect: false,
               username: formData.userName,
               password: formData.password,
             });
             if (res?.error) {
               toast.error(res.error);
               setBtnText('Register')
            } else {
               const session = await getSession();
               if (session) {
                push('/folder/0'); // Redirect to the /folder/0 page
              }
             }

          }else{
            toast.error(data.message);
            setBtnText('Register')
         }
    }
  };

  return (
    <div className="wrapper">
      <section className="login-content">
        <div className="container h-100">
          <div className="row justify-content-center align-items-center height-self-center">
            <div className="col-md-5 col-sm-12 col-12 align-self-center">
              <div className="sign-user_card">
                <img
                  src="/logo2.png"
                  className="img-fluid rounded-normal light-logo logo"
                  alt="logo"
                />
                <h3 className="mb-3">Sign Up</h3>
                <p>Create your account.</p>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="floating-label form-group">
                        <input
                          className="floating-input form-control"
                          type="text"
                          name="userName"
                          value={formData.userName}
                          onChange={handleInputChange}
                          placeholder=" "
                        />
                        <label>User Name</label>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="floating-label form-group">
                        <input
                          className="floating-input form-control"
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder=" "
                        />
                        <label>Full Name</label>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="floating-label form-group">
                        <input
                          className="floating-input form-control"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder=" "
                        />
                        <label>Email</label>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="floating-label form-group">
                        <input
                          className="floating-input form-control"
                          type="phone"
                          name="phoneNo"
                          value={formData.phoneNo}
                          onChange={handleInputChange}
                          placeholder=" "
                        />
                        <label>Phone number</label>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="floating-label form-group">
                        <input
                          className="floating-input form-control"
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder=" "
                        />
                        <label>Password</label>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="floating-label form-group">
                        <input
                          className="floating-input form-control"
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder=" "
                        />
                        <label>Confirm Password</label>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary"  dangerouslySetInnerHTML={{ __html: signupbtntext }} />
                  <p className="mt-3">
                    Already have an Account?{' '}
                    <Link className="text-primary" href="/login">
                      Login
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

export default Signup;
