import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';
import ChatArea from './ChatArea';

export default function ChatPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => doc.data()));
    });

    return unsubscribe;
  }, []);

  return (
    <div className="flex">
      <Sidebar users={users} onSelectUser={setSelectedUser} />
      <ChatArea selectedUser={selectedUser} />
    </div>
  );
}
