// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTKZm2aEMkPHfQF2Mpo7lUSTzprc_rx8c",
  authDomain: "ai-travel-planner-17940.firebaseapp.com",
  projectId: "ai-travel-planner-17940",
  storageBucket: "ai-travel-planner-17940.firebasestorage.app",
  messagingSenderId: "1064942363203",
  appId: "1:1064942363203:web:b776bdb5c7bc7db49eeaf6",
  measurementId: "G-7HS2PZWS9N"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
//const analytics = getAnalytics(app);