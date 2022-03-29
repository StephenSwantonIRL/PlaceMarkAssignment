
import dotenv from "dotenv";

export const firebaseConfig = {
  apiKey: process.env.firebase_apikey,
  authDomain: "placemark-v1.firebaseapp.com",
  databaseURL: "https://placemark-v1-default-rtdb.firebaseio.com",
  projectId: "placemark-v1",
  storageBucket: "placemark-v1.appspot.com",
  messagingSenderId: process.env.firebase_messagingSenderId,
  appId: process.env.firebase_appid,
};
