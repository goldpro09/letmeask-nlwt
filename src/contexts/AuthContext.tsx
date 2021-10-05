import firebase from 'firebase/compat';
import { createContext, ReactNode, useState, useEffect } from 'react';
import { auth } from '../services/firebase';

type User = {
  id: string;
  name: string;
  avatar: string;
}
type AuthContextType = {
  user: User | undefined;
  singnInWithGoogle: ()=>Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType);

type AuthContextProviderProps = {
  children: ReactNode;
}

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user) {
        const { displayName, photoURL, uid } = user;
  
        if(!displayName || !photoURL) {
          throw new Error("Missing info from Google account!");
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        });
      }
    });

    return ()=>{
      unsubscribe();
    }
  }, []);

  async function singnInWithGoogle() {    
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);
    
    if(result.user) {
      const { displayName, photoURL, uid } = result.user;

      if(!displayName || !photoURL) {
        throw new Error("Missing info from Google account!");
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      });
    }
    
  }
  
  return (
    <AuthContext.Provider value={{ user, singnInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  );
}