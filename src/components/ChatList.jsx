import { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { initializeDefaultUsers } from '../utils/initializeUsers';

const ChatList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        await initializeDefaultUsers();
        
        // Set up real-time listener for users
        const usersRef = collection(db, 'users');
        const usersUnsubscribe = onSnapshot(usersRef, (snapshot) => {
          const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUsers(usersList);
        });

        // Set up real-time listener for messages
        const messagesRef = collection(db, 'messages');
        const messagesQuery = query(messagesRef, orderBy('timestamp', 'desc'));
        const messagesUnsubscribe = onSnapshot(messagesQuery, (snapshot) => {
          const messagesMap = {};
          snapshot.docs.forEach(doc => {
            const message = doc.data();
            if (!messagesMap[message.userId] || message.timestamp > messagesMap[message.userId].timestamp) {
              messagesMap[message.userId] = message;
            }
          });
          setMessages(messagesMap);
        });

        return () => {
          usersUnsubscribe();
          messagesUnsubscribe();
        };
      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {users.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No users available</p>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className="flex items-center p-4 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors duration-200"
          >
            <div className="flex-shrink-0">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                alt={user.name}
                className="h-10 w-10 rounded-full"
              />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {messages[user.id]?.text || 'No messages yet'}
              </p>
            </div>
            {messages[user.id] && (
              <div className="ml-4 text-xs text-gray-500">
                {new Date(messages[user.id].timestamp?.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ChatList;
