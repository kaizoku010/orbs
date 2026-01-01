import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyALa1-gA3Z4kZQ_sCJW1M1yzE8hZyTqFX8",
    authDomain: "myduuka-3bfac.firebaseapp.com",
    databaseURL: "https://myduuka-3bfac-default-rtdb.firebaseio.com",
    projectId: "myduuka-3bfac",
    storageBucket: "myduuka-3bfac.firebasestorage.app",
    messagingSenderId: "604748418248",
    appId: "1:604748418248:web:fb8d25eca7fa41e5d8a9fd"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
