// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCAtv7tSmh-ujvuJY2SbAKbE7Ik3Xnr0s",
  authDomain: "prepmate-83949.firebaseapp.com",
  projectId: "prepmate-83949",
  storageBucket: "prepmate-83949.firebasestorage.app",
  messagingSenderId: "905308873600",
  appId: "1:905308873600:web:340b5c8d619c0fd8de9765",
  measurementId: "G-YPKBPLJM4N"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp()
export const auth = getAuth(app);
export const db = getFirestore(app);
