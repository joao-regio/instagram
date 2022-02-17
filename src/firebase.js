import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyB45TTqlK7YncBs52aJMpW25JoJOKQ3lu4",
    authDomain: "instagram-f7161.firebaseapp.com",
    projectId: "instagram-f7161",
    storageBucket: "instagram-f7161.appspot.com",
    messagingSenderId: "281872541724",
    appId: "1:281872541724:web:24d2ba5001ac2c8d8257d9",
    measurementId: "G-MKR7NHSJ34"
})

  
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();

export {db, auth, storage, functions};