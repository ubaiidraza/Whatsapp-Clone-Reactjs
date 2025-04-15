import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState("");
  const auth = getAuth();
  const storage = getStorage();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
          setDisplayName(userData.displayName || "");
          setStatus(userData.status || "");
          setProfilePic(userData.photoURL || null);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading profile:", error);
        setLoading(false);
      }
    };

    if (auth.currentUser) {
      loadUserProfile();
    }
  }, [auth.currentUser]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const storageRef = ref(storage, `profilePics/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        photoURL
      });
      
      setProfilePic(photoURL);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        displayName,
        status
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSignOut = () => {
    signOut(auth).catch((error) => {
      console.error("Error signing out:", error);
    });
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={profilePic || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleUpdateProfile}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Save Changes
            </button>
            
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}