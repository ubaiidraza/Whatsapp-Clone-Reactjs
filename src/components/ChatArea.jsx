// src/components/ChatArea.jsx
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import { useAuth } from "../context/AuthContext";


const ChatArea = ({ selectedUser }) => {
  const { currentUser } = useAuth();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const chatId = currentUser.uid > selectedUser.uid
    ? `${currentUser.uid + selectedUser.uid}`
    : `${selectedUser.uid + currentUser.uid}`;

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, snapshot => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });

    return () => unsub();
  }, [chatId]);

  const handleSend = async () => {
    if (text.trim() === "") return;
    await addDoc(collection(db, "messages"), {
      text,
      senderId: currentUser.uid,
      receiverId: selectedUser.uid,
      chatId,
      createdAt: serverTimestamp(),
    });
    setText("");
  };

  return (
    <div className="w-2/3 p-4 flex flex-col">
      <h2 className="font-bold mb-2 border-b pb-2">{selectedUser.displayName}</h2>
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.senderId === currentUser.uid ? "text-right" : "text-left"}`}>
            <div className="inline-block bg-blue-200 px-3 py-1 rounded">
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          className="border flex-1 rounded p-2"
          placeholder="Type message..."
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 ml-2 rounded">Send</button>
      </div>
    </div>
  );
};

export default ChatArea;
