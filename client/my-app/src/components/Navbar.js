import React from 'react';
import { useCookies } from 'react-cookie';

const Navbar = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const userEmail = cookies.Email;

  const signOut = () => {
    removeCookie('Email');
    removeCookie('AuthToken');
    window.location.reload();
  };

  return (
    <div className='Navbar'>
      <p>Welcome! {userEmail}</p>
      <button className="signout" onClick={signOut}>Sign Out</button>
    </div>
  );
}

export default Navbar;
