import { signOut } from 'next-auth/react';

const LogoutButton = () => {
  const handleLogout = () => {
    signOut({ callbackUrl: '/login' }); 
  };

  return (
    
    <button className="btn btn-primary" onClick={handleLogout} >
      Logout
    </button>
  );
};

export default LogoutButton;
