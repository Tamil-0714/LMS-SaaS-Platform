import { useState, useEffect } from "react";
import "./App.css";
import OAuth from "./components/OAuth";
import { Button } from "./components/ui/button";
import { Calendar } from "./components/ui/calendar";

function App() {
  const [count, setCount] = useState(0);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    console.log(date);
  }, [date]);

  return (
    <>
      <OAuth />
      <Button>Click me</Button>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow"
        classNames={{
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        }}
      />
    </>
  );
}

export default App;
