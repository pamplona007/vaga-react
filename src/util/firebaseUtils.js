import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyDTax-OdvEy2tvMH4705ajUBgYe-K7Rh28",
    authDomain: "teste-vaga-react.firebaseapp.com",
    projectId: "teste-vaga-react",
    storageBucket: "teste-vaga-react.appspot.com",
    messagingSenderId: "298138065927",
    appId: "1:298138065927:web:057f27fa41d9f830da1ea2"
};

export const firebaseImpl = firebase.initializeApp(config);
export const db = firebase.firestore();