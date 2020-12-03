importScripts('https://www.gstatic.com/firebasejs/8.0.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.0.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyCVZGT1P1ElAL_k8r86WFPvWSKAQzSLhHE",
    authDomain: "sanminanewsapp.firebaseapp.com",
    databaseURL: "https://sanminanewsapp.firebaseio.com",
    projectId: "sanminanewsapp",
    storageBucket: "sanminanewsapp.appspot.com",
    messagingSenderId: "625108487289",
    appId: "1:625108487289:web:5e3ac4c826811031bb18a8"
  });
  
  const messaging = firebase.messaging();
