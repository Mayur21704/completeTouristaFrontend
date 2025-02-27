// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAGivc2Sd2odtqiWSUO5zNjuc59Q-XoASQ",
  authDomain: "temptourista.firebaseapp.com",
  projectId: "temptourista",
  storageBucket: "temptourista.firebasestorage.app",
  messagingSenderId: "709061964602",
  appId: "1:709061964602:web:3217a78f3ec5e6ac95d603"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account', // This will force the account selection prompt
});

export { auth,provider };



