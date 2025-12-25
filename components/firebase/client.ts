// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from'firebase/firestore';
import { get } from "http";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApviKt_Rk09rMMnroQ2VE00z9OnerYRFc",
  authDomain: "prepmate-cdd0c.firebaseapp.com",
  projectId: "prepmate-cdd0c",
  storageBucket: "prepmate-cdd0c.firebasestorage.app",
  messagingSenderId: "461725558012",
  appId: "1:461725558012:web:821d4ab516dbbe8bbfe379",
  measurementId: "G-HXHF0CV9ZN"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig):getApp();
export const auth=getAuth(app);
export const db=getFirestore(app);