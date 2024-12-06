import { useState, useEffect } from "react";
import "./App.css";
import OAuth from "./components/OAuth";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/Appsidebar";
import { Button } from "./components/ui/button";
import { VideoPlayer } from "./components/VideoPlayer";
import { IconRight } from "react-day-picker";
import HomeComponetn from "./components/home/HomeComponetn";
import CodeEditor from "./components/codeEditor/CodeEditor";

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
  return (
    <>
      {/* <OAuth /> */}
      {/* <Button>Click me</Button> */}
      <SidebarProvider>
        <AppSidebar
          changeToCodeEditor={updateCodeComponetAsPresesnt}
          changeToHome={updateHomeComponetAsPresesnt}
          changeToCourse={updateCourseComponetAsPresesnt}
        />
        <main style={{ width: "100%" }}>
          <SidebarTrigger />
          {/* <Button className={"absolute top-4 right-4"}>
            
          </Button> */}
          <OAuth
            style={{ position: "absolute", top: "10px", right: "10px" }}
            setGlobUser={setGlobUser}
          />
          {currentComponet === "home" ? (
            <HomeComponetn />
          ) : currentComponet === "codePlayGround" ? (
            <CodeEditor />
          ) : currentComponet === "course" ? (
            <VideoPlayer style={{ margin: "20px 0 0 40px" }} />
          ) : (
            <div>no componet choosed</div>
          )}
          {/* home componet and other main frame comps. will be render here */}
        </main>
      </SidebarProvider>
    </>
  );
}

export default App;
