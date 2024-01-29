import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';

// Tu nueva configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAQg9wKwKYUVLMS1P8lv_vESWcClMwWnx4",
  authDomain: "inventario-react-8fd28.firebaseapp.com",
  projectId: "inventario-react-8fd28",
  storageBucket: "inventario-react-8fd28.appspot.com",
  messagingSenderId: "248923956251",
  appId: "1:248923956251:web:5039d8c6c61f4bca8ac4be"
};

// Inicializa Firebase con la nueva configuración
export const app = firebase.initializeApp(firebaseConfig);
