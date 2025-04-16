import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase"; // ✅ Corrected path

const createUserInFirestore = async (user) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    });
  }
};