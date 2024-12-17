
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { setDoc, collection, doc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)

export const  loginFunction = async (username, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, username, password)
    return true
    //console.log(userCredential.user)
  } catch (error) {
    console.error(error.message)
  }
}

export const signUpFunction = async (username, password,fullname) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, username, password)
    await updateProfile(userCredential.user, {displayName: fullname})
    await setDoc(doc(db, "profiles", userCredential.user.uid), {fullName: fullname})
    return true
  } catch (error) {
    console.error(error)
  }
}
