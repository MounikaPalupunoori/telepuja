import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

// Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_d9IeYd44yOZQo-h75i07Lck9MF39kxw",
  authDomain: "telepuja-qa-342010.firebaseapp.com",
  projectId: "telepuja-qa-342010",
  storageBucket: "telepuja-qa-342010.appspot.com",
  messagingSenderId: "65250826672",
  appId: "1:65250826672:web:dfda2b6b031cc258f55e75",
  measurementId: "G-13Z09FL4BR"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const storage = firebase.storage();
export const firestore = firebase.firestore();

export const user  = firebase.auth().currentUser;


export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();


//export const database = firebase.database();

