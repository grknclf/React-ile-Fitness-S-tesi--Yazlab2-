import { useEffect } from 'react';
import { auth, firestore } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useState, useContext, createContext } from 'react';
import { User } from '../classes/user';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
        // Firestore'dan kullanıcı bilgilerini al
        const userDocRef = doc(firestore, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // Firestore'dan gelen bilgilerle User nesnesi oluştur
          const userData = userDoc.data();
          const user = new User(userData.uid, userData.firstName, userData.lastName, userData.birthDate, userData.gender, firebaseUser.email, userData.phoneNumber, userData.profilePicture, userData.role, userData.status);
          setCurrentUser(user);
        } else {
          // Kullanıcı bilgisi yoksa null olarak ayarla
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
  });

  return () => unsubscribe(); // Dinleyiciyi temizle
}, []);

return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
