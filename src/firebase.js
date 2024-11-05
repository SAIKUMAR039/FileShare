import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBIKz-L2CDz2emb0jDkI6CeZfVDEvj1yuc",
  authDomain: "bejo-5314e.firebaseapp.com",
  projectId: "bejo-5314e",
  storageBucket: "bejo-5314e.appspot.com",
  messagingSenderId: "1021064152617",
  appId: "1:1021064152617:web:9c466a316b02a0c4603e38",
  measurementId: "G-8SKXCCGNRY",
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const database = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { storage, database, auth, googleProvider, app };
