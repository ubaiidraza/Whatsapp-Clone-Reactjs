// src/components/ChatList.jsx
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { onSnapshot, collection } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const ChatList = ({ selectUser }) => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), snapshot => {
      const filtered = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.uid !== currentUser?.uid);
      setUsers(filtered);
    });

    return () => unsub();
  }, []);

  return (
    <div className="w-1/3 border-r h-full p-4">
      <h2 className="font-bold mb-4">Chats</h2>
      {users.map(user => (
        <div key={user.uid} onClick={() => selectUser(user)} className="p-2 hover:bg-gray-100 cursor-pointer">
          <div className="font-medium">{user.displayName}</div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
