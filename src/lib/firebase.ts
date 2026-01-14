import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBLtByJ1Ao6fQjBRul3PIo_XdlaSj4Re_I',
  authDomain: 'tdnortheastartists.firebaseapp.com',
  projectId: 'tdnortheastartists',
  storageBucket: 'tdnortheastartists.firebasestorage.app',
  messagingSenderId: '702535526390',
  appId: '1:702535526390:web:7ad1a9219c0dda7f22c9d7',
  measurementId: 'G-J8LXK5J6D8',
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
