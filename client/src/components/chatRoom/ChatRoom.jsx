
import ChatInterface from "./ChatUi";
import GroupsUI from "./GroupsUI";

const ChatRoom = ({ userInfo, globeEnrolledCourses }) => {
  const chatData = {
    name: "Sofia Davis",
    email: "m@example.com",
    // propMessages: [
    //   { text: "Hi, how can I help you today?", sent: false, messageId: 0 },
    //   { text: "i can do anything", sent: false, messageId: 1 },
    //   {
    //     text: "Hey, I'm having trouble with my account.",
    //     sent: true,
    //     messageId: 2,
    //   },
    //   { text: "What seems to be the problem?", sent: false, messageId: 3 },
    //   { text: "I can't log in.", sent: true, messageId: 4 },
    //   { text: "Yeah its ok now I think.. .", sent: true, messageId: 5 },
    //   { text: "Ohh thats great", sent: false, messageId: 6 },
    //   { text: "Youa'e lucky ", sent: false, messageId: 7 },
    //   {
    //     text: "Nah Nah its my hard work i THink so ",
    //     sent: true,
    //     messageId: 9,
    //   },
    // ],
    propMessages: [
      { text: "1", sent: false, messageId: 100 },
      { text: "2", sent: false, messageId: 105 },
      {
        text: "3",
        sent: true,
        messageId: 20,
      },
      { text: "4", sent: false, messageId: 324 },
      { text: "5", sent: true, messageId: 41 },
      { text: "6", sent: true, messageId: 52 },
      { text: "7", sent: false, messageId: 64 },
      { text: "8", sent: false, messageId: 27 },
      {
        text: "9",
        sent: true,
        messageId: 97,
      },
    ],
  };

 
  return (
    <div
      style={{
        margin: "10px 0 0 20px ",
      }}
    >
      <ChatInterface
        {...chatData}
        userInfo={userInfo}
        globeEnrolledCourses={globeEnrolledCourses}
      />
      {/* <GroupsUI/> */}
    </div>
  );
};

export default ChatRoom;
