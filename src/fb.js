
import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
  apiKey: "AIzaSyCSSfSZbiqMDrRhVgW8APgoQM31c8A6INM",
  authDomain: "fir-storage-3d8f0.firebaseapp.com",
  databaseURL: "https://fir-storage-3d8f0-default-rtdb.firebaseio.com",
  projectId: "fir-storage-3d8f0",
  storageBucket: "fir-storage-3d8f0.appspot.com",
  messagingSenderId: "184007575510",
  appId: "1:184007575510:web:7df6a572fc1757f2790677"
};

// Inicializar la aplicación de Firebase
firebase.initializeApp(firebaseConfig);
const busqueda = firebase.firestore();

// Obtener la instancia de Firestore
const db = firebase.firestore();

export { db }; // Exportar la instancia de Firestore

export default firebase; // Exportar la instancia de Firebase
