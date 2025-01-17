import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
// import {  } from "@radix-ui/react-popover";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import config from "@/config";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const verifyAuthToken = async (authToken, setUser, setGlobUser) => {
  const headers = {
    "Content-Type": "application/json",
    authorization: authToken,
  };
  console.log("auth token is verifying");

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
        userId: userData.userId,
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
  const [guestId, setGuestId] = useState("");
  const [userNamePopUp, setUserNamePopUp] = useState(false);
  const [guestLogin, setGuestLogin] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    console.log("thisi is auth otke", authToken);

    if (authToken) {
      console.log("its presented");

      verifyAuthToken(authToken, setUser, setGlobUser);
    }
  }, [guestLogin]);

  useEffect(() => {
    if (!user) {
      try {
        window?.google?.accounts?.id?.initialize({
          client_id: clientId,
          callback: handleCredentialResponse, // Called on successful login
        });

        // Render the Google Sign-In button
        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInButton"),
          {
            type: "standard",
            theme: "filled_black",
            width: "200",
            size: "large",
          }
        );
      } catch (error) {
        console.error(error);
      }
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
        const { userInfo, authToken, duplicate } = res.data;
        setUser(userInfo);
        setGlobUser(userInfo);
        console.log(userInfo);
        localStorage.setItem("authToken", authToken);
        if (!duplicate) {
          setUserNamePopUp(true);
        }
        console.log(`Auth token ${authToken}`);

        // Store the token securely
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
  const handleGuestLogin = () => {
    console.log("changed");
    localStorage.setItem("authToken", guestId);

    setGuestLogin(!guestLogin);
  };
  const handleInputChange = (event) => {
    setGuestId(event.target.value);
  };

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };
  const updateUserName = async (userName) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("authToken"),
      };
      const response = await axios.post(
        `${config.apiBaseUrl}/api/setusername`,
        { userName },
        { headers: headers }
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };
  const handleUpdateUserName = async () => {
    try {
      alert(userName);
      const res = await updateUserName(userName);
      if (res.message === "success") {
        setUserNamePopUp(false);
        setGlobUser([{ ...user, userId: userName }]);
        console.log("after username : ", user);
      }
    } catch (error) {
      console.error(error);
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
        <div
          style={{
            display: "flex",
            gap: "30px",
            alignItems: "center",
          }}
        >
          <>
            <Popover>
              <PopoverTrigger>
                <div
                  style={{
                    border: "1px solid",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  Guest login
                </div>
              </PopoverTrigger>
              <PopoverContent style={{ width: "340px" }}>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Guest Id"
                    value={guestId}
                    onChange={handleInputChange}
                  />
                  <Button type="button" onClick={handleGuestLogin}>
                    Login
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </>

          <div id="googleSignInButton"></div>
        </div>
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
      {userNamePopUp ? (
        <>
          <div
            style={{
              width: "100vw",
              height: "100vh",
              position: "absolute",
              top: "-10px",
              left: "-1024%",
              zIndex: "999",
              // transform: "translate(-50%, -50%)",
              backgroundColor: "#000000d9",
              // outline: "1px solid red",
              padding: "12px",
              display: "flex",
              // alignItems:"center",
              justifyContent: "center",
            }}
          >
            <div
              className="username-input-wrapper"
              style={{
                marginTop: "300px",
                display: "flex",
                gap: "10px",
              }}
            >
              <Input
                style={{
                  height: "40px",
                  width: "200px",
                  marginTop: "20px",
                }}
                onChange={handleUserNameChange}
                type="text"
                placeholder="User Name"
              />
              <div
                className="username-btn"
                style={{
                  marginTop: "20px",
                }}
              >
                <Button onClick={handleUpdateUserName}>Update User Name</Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
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
