// src/pages/ChatPage.jsx
import { useState } from "react";
import ChatList from "../components/ChatList";
import ChatArea from "../components/ChatArea";

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-screen">
      <ChatList selectUser={setSelectedUser} />
      {selectedUser ? <ChatArea selectedUser={selectedUser} /> : (
        <div className="w-2/3 flex items-center justify-center text-gray-500">
          Select a user to chat
        </div>
      )}
    </div>
  );
};

export default ChatPage;
