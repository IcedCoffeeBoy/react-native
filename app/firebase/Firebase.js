import * as firebase from "firebase";

/* Change the firebase account details*/

export default class Firebase {
   static initialise() {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyBQ0RYtbgBvJJ6XSzM7NrH6KfXcOkg65NM",
                authDomain: "proffer-95a67.firebaseapp.com",
                databaseURL: "https://proffer-95a67.firebaseio.com",
                projectId: "proffer-95a67",
                storageBucket: "proffer-95a67.appspot.com",
                messagingSenderId: "1052256119547"
            });
        }
    }
}

/*
export default class Firebase {
   static initialise() {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyC1-hRLhNBPq7DNkOG5iX644yLvPfY1U7A",
                authDomain: "my-first-project-5ee38.firebaseapp.com",
                databaseURL: "https://my-first-project-5ee38.firebaseio.com",
                projectId: "my-first-project-5ee38",
                storageBucket: "my-first-project-5ee38.appspot.com",
                messagingSenderId: "5368545924"
            });
        }
    }
}
*/