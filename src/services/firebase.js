import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB11E2_2clJWOpdAwo70I-OLpWuPCYWIXM",
  authDomain: "sipsuite-112e3.firebaseapp.com",
  projectId: "sipsuite-112e3",
  storageBucket: "sipsuite-112e3.firebasestorage.app",
  messagingSenderId: "455702437163",
  appId: "1:455702437163:web:e864e050b469b605e1396e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);