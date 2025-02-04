/* eslint-disable import/no-unresolved */

// Importar funciones necesarias para usar firebase (SDKs)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js';
import {
  getFirestore,
  collection,
  Timestamp,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from 'https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js';

// Configuración firebase v7.20.0
const firebaseConfig = {
  apiKey: 'AIzaSyDs1DSRW6_kwqsLzPZWUUtUxUdL8-ZDFf8',
  authDomain: 'mewple.firebaseapp.com',
  databaseURL: 'https://mewple-default-rtdb.firebaseio.com/',
  projectId: 'mewple',
  storageBucket: 'mewple.appspot.com',
  messagingSenderId: '796773484437',
  appId: '1:796773484437:web:e3e0968973725fff71d89c',
  measurementId: 'G-8S82JZCCV4',
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// signInWithRedirect(auth, provider);

// Crear Usuario en firebase con correo y contraseña
export const createUser = (emailSignup, passwordSignup) => {
  createUserWithEmailAndPassword(auth, emailSignup, passwordSignup)
    .then((userCredential) => {
      window.location.hash = '#/login';
      // Signed in
      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: name,
      });
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      console.log('ya tenías tu cuenta registrada 😸');
    });
};
// [END auth_signup_password_modular]

// Ingreso autenticación google
export const authGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // funcion a muro (then)
      // ...
      window.location.hash = '#/feed';
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
};

export const signed = (emailSignup, passwordSignup) => {
  signInWithEmailAndPassword(auth, emailSignup, passwordSignup)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
      // redireccionar al muro
      console.log('validando');
      window.location.hash = '#/feed';
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

// Aqui esta el logout
export const signOutUser = () => {
  signOut(auth)
    .then(() => {
      window.location.hash = '#/login';
      console.log('Te has deslogeado con exito ;)');
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
      console.log(error);
    });
};

// Aqui esta el observador
export const observer = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;

      if (window.location.hash !== '#/newPost') {
        window.location.hash = '#/feed';
      }
      // ...
    } else if (!user) {
      if (window.location.hash !== '#/register') {
        window.location.hash = '#/login';
      }
      // User is signed out
      // ...
    }
  });
};

// DESDE AQUI INICIA FIRESTORE
const db = getFirestore(app);

// agregar datos.
export const posting = async (gameTitle, description) => {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      username: auth.currentUser.displayName,
      userId: auth.currentUser.uid,
      boardgame: gameTitle,
      description,
      datepost: Timestamp.fromDate(new Date()),
      likesnum: [], /* number */

    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const printPost = (callback) => {
  const q = query(collection(db, 'posts'), orderBy('datepost', 'desc'));
  onSnapshot(q, (querySnapshot) => {
    const postedPost = [];
    querySnapshot.forEach((_doc) => {
      postedPost.push({ ..._doc.data(), id: _doc.id });
    });
    callback(postedPost);
  });
};

export const deletePost = async (id) => {
  await deleteDoc(doc(db, 'posts', id));
};

export const editPost = async (id, titleUp, descriptionUp) => {
  const postRef = doc(db, 'posts', id);
  await updateDoc(postRef, {
    boardgame: titleUp,
    description: descriptionUp,
  });
};
