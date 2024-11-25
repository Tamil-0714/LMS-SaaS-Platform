import React, { useEffect, useState } from "react";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID


const OAuth = () => {

  useEffect(()=>{
    console.log(`this is client id : ${clientId}`);
    
  },[])
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize Google Identity Services
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse, // Called on successful login
    });

    // Render the Google Sign-In button
    window.google.accounts.id.renderButton(
      document.getElementById("googleSignInButton"),
      { type: "standard",theme:"filled_black",width:"400", size: "large" }
    );
  }, []);

  const handleCredentialResponse = async (response) => {
    const token = response.credential; // The ID token

    // Send the token to your backend for validation
    const res = await fetch("http://localhost:8020/auth/google/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (res.ok) {
      const userInfo = await res.json(); // User information from Google
      setUser(userInfo);
    } else {
      console.error("Invalid Token");
    }
  };

  const handleLogout = () => {
    setUser(null); // Clear user session
  };
  return (
    <div>
      <h1>Google Login</h1>
      {!user ? (
        <div id="googleSignInButton"></div>
      ) : (
        <div>
          <h2>Welcome, {user.name}</h2>
          <img src={user.picture} alt="profile" />
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default OAuth;
