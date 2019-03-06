 let appFireBase = {};
 // Initialize Firebase
( () => {
 const config = {
    apiKey: "AIzaSyDricH8xG2qh-uO35M9_Q5F4SvssT6MiUg",
    authDomain: "tejiendo-en-azul.firebaseapp.com",
    databaseURL: "https://tejiendo-en-azul.firebaseio.com",
    projectId: "tejiendo-en-azul",
    storageBucket: "tejiendo-en-azul.appspot.com",
    messagingSenderId: "171386471320"
  };
  firebase.initializeApp(config);
  appFireBase= firebase;
 }) ()

