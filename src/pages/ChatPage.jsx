import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import ChatSidebar from '../components/ChatSidebar';
import ChatArea from '../components/ChatArea';
import ChatList from '../components/ChatList';

export default function ChatPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatsData = [];
      querySnapshot.forEach((doc) => {
        chatsData.push({ id: doc.id, ...doc.data() });
      });
      setChats(chatsData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    // Find or create a chat with the selected user
    const existingChat = chats.find(chat => 
      chat.participants.includes(user.id) && chat.participants.includes(currentUser.uid)
    );
    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      // Create a new chat if none exists
      const newChat = {
        participants: [user.id, currentUser.uid],
        createdAt: new Date(),
        lastMessage: 'Chat started',
        lastMessageTime: new Date(),
        type: 'private'
      };
      setSelectedChat(newChat);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 p-4">
        <div className="bg-white rounded-lg shadow-lg h-full overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
          </div>
          <div className="p-4">
            <ChatList onSelectUser={handleSelectUser} />
          </div>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="w-2/3 p-4">
        <ChatArea chat={selectedChat} />
      </div>
    </div>
  );
}
  