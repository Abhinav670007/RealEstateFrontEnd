// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "merntate.firebaseapp.com",
  projectId: "merntate",
  storageBucket: "merntate.appspot.com",
  messagingSenderId: "1093901837453",
  appId: "1:1093901837453:web:8806e1c2d53770266ceec4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);