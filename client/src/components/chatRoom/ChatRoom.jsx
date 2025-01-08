import React from "react";
import ChatInterface from "./ChatUi";

const ChatRoom = () => {
  const chatData = {
    name: "Sofia Davis",
    email: "m@example.com",
    propMessages: [
      { text: "Hi, how can I help you today?", sent: false },
      { text: "Hey, I'm having trouble with my account.", sent: true },
      { text: "What seems to be the problem?", sent: false },
      { text: "I can't log in.", sent: true },
      { text: "Yeah its ok now I think.. .", sent: true },
      { text: "Ohh thats great", sent: false },
      { text: "Youa'e lucky ", sent: false },
      { text: "Nah Nah its my hard work i THink so ", sent: true },
    ],
  };
  return (
    <div style={{
        margin:"10px 0 0 20px "
    }}>
      <ChatInterface {...chatData} />
    </div>
  );
};

export default ChatRoom;
