import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";       
import { getStorage } from "firebase/storage";  

const firebaseConfig = {
  apiKey: "AIzaSyC_tPwQtqrWkYqm-WijuaKw2aKq2C_vaOg",
  authDomain: "skillsphere-pro.firebaseapp.com",
  projectId: "skillsphere-pro",
  storageBucket: "skillsphere-pro.firebasestorage.app",
  messagingSenderId: "878553030669",
  appId: "1:878553030669:web:2dcedc202dcf35be2ef544",
  measurementId: "G-G8HQ9N91PK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);        
export const storage = getStorage(app);  