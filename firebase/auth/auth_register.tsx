// auth_register.tsx

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export const signUp = async (name: string, username: string, email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update display name in Authentication
  await updateProfile(user, {
    displayName: username,
  });

  // Save additional user info to Firestore
  await setDoc(doc(db, 'users', user.uid), {
    fullName: name,
    username: username,
    email: email,
    createdAt: new Date(),
    uid: user.uid,
  });
};

//index.tsx 
export async function signIn(email: string, password: string): Promise<void> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("User signed in:", user);
  } catch (error: any) {
    console.error("Sign-in error:", error.code, error.message);
    throw error; // Re-throw so you can catch it in the screen
  }
}
