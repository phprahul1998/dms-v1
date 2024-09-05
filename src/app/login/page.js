"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
const Login =()=>{
   const [usernameError, setUsernameError] = useState(false);
   const [passwordError, setPasswordError] = useState(false);
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [loginbtntext, setBtnText] = useState('Sign in');
   const { push } = useRouter();
   const handleSubmit = async (e) => {
      e.preventDefault();
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
      const username = e.target.username.value.trim();
      const password = e.target.password.value.trim();
      if (!username ) {
            toast.warn('Please Enter User Name',pro);
         setUsernameError(!username.trim());
         setBtnText('Login')
         return;
       }else if(!password){
         toast.warn('Please Enter Password',pro)
            setPasswordError(!password.trim());
            setBtnText('Login')
         return;
       }
     
       try {
         setBtnText('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class=""> Please wait</span>');
         const res = await signIn('credentials', {
           redirect: false,
           username,
           password,
         });
       
         if (res?.error) {
           toast.warn('Invalid Username or Password.Please try again.',pro)
           setBtnText('Sign In'); // Reset button text
         } else {
           const session = await getSession();
           if (session) {
             push('/folder/0'); 
           }
         }
       } catch (error) {
         toast.error('An error occurred during sign-in',pro)
         setBtnText('Sign In'); 
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
                     <h3 className="mb-3">Sign In</h3>
                     <p>Login to stay connected.</p>
                     <form onSubmit={handleSubmit}>
                     <div className="row">
                           <div className="col-lg-12">
                              <div className="floating-label form-group">
                              <input onChange={(e) => {
                              setUsername(e.target.value);
                              if (usernameError && e.target.value.trim()) {
                              setUsernameError(false);
                              }
                              }}
                              className={`floating-input form-control ${usernameError ? 'input-error' : ''}`}  id="username" name='username' type="text" placeholder=" "/>
                              <label>User Name</label>
                              </div>
                           </div>
                           <div className="col-lg-12">
                              <div className="floating-label form-group">
                                 <input onChange={(e) => {
                              setPassword(e.target.value);
                              if (passwordError && e.target.value.trim()) {
                                 setPasswordError(false);
                              }
                              }}
                              className={`floating-input form-control ${passwordError ? 'input-error' : ''}`} name='password' type="password" placeholder=" "/>
                                 <label>Password</label>
                              </div>
                           </div>
                           <div className="col-lg-12">
                            <Link  className="text-primary float-right" href="/forget-password">Forgot Password?</Link>
                           </div>
                        </div>
                        <button type="submit" className="btn btn-primary"  dangerouslySetInnerHTML={{ __html: loginbtntext }} />
                        <p className="mt-3">
                        Create an Account <Link  className="text-primary" href="/signup">Sign Up</Link>
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
export default Login