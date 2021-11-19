import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'
import 'firebase/compat/auth'



firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
    auth.signInWithPopup(googleProvider).then((result) => {
        console.log("Success!")

        // The signed-in user info.
        const user = result.user;
        // console.log(JSON.stringify(user));
        // ...
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