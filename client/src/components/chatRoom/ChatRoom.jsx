import ChatInterface from "./ChatUi";

const ChatRoom = ({ userInfo, globeEnrolledCourses }) => {
  return (
    <div
      style={{
        margin: "10px 0 0 20px ",
      }}
    >
      <ChatInterface
        userInfo={userInfo}
        globeEnrolledCourses={globeEnrolledCourses}
      />
      {/* <GroupsUI/> */}
    </div>
  );
};

export default ChatRoom;
