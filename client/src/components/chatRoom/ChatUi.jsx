import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Plus, Send } from "lucide-react";
import { Plus, Send, Copy, Trash2, Check } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import "./chatUI.css";

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

export default function ChatInterface({ name, email, propMessages }) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    setMessages(propMessages);
  }, [propMessages]);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log("form use effect : ", selectedMessages);
  }, [selectedMessages]);

  useEffect(() => {
    console.log(contextMenu);
  }, [contextMenu]);

  //   const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessages([...messages, { text: newMessage, sent: true }]);
    scrollToBottom();
    setNewMessage("");
  };

  const handleContextMenu = useCallback((e, index, selectedMessages) => {
    e.preventDefault();
    console.log("this is selected messaes : ", selectedMessages);

    if (selectedMessages.includes(index)) {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        messageIndex: index,
        selectInnerHTML: "Deselect",
      });
    } else {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        messageIndex: index,
        selectInnerHTML: "select",
      });
    }
  }, []);

  const handleSelectMessage = useCallback((index) => {
    setSelectedMessages((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
    setContextMenu(null);
  }, []);
  const handleSelectMessageByClicking = useCallback(
    (index, selectedMessages) => {
      if (selectedMessages.length > 0) {
        setSelectedMessages((prev) =>
          prev.includes(index)
            ? prev.filter((i) => i !== index)
            : [...prev, index]
        );
        setContextMenu(null);
      }
    },
    []
  );

  const handleDeleteMessage = useCallback((index) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
    setContextMenu(null);
  }, []);

  const handleCopyMessage = useCallback(
    (index) => {
      navigator.clipboard.writeText(messages[index].text);
      setContextMenu(null);
    },
    [messages]
  );

  const handleCopySelected = useCallback(() => {
    const selectedTexts = selectedMessages
      .map((index) => messages[index].text)
      .join("\n");
    navigator.clipboard.writeText(selectedTexts);
    setSelectedMessages([]);
  }, [selectedMessages, messages]);

  const handleDeleteSelected = useCallback(() => {
    setMessages((prev) =>
      prev.filter((_, index) => !selectedMessages.includes(index))
    );
    setSelectedMessages([]);
  }, [selectedMessages]);

  return (
    <Card
      className="w-[380px] h-[600px] bg-zinc-950 border-zinc-800"
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
          <h3 className="font-semibold text-white">{name}</h3>
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
      >
        {messages.map((message, index) => (
          <div
            key={index}
            onContextMenu={(e) => handleContextMenu(e, index, selectedMessages)}
            className={`flex ${message.sent ? "justify-end" : "justify-start"}`}
            onClick={() =>
              handleSelectMessageByClicking(index, selectedMessages)
            }
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                message.sent
                  ? "bg-white text-zinc-900"
                  : "bg-zinc-800 text-zinc-100"
              } ${selectedMessages.includes(index) ? "opacity-50" : ""}`}
            >
              {message.text}
              {selectedMessages.includes(index) && (
                <Check className="inline-block ml-2 h-4 w-4 text-green-500" />
              )}
            </div>
          </div>
        ))}
        {/* <div ref={messagesEndRef} /> */}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800">
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
          onSelect={() => handleSelectMessage(contextMenu.messageIndex)}
          onDelete={() => handleDeleteMessage(contextMenu.messageIndex)}
          onCopy={() => handleCopyMessage(contextMenu.messageIndex)}
          selectInnerHTML={contextMenu.selectInnerHTML}
        />
      )}
    </Card>
  );
}
