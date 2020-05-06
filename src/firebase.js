import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCYc9e-QpWTzhlalvajlOB01EV5dAFXWLA",
  authDomain: "markdown-preska.firebaseapp.com",
  databaseURL: "https://markdown-preska.firebaseio.com",
  projectId: "markdown-preska",
  storageBucket: "",
  messagingSenderId: "203173993293",
  appId: "1:203173993293:web:582d73eaae443234"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.database();
