import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { createContext, useContext, useState } from "react";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useEffect } from "react";
import axios from "axios";
import getBaseURL from "../utils/baseURL";

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

    const changePassword = async (currentPassword, newPassword) => {
        const user = auth.currentUser;
        if (!user || !user.email) {
            throw new Error("User not authenticated");
        }
        
        // Reauthenticate user before changing password
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        
        // Update password
        await updatePassword(user, newPassword);
    }

    // Function to refresh user data from backend
    const refreshUserData = async () => {
        if (auth.currentUser) {
            try {
                const response = await axios.get(`${getBaseURL()}/api/users/${auth.currentUser.email}`);
                if (response.data) {
                    const fullUserData = {
                        ...auth.currentUser,
                        ...response.data,
                        email: auth.currentUser.email,
                        photoURL: auth.currentUser.photoURL || response.data.avatar,
                        // Đảm bảo các field quan trọng được cập nhật
                        rewardPoints: response.data.rewardPoints || 0,
                        tier: response.data.tier || 'bronze',
                        username: response.data.username,
                        phone: response.data.phone,
                        address: response.data.address,
                        city: response.data.city,
                        country: response.data.country
                    };
                    setCurrentUser(fullUserData);
                    return fullUserData;
                }
            } catch (error) {
                console.error("Error refreshing user data:", error);
            }
        }
        return null;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Fetch user data from MongoDB backend using /api/users endpoint
                    const response = await axios.get(`${getBaseURL()}/api/users/${user.email}`);
                    
                    if (response.data) {
                        // Merge Firebase auth data with MongoDB user data
                        const fullUserData = {
                            ...user,
                            ...response.data,
                            // Keep Firebase uid and email
                            email: user.email,
                            photoURL: user.photoURL || response.data.avatar,
                            // Đảm bảo các field quan trọng
                            rewardPoints: response.data.rewardPoints || 0,
                            tier: response.data.tier || 'bronze',
                            username: response.data.username,
                        };
                        setCurrentUser(fullUserData);
                    } else {
                        // If user not found in MongoDB, create it
                        await axios.put(`${getBaseURL()}/api/auth/${user.email}`, {
                            username: user.displayName || user.email.split('@')[0],
                            email: user.email,
                            avatar: user.photoURL || ''
                        });
                        
                        // Fetch again after creation
                        const newUserResponse = await axios.get(`${getBaseURL()}/api/users/${user.email}`);
                        const fullUserData = {
                            ...user,
                            ...newUserResponse.data,
                            email: user.email,
                            photoURL: user.photoURL || newUserResponse.data.avatar,
                            rewardPoints: newUserResponse.data.rewardPoints || 0,
                            tier: newUserResponse.data.tier || 'bronze',
                        };
                        setCurrentUser(fullUserData);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    // If fetch fails, use Firebase user data only
                    setCurrentUser(user);
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        // Auto refresh user data every 5 minutes to keep data synchronized
        const refreshInterval = setInterval(async () => {
            if (auth.currentUser) {
                await refreshUserData();
            }
        }, 5 * 60 * 1000); // 5 minutes

        return () => {
            unsubscribe();
            clearInterval(refreshInterval);
        };
    }, []);


    const value = { currentUser, loading, setCurrentUser, registerUser, loginUser, singInWithGoogle, logoutUser, refreshUserData, changePassword };
    return (<AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
    )
}