import { db } from '../services/firebase';
import { collection, addDoc, getDocs, query, where, doc, setDoc } from 'firebase/firestore';

export const initializeDefaultUsers = async () => {
  try {
    // Check if users already exist
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('id', 'in', ['user1', 'user2']));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.size > 0) {
      console.log('Default users already exist');
      return;
    }

    // Prompt for user names with validation
    let userName1, userName2;
    do {
      userName1 = prompt('Enter name for user 1:', 'John Doe')?.trim();
      if (!userName1) {
        alert('Please enter a valid name for user 1');
      }
    } while (!userName1);

    do {
      userName2 = prompt('Enter name for user 2:', 'Jane Doe')?.trim();
      if (!userName2) {
        alert('Please enter a valid name for user 2');
      }
    } while (!userName2);

    // Create users with additional metadata
    const user1Data = {
      name: userName1,
      id: 'user1',
      createdAt: new Date(),
      lastActive: new Date(),
      status: 'online',
      email: 'user1@example.com',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName1)}&background=random`
    };

    const user2Data = {
      name: userName2,
      id: 'user2',
      createdAt: new Date(),
      lastActive: new Date(),
      status: 'online',
      email: 'user2@example.com',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName2)}&background=random`
    };

    // Add users to Firestore using setDoc for more control
    await Promise.all([
      setDoc(doc(db, 'users', 'user1'), user1Data),
      setDoc(doc(db, 'users', 'user2'), user2Data)
    ]);

    // Create a default chat between these users
    const chatData = {
      participants: ['user1', 'user2'],
      createdAt: new Date(),
      lastMessage: 'Chat started',
      lastMessageTime: new Date(),
      type: 'private'
    };

    await addDoc(collection(db, 'chats'), chatData);

    console.log('Default users and chat created successfully');
    return true;
  } catch (error) {
    console.error('Error initializing users:', error);
    alert('Failed to initialize users. Please try again.');
    throw error;
  }
}; 