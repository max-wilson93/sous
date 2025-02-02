// firebaseAuth.js
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase'; // Import the initialized Firebase app

// Get the Auth instance
const auth = getAuth(app);

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Sign-in error:', error);
    throw new Error(error.message);
  }
};

// Create a new user
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Sign-up error:', error);
    throw new Error(error.message);
  }
};

// Sign out the user
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-out error:', error);
    throw new Error(error.message);
  }
};

// Set up a listener for auth state changes (e.g., when user signs in/out)
export const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};