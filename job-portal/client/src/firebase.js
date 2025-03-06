// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlCmdAdqe96A0fN35IPnR5_xSnYwaEAFw",
  authDomain: "job-portal-370b2.firebaseapp.com",
  projectId: "job-portal-370b2",
  storageBucket: "job-portal-370b2.appspot.com",
  messagingSenderId: "909022675017",
  appId: "1:909022675017:web:a83435567a5185ff98bf98",
  measurementId: "G-5BCWLMC1WE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
