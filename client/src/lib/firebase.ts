import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBLtByJ1Ao6fQjBRul3PIo_XdlaSj4Re_I",
  authDomain: "tdnortheastartists.firebaseapp.com",
  projectId: "tdnortheastartists",
  storageBucket: "tdnortheastartists.firebasestorage.app",
  messagingSenderId: "702535526390",
  appId: "1:702535526390:web:7ad1a9219c0dda7f22c9d7",
  measurementId: "G-J8LXK5J6D8"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function uploadToFirebase(fileData: string, fileName: string, path: string) {
  const storageRef = ref(storage, `${path}/${Date.now()}_${fileName}`);
  // Data URL format: data:image/png;base64,....
  const base64Data = fileData.split(',')[1];
  const format = fileData.split(';')[0].split(':')[1];
  
  await uploadString(storageRef, base64Data, 'base64', { contentType: format });
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}
