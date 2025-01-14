import { useState, useEffect } from "react";
import "./App.css";
import OAuth from "./components/OAuth";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/Appsidebar";
import { Button } from "./components/ui/button";
import { VideoPlayer } from "./components/VideoPlayer";
import { Toaster } from "@/components/ui/sonner";
import HomeComponetn from "./components/home/HomeComponetn";
import CodeEditor from "./components/codeEditor/CodeEditor";
import Course from "./components/courses/Course";
import ChatInterface from "./components/chatRoom/ChatUi";
import ChatRoom from "./components/chatRoom/ChatRoom";

function App() {
  const [globUser, setGlobUser] = useState(null);
  const [currentComponet, setCurrentComponet] = useState("home");
  const updateCodeComponetAsPresesnt = () => {
    setCurrentComponet("codePlayGround");
  };
  const updateHomeComponetAsPresesnt = () => {
    setCurrentComponet("home");
  };
  const updateCourseComponetAsPresesnt = () => {
    setCurrentComponet("course");
  };
  const updateChatRoomComponetAsPresesnt = () => {
    setCurrentComponet("chatRoom");
  };

  return (
    <>
      {/* <OAuth /> */}
      {/* <Button>Click me</Button> */}
      <SidebarProvider>
        <AppSidebar
          changeToCodeEditor={updateCodeComponetAsPresesnt}
          changeToHome={updateHomeComponetAsPresesnt}
          changeToCourse={updateCourseComponetAsPresesnt}
          changeToChatRoom={updateChatRoomComponetAsPresesnt}
        />
        <main style={{ width: "100%" }}>
          <SidebarTrigger />
          {/* <Button className={"absolute top-4 right-4"}>
            
          </Button> */}
          <OAuth
            style={{ position: "absolute", top: "10px", right: "10px" }}
            setGlobUser={setGlobUser}
          />

          {/* <Course/> */}
          {/* <CodeEditor /> */}
          {/* <ChatRoom userInfo={globUser} /> */}
          {currentComponet === "home" ? (
            <HomeComponetn />
          ) : currentComponet === "codePlayGround" ? (
            <CodeEditor />
          ) : currentComponet === "course" ? (
            // <VideoPlayer style={{ margin: "20px 0 0 40px" }} />
            <Course />
          ) : currentComponet === "chatRoom" ? (
            <ChatRoom userInfo={globUser} />
          ) : (
            <div>no componet choosed</div>
          )}
          {/* home componet and other main frame comps. will be render here */}
        </main>
        <Toaster position="top-center" richColors />
      </SidebarProvider>
    </>
  );
}

export default App;
