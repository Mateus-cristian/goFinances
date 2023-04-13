// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTqmOPJwXjZ_a3-yf156OBUnWXbBYWsLM",
  authDomain: "gofinance-372202.firebaseapp.com",
  projectId: "gofinance-372202",
  storageBucket: "gofinance-372202.appspot.com",
  messagingSenderId: "69456234871",
  appId: "1:69456234871:web:a6a823f4cf7239dec2f972",
  measurementId: "G-CXXQV1ZM8Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
