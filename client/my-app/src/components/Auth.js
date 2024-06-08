import React, { useState } from "react";
import { useCookies } from 'react-cookie';

function Auth() {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [error, setError] = useState(null);
  const [isLogIn, setIsLogin] = useState(true);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmpassword, setConfirmPassword] = useState(null);

  const viewLogin = (status) => {
    setError(null);
    setIsLogin(status);
  }
  
  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
    if (!isLogIn && password !== confirmpassword) {
      setError("Make sure the passwords match.");
      return;
    }
    
    const response = await fetch(`http://localhost:8000/${endpoint}`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  
    const data = await response.json();
    if (data.detail) {
      setError(data.detail);
    } else {
      setCookie("Email", data.email);
      setCookie('AuthToken', data.token);
      window.location.href = '/'
    }
  };

  return (
    <div className="auth-container">
      <div>
        <form>
          <h2>{isLogIn ? "please Log in " : "plase sign up"}</h2>
          <input className="auth-input" type="email" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
          <input className="auth-input" type="password" placeholder="password"  onChange={(e) => setPassword(e.target.value)} />
          {!isLogIn && <input className="auth-input" type="password" placeholder="confirm password"  onChange={(e) => setConfirmPassword(e.target.value)} />}
          <input className="auth-submit" type="submit" onClick={(e) => handleSubmit(e, isLogIn ? "login" : "signup")} />
          {error && <p className="auth-error">{error}</p>}
        </form>
      </div>
      <div>
        <button className="auth-button" onClick={() => { viewLogin(false) }}>Sign up</button>
        <button className="auth-button" onClick={() => { viewLogin(true) }}>Log In</button>
      </div>
    </div>
  );
}

export default Auth;
