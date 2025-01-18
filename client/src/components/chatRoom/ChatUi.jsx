import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
// import { Plus, Send } from "lucide-react";
import { Plus, Send, Copy, Trash2, Check, ReplyAll } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import "./chatUI.css";
import { io } from "socket.io-client";
import GroupsUI from "./GroupsUI";

const socket = io("http://localhost:8020", {
  auth: {
    token: localStorage.getItem("authToken"),
  },
});

const ContextMenu = ({ x, y, onSelect, onDelete, onCopy, selectInnerHTML }) => (
  <div
    className="absolute bg-zinc-800 rounded-md shadow-lg z-50 py-1"
    style={{ top: y, left: x }}
  >
    <button
      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700"
      onClick={onSelect}
    >
      {selectInnerHTML}
    </button>
    <button
      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700"
      onClick={onDelete}
    >
      Delete
    </button>
    <button
      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700"
      onClick={onCopy}
    >
      Copy
    </button>
  </div>
);

export default function ChatInterface({
  name,
  email,
  propMessages,
  userInfo,
  globeEnrolledCourses,
}) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [currentGroupName, setCurrentGroupName] = useState("");
  const [groupedMessages, setGroupedMessages] = useState({});
  // const [localUserInfo, setLocalUserInfo] = useState([]);

  useEffect(() => {
    // Listen for group messages from the server
    socket.on(
      "groupMessage",
      ({ groupId, message, sender, messageId, sent_at }) => {
        console.log(`Received message in group ${groupId}:`, message);
        console.log("this is sender : ", sender);
        console.log("this is local sender : ", userInfo);
        setMessages((prev) => {
          const previousMessages = prev || [];
          const newMessages = [
            ...previousMessages,
            {
              text: message,
              sent: sender === userInfo?.userId,
              messageId: messageId,
              sent_at: sent_at,
              sender: sender !== userInfo?.userId ? sender : undefined,
            },
          ];

          // Schedule scroll after state update
          setTimeout(scrollToBottom, 100);
          return newMessages;
        });
        // setMessages((prev) => {
        //   const previousMessages = prev || []; // Use an empty array if prev is undefined
        //   setTimeout(scrollToBottom, 100);
        //   if (sender === userInfo?.userId) {
        //     return [
        //       ...previousMessages,
        //       {
        //         text: message,
        //         sent: true,
        //         messageId: messageId,
        //         sent_at: sent_at,
        //       },
        //     ];
        //   } else {
        //     return [
        //       ...previousMessages,
        //       {
        //         text: message,
        //         sent: false,
        //         sender: sender,
        //         messageId: messageId,
        //         sent_at: sent_at,
        //       },
        //     ];
        //   }
        // });
      }
    );

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
      // alert(`Connection failed: ${err.message}`);
    });

    return () => {
      socket.off("groupMessage");
    };
  }, [userInfo]);

  useEffect(() => {
    // Emit the request for old messages
    if (currentGroup) {
      socket.emit("oldMessages", {
        groupId: currentGroup,
      });
      setMessages([]);
      isFirstRender.current = true;

      // Remove the old listener before adding a new one
      socket.off("oldMessagesResponse");

      socket.on("oldMessagesResponse", ({ groupId, messages: oldMessages }) => {
        console.log(`Old messages for group ${groupId}:`, oldMessages);
        const formattedMessages = oldMessages.map((message) => ({
          text: message.content,
          sent: message.userId === userInfo?.userId,
          messageId: message.message_id,
          sent_at: message.sent_at,
          sender:
            message.userId !== userInfo?.userId ? message.userId : undefined,
        }));
        setMessages(formattedMessages);
        // messages.forEach((message) => {
        //   setMessages((prev) => {
        //     const previousMessages = prev || [];
        //     if (message.userId === userInfo?.userId) {
        //       return [
        //         ...previousMessages,
        //         {
        //           text: message.content,
        //           sent: true,
        //           messageId: message.message_id,
        //           sent_at: message.sent_at,
        //         },
        //       ];
        //     } else {
        //       return [
        //         ...previousMessages,
        //         {
        //           text: message.content,
        //           sent: false,
        //           sender: message.userId,
        //           messageId: message.message_id,
        //           sent_at: message.sent_at,
        //         },
        //       ];
        //     }
        //   });
        // });
      });
    }
    // Optional: Clean up when the component unmounts
    return () => {
      socket.off("oldMessagesResponse");
    };
  }, [currentGroup, userInfo]);
  const chatContainerRef = useRef(null);
  const isFirstRender = useRef(true);

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      const height = chatContainerRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;

      chatContainerRef.current.scrollTo({
        top: maxScrollTop,
        behavior: "smooth",
      });
    }
  }, []);
  useEffect(() => {
    // setLocalUserInfo(userInfo);
  }, [userInfo]);

  // useEffect(() => {
  //   setMessages(propMessages);
  // }, [propMessages]);
  // useEffect(() => {
  //   console.log("on : ", messages);
  //   setGroupedMessages(groupMessagesByDate(messages));
  //   scrollToBottom();
  // }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      console.log("Messages updated:", messages);
      setGroupedMessages(groupMessagesByDate(messages));

      // Add a small delay to ensure DOM has updated
      const scrollTimer = setTimeout(() => {
        if (!isFirstRender.current) {
          scrollToBottom();
        } else {
          // For first render (old messages), scroll after a longer delay
          const initialScrollTimer = setTimeout(() => {
            scrollToBottom();
            isFirstRender.current = false;
          }, 100);
          return () => clearTimeout(initialScrollTimer);
        }
      }, 0);
      return () => clearTimeout(scrollTimer);
    }
  }, [messages, scrollToBottom]);
  useEffect(() => {
    console.log("form use effect : ", selectedMessages);
  }, [selectedMessages]);

  useEffect(() => {
    console.log(contextMenu);
  }, [contextMenu]);

  //   const messagesEndRef = useRef(null);
  // const chatContainerRef = useRef(null);

  // const scrollToBottom = () => {
  //   if (chatContainerRef.current) {
  //     chatContainerRef.current.scrollTop =
  //       chatContainerRef.current.scrollHeight;
  //   }
  // };

  const joinGroup = (groupId, unreadSts, updateGroups, groups) => {
    if (currentGroup === groupId) {
      console.log(`Already in group: ${groupId}`);
      return; // Prevent redundant joins
    }
    setCurrentGroup(groupId);
    socket.emit("joinGroup", { groupId, unreadSts });
    console.log(`Joined group: ${groupId}`);
    console.log("revrerse groups : ", groups);
    const newGrp = groups.map((group) => {
      return { ...group, unread: false };
    });
    updateGroups(newGrp);
  };
  const sendMessage = async (message) => {
    if (!currentGroup) {
      alert("Please select a group first!");
      return;
    }

    // Send message to the backend for the current group
    socket.emit("sendMessageToGroup", {
      groupId: currentGroup,
      message: newMessage,
    });

    // Update UI locally
    // setMessages((prev) => [
    //   ...prev,
    //   { groupId: currentGroup, text: newMessage, sent: true },
    // ]);
    setNewMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setMessages([...messages, { text: newMessage, sent: true }]);
    if (newMessage.trim()) {
      await sendMessage(newMessage);
      // scrollToBottom();
      requestAnimationFrame(scrollToBottom);
    }
    setNewMessage("");
  };

  const handleContextMenu = useCallback(
    (e, messageId) => {
      e.preventDefault();
      console.log("this is selected messaes : ", selectedMessages);

      if (selectedMessages.includes(messageId)) {
        setContextMenu({
          x: e.clientX,
          y: e.clientY,
          messageId,
          selectInnerHTML: "Deselect",
        });
      } else {
        setContextMenu({
          x: e.clientX,
          y: e.clientY,
          messageId,
          selectInnerHTML: "select",
        });
      }
    },
    [selectedMessages]
  );

  const handleSelectMessage = useCallback((messageId) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
    setContextMenu(null);
  }, []);
  const handleSelectMessageByClicking = useCallback(
    (messageId, selectedMessages) => {
      if (selectedMessages.length > 0) {
        setSelectedMessages((prev) =>
          prev.includes(messageId)
            ? prev.filter((id) => id !== messageId)
            : [...prev, messageId]
        );
        setContextMenu(null);
      }
    },
    []
  );

  const handleDeleteMessage = useCallback(
    (messageId) => {
      console.log(
        "its got trigged : ",
        selectedMessages,
        "with messageid : ",
        messageId
      );
      setMessages((prev) =>
        prev.filter((message) => message.messageId !== messageId)
      );
      setContextMenu(null);
    },
    [selectedMessages]
  );

  const handleCopyMessage = useCallback(
    (messageId) => {
      const message = messages.find((msg) => msg.messageId === messageId);
      if (message) {
        navigator.clipboard.writeText(message.text);
      }
      // navigator.clipboard.writeText(messages[index].text);
      setContextMenu(null);
    },
    [messages]
  );

  const handleCopySelected = useCallback(() => {
    const selectedTexts = selectedMessages
      .filter((message) => selectedMessages.includes(message.messageId))
      .map((message) => message.text)
      .join("\n");
    navigator.clipboard.writeText(selectedTexts);
    setSelectedMessages([]);
  }, [selectedMessages, messages]);

  const handleDeleteSelected = useCallback(() => {
    setMessages((prev) =>
      prev.filter((message) => !selectedMessages.includes(message.messageId))
    );
    setSelectedMessages([]);
  }, [selectedMessages]);
  const formatMySQLTime = (mysqlTime) => {
    // Parse the input time
    const date = new Date(mysqlTime);

    // Extract hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine am/pm
    const ampm = hours >= 12 ? "pm" : "am";

    // Convert to 12-hour format
    hours = hours % 12 || 12; // Convert '0' hour to '12' for 12-hour format

    // Format minutes to always be two digits
    const formattedMinutes = minutes.toString().padStart(2, "0");

    // Construct the formatted time
    return `${hours}:${formattedMinutes}${ampm}`;
  };
  const groupMessagesByDate = (_) => {
    return _.reduce((acc, message) => {
      // Extract the date part of the timestamp (e.g., "2025-01-17")
      const date = new Date(message.sent_at).toISOString().split("T")[0];

      // Check if the date already exists in the accumulator
      if (!acc[date]) {
        acc[date] = [];
      }

      // Add the message to the appropriate date group
      acc[date].push(message);

      return acc;
    }, {});
  };

  return (
    <>
      {/* <button
        onClick={() => {
          joinGroup("niceGrp");
        }}
      >
        join grp
      </button> */}
      <div
        className="h-[600px]"
        style={{
          display: "flex",
        }}
      >
        <div
          className="group-ui-container chatUIContainer"
          style={{
            overflowY: "auto",
            width: "330px",
            border: "1px solid #27272a",
            borderRadius: "8px",
            borderRight: "none",
          }}
        >
          <GroupsUI
            setCurrentGroup={setCurrentGroup}
            globeEnrolledCourses={globeEnrolledCourses}
            joinGroup={joinGroup}
            setCurrentGroupName={setCurrentGroupName}
          />
        </div>
        {currentGroup && currentGroupName ? (
          <>
            <Card
              className="w-[580px] h-[600px] bg-zinc-950 border-zinc-800"
              onClick={() => {
                setContextMenu(null);
              }}
            >
              <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">
                    {currentGroupName}
                  </h3>
                  <p className="text-sm text-zinc-400">{email}</p>
                </div>
                {selectedMessages.length > 0 ? (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-zinc-400"
                      onClick={handleCopySelected}
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-zinc-400"
                      onClick={handleDeleteSelected}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <Button size="icon" variant="ghost" className="text-zinc-400">
                    <Plus className="h-5 w-5" />
                  </Button>
                )}
              </div>

              <div
                ref={chatContainerRef}
                className="chatUIContainer flex-1 p-4 overflow-y-auto h-[calc(100%-140px)] space-y-4"
                style={{ scrollBehavior: "smooth" }}
              >
                {Object.keys(groupedMessages).map((date) => (
                  <div key={date}>
                    {/* Date Separator */}
                    <div
                      className="date-separator"
                      style={{
                        textAlign: "center",
                        margin: "10px 0",
                        fontSize: "0.9em",
                        cursor: "pointer",
                      }}
                    >
                      <Badge
                        style={{
                          color: "#fff",
                          backgroundColor: "#9c27b0",
                        }}
                      >
                        {new Date(date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Badge>
                    </div>

                    {/* Messages for the Date */}
                    {groupedMessages[date]?.map((message, index) => (
                      <div
                        key={message.messageId}
                        onContextMenu={(e) =>
                          handleContextMenu(
                            e,
                            message.messageId,
                            selectedMessages
                          )
                        }
                        className={`flex ${
                          message.sent ? "justify-end" : "justify-start"
                        }`}
                        onClick={() =>
                          handleSelectMessageByClicking(
                            message.messageId,
                            selectedMessages
                          )
                        }
                      >
                        {!message.sent ? (
                          <>
                            <div
                              style={{
                                position: "relative",
                                bottom: "10px",
                              }}
                            >
                              <Avatar
                                className={"w-[30px] h-[30px]"}
                                style={{
                                  marginTop: "16px",
                                }}
                              >
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>SD</AvatarFallback>
                              </Avatar>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                        <div
                          className={`rounded-lg px-4 py-2 max-w-[80%] ${
                            message.sent
                              ? "bg-white text-zinc-900 recivers-message"
                              : "bg-zinc-800 text-zinc-100 senders-messafe"
                          } ${
                            selectedMessages.includes(message.messageId)
                              ? "opacity-50"
                              : ""
                          }`}
                        >
                          {!message.sent ? (
                            <>
                              <p
                                style={{
                                  color: "yellow",
                                  position: "relative",
                                  top: "-8px",
                                  fontSize: "0.8em",
                                  left: "-9px",
                                }}
                              >
                                {message.sender || "user not found"}
                              </p>
                            </>
                          ) : (
                            <></>
                          )}
                          {!message.sent ? (
                            <>
                              <div
                                className="replay-icon"
                                style={{
                                  position: "absolute",
                                  right: "-30px",
                                  cursor: "pointer",
                                  top: "50%",
                                }}
                              >
                                <ReplyAll />
                              </div>
                            </>
                          ) : (
                            <></>
                          )}

                          {message.text}

                          {selectedMessages.includes(message.messageId) && (
                            <Check className="inline-block ml-2 h-4 w-4 text-green-500" />
                          )}
                          <div
                            className="message-sent-timestapmp"
                            style={{
                              // outline: "1px solid red",
                              position: "relative",
                              width: "100%",
                              fontSize: "0.8rem",
                              // float: "right",
                              textAlign: "right",
                              color: message.sent ? "#ff5722" : "#2196f3", // Ensure the conditional resolves to a single value
                            }}
                          >
                            {formatMySQLTime(message.sent_at)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                {/* <div ref={messagesEndRef} /> */}
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-4 border-t border-zinc-800"
                style={{ paddingTop: "9px" }}
              >
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-white hover:bg-zinc-200"
                  >
                    <Send className="h-4 w-4 text-zinc-900" />
                  </Button>
                </div>
              </form>
              {contextMenu && (
                <ContextMenu
                  x={contextMenu.x}
                  y={contextMenu.y}
                  onSelect={() => handleSelectMessage(contextMenu.messageId)}
                  onDelete={() => handleDeleteMessage(contextMenu.messageId)}
                  onCopy={() => handleCopyMessage(contextMenu.messageId)}
                  selectInnerHTML={contextMenu.selectInnerHTML}
                />
              )}
            </Card>
          </>
        ) : (
          <>
            <Card
              className="w-[580px] h-[600px] bg-zinc-950 border-zinc-800"
              onClick={() => {
                setContextMenu(null);
              }}
            >
              <div class="chat-placeholder">
                <h2>Select a group to get started</h2>
                <p>
                  Conversations live here. Choose a group and let learnings as
                  deep as sea
                </p>
              </div>
            </Card>
          </>
        )}
      </div>
    </>
  );
}

// {messages?.map((message, index) => (
//   <div
//     key={message.messageId}
//     onContextMenu={(e) =>
//       handleContextMenu(e, message.messageId, selectedMessages)
//     }
//     className={`flex ${
//       message.sent ? "justify-end" : "justify-start"
//     }`}
//     onClick={() =>
//       handleSelectMessageByClicking(
//         message.messageId,
//         selectedMessages
//       )
//     }
//   >
//     {!message.sent ? (
//       <>
//         <div
//           style={{
//             position: "relative",
//             bottom: "10px",
//           }}
//         >
//           <Avatar
//             className={"w-[30px] h-[30px]"}
//             style={{
//               marginTop: "16px",
//             }}
//           >
//             <AvatarImage src="/placeholder.svg" />
//             <AvatarFallback>SD</AvatarFallback>
//           </Avatar>
//         </div>
//       </>
//     ) : (
//       <></>
//     )}
//     <div
//       className={`rounded-lg px-4 py-2 max-w-[80%] ${
//         message.sent
//           ? "bg-white text-zinc-900 recivers-message"
//           : "bg-zinc-800 text-zinc-100 senders-messafe"
//       } ${
//         selectedMessages.includes(message.messageId)
//           ? "opacity-50"
//           : ""
//       }`}
//     >
//       {!message.sent ? (
//         <>
//           <p
//             style={{
//               color: "yellow",
//               position: "relative",
//               top: "-8px",
//               fontSize: "0.8em",
//               left: "-9px",
//             }}
//           >
//             {message.sender || "user not found"}
//           </p>
//         </>
//       ) : (
//         <></>
//       )}
//       {!message.sent ? (
//         <>
//           <div
//             className="replay-icon"
//             style={{
//               position: "absolute",
//               right: "-30px",
//               cursor: "pointer",
//               top: "50%",
//             }}
//           >
//             <ReplyAll />
//           </div>
//         </>
//       ) : (
//         <></>
//       )}

//       {message.text}

//       {selectedMessages.includes(message.messageId) && (
//         <Check className="inline-block ml-2 h-4 w-4 text-green-500" />
//       )}
//       <div
//         className="message-sent-timestapmp"
//         style={{
//           // outline: "1px solid red",
//           position: "relative",
//           width: "100%",
//           fontSize: "0.8rem",
//           // float: "right",
//           textAlign: "right",
//           color: message.sent ? "#ff5722" : "#2196f3", // Ensure the conditional resolves to a single value
//         }}
//       >
//         {formatMySQLTime(message.sent_at)}
//       </div>
//     </div>
//   </div>
// ))}
