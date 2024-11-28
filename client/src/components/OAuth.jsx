import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
// import {  } from "@radix-ui/react-popover";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import config from "@/config";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const verifyAuthToken = async (authToken, setUser, setGlobUser) => {
  const headers = {
    "Content-Type": "application/json",
    authorization: authToken,
  };
  try {
    const res = await axios.get(`${config.apiBaseUrl}/api/verify/auth`, {
      headers: headers,
    });
    if (res.status === 200) {
      const userData = res.data.user[0];
      const verifiedUser = {
        name: userData.google_name,
        email: userData.email,
        picture: userData.pictureURL,
      };
      setUser(verifiedUser);
      setGlobUser(verifiedUser);
      const signInButton = document.getElementById("googleSignInButton");
      if (signInButton) {
        signInButton.innerHTML = ""; // Clear the button's content
      }
      console.log(res.data);
    }
  } catch (error) {}
};

const OAuth = ({ style, setGlobUser }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      console.log("its presented");

      verifyAuthToken(authToken, setUser, setGlobUser);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse, // Called on successful login
      });

      // Render the Google Sign-In button
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"),
        { type: "standard", theme: "filled_black", width: "200", size: "large" }
      );
    }
  }, [user]);

  const handleCredentialResponse = async (response) => {
    const token = response.credential; // The ID token

    // Send the token to your backend for validation
    try {
      const res = await axios.post(
        `${config.apiBaseUrl}/auth/google/callback`,
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
        setGlobUser(userInfo);
        console.log(userInfo);
        console.log(`Auth token ${authToken}`);

        // Store the token securely
        localStorage.setItem("authToken", authToken);
        const signInButton = document.getElementById("googleSignInButton");
        if (signInButton) {
          signInButton.innerHTML = ""; // Clear the button's content
        }
      }
    } catch (error) {
      console.error(
        "Invalid Token or Error Occurred:",
        error.response?.data || error.message
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null); // Clear user session
    setGlobUser(null); // Clear user session
  };
  const [hover, setHover] = useState(false);
  const divNormalStyle = {
    outline: "1px solid white",
    padding: "4px 0px",
    width: "170px",
    display: "flex",
    fontSize: "1.2em",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: "8px",
    cursor: "pointer",
  };
  const divHoverStyle = {
    backgroundColor: "#3f3f46",
  };
  return (
    <div style={style}>
      {!user ? (
        <div id="googleSignInButton"></div>
      ) : (
        <>
          <Popover>
            <PopoverTrigger>
              {" "}
              <div
                style={
                  hover
                    ? { ...divNormalStyle, ...divHoverStyle }
                    : divNormalStyle
                }
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >
                <img
                  src={`${config.apiBaseUrl}/proxy-image?url=${user.picture}`}
                  alt="profile"
                  style={{
                    width: "40px",
                    borderRadius: "50%",
                    marginRight: "-25px",
                    // outline: "1px solid green",
                  }}
                />
                <h2>{user.name}</h2>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <div className="logout-wrapper" style={{ marginLeft: "170px" }}>
                <Button
                  style={
                    {
                      // outline: "1px solid green",
                    }
                  }
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </>
      )}
    </div>
  );
};

export default OAuth;

/**
 const test = {
        message: "Token verified",
        user: [
          {
            authId: "106068292256063451762",
            email: "tom.jerry.07.05.06@gmail.com",
            google_name: "Tamil 07",
            pictureURL:
              "https://lh3.googleusercontent.com/a/ACg8ocIPoZh48EA9WbI7nEA8CSeMrHg1S8ujRIOHN3JnElDM7T3Tl2g=s96-c",
            created_at: "2024-11-27T07:45:44.000Z",
            idKey: null,
          },
        ],
      };
 */
