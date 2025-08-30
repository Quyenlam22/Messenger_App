import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile
} from "firebase/auth";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export const authWithEmail = async (email, password, mode = "login", displayName) => {
  try {
    let userCredential;
    if (mode === "register") {
      userCredential = await createUserWithEmailAndPassword(auth, email, password, displayName);

      const user = userCredential.user;

      // ✅ Cập nhật displayName
      await updateProfile(user, { displayName });

      // ✅ Reload để chắc chắn lấy được displayName mới
      await user.reload();

      // Tạo user document trong Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || null,
        phoneNumber: user.phoneNumber || null,
        photoURL: user.photoURL || null,
        providerId: user.providerId || "password",

        // custom fields
        createdAt: Date.now().toString(),
        creationTime: user.metadata.creationTime,
        lastLoginAt: user.metadata.lastLoginAt,  
        lastSignInTime: user.metadata.lastSignInTime,
        lastSeen: serverTimestamp(),
        state: "offline"
      });

      localStorage.setItem("isRegister", "true");
    } else {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("isLogin", "true");
    }

    return userCredential.user;
  } catch (error) {
    console.error("Auth error:", error.message);
    throw error;
  }
};