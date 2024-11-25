import { useState } from "react";
import "./App.css";
import OAuth from "./components/OAuth";
import { Button } from "./components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <OAuth />
      <Button>Click me</Button>
    </>
  );
}

export default App;
