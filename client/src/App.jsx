import { useState, useEffect } from "react";
import "./App.css";
import OAuth from "./components/OAuth";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/Appsidebar";
import { Button } from "./components/ui/button";
import { VideoPlayer } from "./components/VideoPlayer";
function App() {
  const [count, setCount] = useState(0);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    console.log(date);
  }, [date]);

  return (
    <>
      {/* <OAuth /> */}
      {/* <Button>Click me</Button> */}
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <Button className={"absolute top-4 right-4"}>
            Login With google
          </Button>
          {/* video componet and other main frame comps. will be render here */}
          <VideoPlayer
            style={{ margin:"20px 0 0 40px"}}
          />
        </main>
      </SidebarProvider>
    </>
  );
}

export default App;
