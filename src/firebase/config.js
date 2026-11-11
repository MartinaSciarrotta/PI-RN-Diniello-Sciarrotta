import app from 'firebase/app';
import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBrQRKB7BwQ_SLSvEnqNYHIkbDxUDn5zfg",
    authDomain: "rn-firebase-aa392.firebaseapp.com",
    projectId: "rn-firebase-aa392",
    storageBucket: "rn-firebase-aa392.firebasestorage.app",
    messagingSenderId: "1056129602472",
    appId: "1:1056129602472:web:f280b392b3a957ab4a439d"
};

app.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = app.firestore();
