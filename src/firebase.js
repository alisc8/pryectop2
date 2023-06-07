
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSSfSZbiqMDrRhVgW8APgoQM31c8A6INM",
  authDomain: "fir-storage-3d8f0.firebaseapp.com",
  databaseURL: "https://fir-storage-3d8f0-default-rtdb.firebaseio.com",
  projectId: "fir-storage-3d8f0",
  storageBucket: "fir-storage-3d8f0.appspot.com",
  messagingSenderId: "184007575510",
  appId: "1:184007575510:web:7df6a572fc1757f2790677"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export const auth = getAuth(app)
