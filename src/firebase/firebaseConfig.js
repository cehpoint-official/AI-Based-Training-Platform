// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAW6hNfPMhiouV7ZZ_IzYI6szTBUpy94Zw",
  authDomain: "ai-based-training-platfo-ca895.firebaseapp.com",
  projectId: "ai-based-training-platfo-ca895",
  storageBucket: "ai-based-training-platfo-ca895.appspot.com",
  messagingSenderId: "922681810547",
  appId: "1:922681810547:web:8b5e692405eea5261c9406",
  measurementId: "G-NWN1KEM01N"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth=getAuth();
export const db=getFirestore(app);
export default app; 