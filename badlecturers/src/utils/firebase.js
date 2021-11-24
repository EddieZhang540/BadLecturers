import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import { collection, doc, setDoc, getDoc } from 'firebase/firestore'
import 'firebase/compat/auth'
import dotenv from 'dotenv'
dotenv.config()

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

const handleLogin = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const getUser = await getDoc(userRef);

    if (!getUser.exists()) {
        await setDoc(doc(db,"users",user.uid), {
            name: user.displayName,
            courses: []
        })
    }
}

export const signInWithGoogle = () => {
    auth.signInWithPopup(googleProvider).then((result) => {
        handleLogin(result.user);

        // The signed-in user info.
        const user = result.user;
        console.log(user);

    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;

    });
}
export const logOut = () => {
    auth.signOut().then(() => {
        console.log('logged out')
    }).catch((error) => {
        console.log(error.message)
    })
}

export default firebase;