import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVqTkYjWSTnO1JVW9oDyDlzUQ1RWv72ng",
  authDomain: "projectdb-55aba.firebaseapp.com",
  projectId: "projectdb-55aba",
  storageBucket: "projectdb-55aba.firebasestorage.app",
  messagingSenderId: "95303644022",
  appId: "1:95303644022:web:62d79ba2a094c2a1b0c057"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);