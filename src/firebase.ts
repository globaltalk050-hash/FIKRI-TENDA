import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, getDocFromServer, doc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

// Auth Helpers
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

// Connection Test
async function testConnection() {
  try {
    // Try to fetch a non-existent doc just to test connectivity
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    console.log("✅ Firebase Firestore Connected Successfully!");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("❌ Firebase Error: The client is offline. Check your configuration.");
    } else {
      console.log("ℹ️ Firebase Connection Test:", error instanceof Error ? error.message : "Handled");
    }
  }
}
testConnection();
