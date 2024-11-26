import axios from "axios";
import React, { useEffect, useState } from "react";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const OAuth = ({ style }) => {
  useEffect(() => {
    console.log(`this is client id : ${clientId}`);
  }, []);
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
      { type: "standard", theme: "filled_black", width: "200", size: "large" }
    );
  }, []);

  const handleCredentialResponse = async (response) => {
    const token = response.credential; // The ID token

    // Send the token to your backend for validation
    try {
      const res = await axios.post(
        "http://localhost:8020/auth/google/callback",
        {
          token,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        const { userInfo, authToken } = res.data; // Extract user info and token
        setUser(userInfo);
        console.log(`user Info ${userInfo}`);
        console.log(`Auth token ${authToken}`);

        // Store the token securely
        localStorage.setItem("authToken", authToken);
      }
    } catch (error) {
      console.error(
        "Invalid Token or Error Occurred:",
        error.response?.data || error.message
      );
    }
  };

  const handleLogout = () => {
    setUser(null); // Clear user session
    localStorage.removeItem("authToken");
  };
  return (
    <div style={style}>
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
