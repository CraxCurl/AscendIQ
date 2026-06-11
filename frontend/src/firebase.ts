import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCYzksQXDvB5TbZtx37AWRZ4pEZvQ9hAdI',
  authDomain: 'ascendiq.firebaseapp.com',
  projectId: 'ascendiq',
  storageBucket: 'ascendiq.firebasestorage.app',
  messagingSenderId: '362853373355',
  appId: '1:362853373355:web:7b90369a5a3ae7f0e12eee',
  measurementId: 'G-E0CMBQ3BKT',
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: 'select_account' });
