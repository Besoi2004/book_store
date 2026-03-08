import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { createContext, use, useContext, useState } from "react";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => {
    return useContext(AuthContext);
};

const googleProvider = new GoogleAuthProvider();

//authProvider
export const AuthProvide = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const[loading, setLoading] = useState(true);

    const registerUser = async (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const loginUser = async (email, password) => {
        return await signInWithEmailAndPassword(auth, email, password);
    }

    const singInWithGoogle = async () => {
        return await signInWithPopup(auth, googleProvider);
    }

    const logoutUser = async () => {
        return await signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);

            if (user) {
                const {email, displayName, photoURL} = user;
                const userData = {
                    email,username: displayName,
                    photo: photoURL
                };
            }
        });

        return () => unsubscribe();
    }, []);


    const value = { currentUser, setCurrentUser, registerUser, loginUser, singInWithGoogle, logoutUser };
    return (<AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
    )
}